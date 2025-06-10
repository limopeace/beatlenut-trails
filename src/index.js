// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('../config/default');
const routes = require('./routes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { responseTime, healthCheck } = require('./middleware/monitor');
const { NotFoundError } = require('./utils/errors');
const { connectDB } = require('./utils/database');
const setupSwagger = require('./utils/swagger');
const { retryMiddleware } = require('./utils/retry');

// Set environment variable if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000; // Use port 4000 for backend API

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
}

// Security and monitoring middleware
// Set security HTTP headers
app.use(helmet());

// Response time tracking
app.use(responseTime);

// Health check endpoint
app.use(healthCheck({
  path: '/health',
  detailed: process.env.NODE_ENV === 'development'
}));

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter); // Apply rate limiting to all API routes

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Custom middleware
app.use(logger);

// Add retry middleware for server errors
app.use(retryMiddleware({
  maxRetries: config.requestLimits.maxRetries,
  delayMs: config.requestLimits.retryDelayMs
}));

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api', routes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Handle 404 - Route not found
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Global error handling middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  // Set server timeout
  server.timeout = config.server.timeout;
  console.log(`Server timeout set to ${config.server.timeout}ms`);
}

module.exports = app;