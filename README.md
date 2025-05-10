# Beatlenuts-GR API

A robust Node.js Express RESTful API with modular architecture and comprehensive security features.

![Node.js](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)
![Express](https://img.shields.io/badge/express-%5E4.18.2-blue)
![MongoDB](https://img.shields.io/badge/mongodb-%5E8.14.2-green)
![License](https://img.shields.io/badge/license-ISC-yellow)

## 🚀 Features

- **Modular Architecture**: Model-View-Controller (MVC) pattern with service and repository layers
- **RESTful API**: Follows REST principles with proper HTTP methods and status codes
- **Authentication**: JWT-based authentication with role-based access control
- **Data Validation**: Input validation using Joi with detailed error messages
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **API Documentation**: Interactive API documentation with Swagger/OpenAPI
- **Database Integration**: MongoDB integration with Mongoose ODM
- **Security Features**: CORS, Helmet, rate limiting, and input sanitization
- **Testing**: Unit and integration tests with Jest and Supertest
- **Code Quality**: ESLint and Prettier for consistent code style
- **Health Monitoring**: Health check endpoint and performance monitoring

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (optional for full functionality)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd beatlenuts-gr

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

## 🏃‍♂️ Running the Application

```bash
# Start the server
npm start

# Start with automatic reloading for development
npm run dev
```

The server will start at http://localhost:3000

## 📚 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and get JWT token
- `GET /auth/profile` - Get current user profile (protected)

#### Examples
- `GET /examples` - Get all examples
- `GET /examples/:id` - Get example by ID
- `POST /examples` - Create a new example (protected)
- `DELETE /examples/:id` - Delete example (admin only)

#### System
- `GET /` - API information
- `GET /health` - System health check
- `GET /swagger.json` - Swagger API specification

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## 📁 Project Structure

```
beatlenuts-gr/
├── config/                    # Configuration files
├── src/                       # Source code
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── errorHandler.js    # Error handling middleware
│   │   ├── logger.js          # Request logging
│   │   ├── monitor.js         # Performance monitoring
│   │   └── validator.js       # Request validation
│   ├── models/                # Data models
│   │   ├── mongoose/          # Mongoose schema definitions
│   │   └── user.js            # User model
│   ├── repositories/          # Data access layer
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   │   ├── database.js        # Database connection
│   │   ├── errors.js          # Custom error classes
│   │   ├── sanitizer.js       # Input sanitization
│   │   └── swagger.js         # API documentation
│   └── index.js               # Application entry point
├── tests/                     # Test files
│   ├── integration/           # API integration tests
│   ├── unit/                  # Unit tests
│   └── setup.js               # Test configuration
├── .env.example               # Example environment variables
├── .eslintrc.js               # ESLint configuration
├── .gitignore                 # Git ignore file
├── CLAUDE.md                  # Claude Code guidance
├── jest.config.js             # Jest configuration
├── package.json               # npm package configuration
└── README.md                  # Project documentation
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and customize the following variables:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/beatlenuts-gr
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
CORS_ORIGIN=*
```

## 🛡️ Security Features

- **JWT Authentication**: Secure authentication using JSON Web Tokens
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Protection**: Configurable Cross-Origin Resource Sharing
- **Helmet**: HTTP headers security
- **Rate Limiting**: Prevents brute force and DoS attacks
- **Input Validation**: All inputs are validated before processing
- **Input Sanitization**: Prevent XSS and injection attacks
- **Error Handling**: No sensitive information in error responses

## 📄 License

This project is licensed under the ISC License.