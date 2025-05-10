const express = require('express');
const config = require('../config/default');
const routes = require('./routes');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || config.server.port;

// Middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;