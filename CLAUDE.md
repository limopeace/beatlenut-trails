# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Beatlenuts-GR is a Node.js-based API server application using Express, following a modular architecture with MVC pattern.

### Key Technologies
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Architecture
The application follows a modular architecture with separation of concerns:
- Express for HTTP handling
- Controllers for request processing
- Services for business logic
- Models for data representation
- Configuration management using config modules
- Potential for database integration (MongoDB configuration included)

## Development Environment

### Setup
```bash
# Install dependencies
npm install
```

### Running the Application
```bash
# Start the server
npm start

# Development mode with auto-restart
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npx jest tests/specific-file.test.js

# Run tests with coverage
npx jest --coverage
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code with Prettier
npm run format
```

## Code Organization

### Directory Structure
```
beatlenuts-gr/
├── config/             # Configuration files
├── src/                # Source code
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── index.js        # Application entry point
├── tests/              # Test files
│   ├── controllers/    # Controller tests
│   ├── services/       # Service tests
│   └── utils/          # Utility tests
├── docs/               # Documentation
├── .eslintrc.js        # ESLint configuration
├── jest.config.js      # Jest configuration
├── package.json        # npm package configuration
└── README.md           # Project documentation
```

### Key Components
- **Application Setup**: `src/index.js` - Sets up Express app, middleware, and error handling
- **Routes**: `src/routes/index.js` - Main router that includes all route modules
- **Controllers**: `src/controllers/` - Handle HTTP requests and delegate to services
- **Services**: `src/services/` - Contain business logic and interact with models
- **Models**: `src/models/` - Define data structures and validation
- **Middleware**: `src/middleware/` - Custom Express middleware
- **Utils**: `src/utils/` - Helper functions and utilities
- **Configuration**: `config/default.js` - Application configuration

## API Structure

### RESTful Endpoints
The API follows RESTful conventions:
- `GET /` - Welcome message
- `GET /examples` - Get all examples
- `GET /examples/:id` - Get example by ID
- `POST /examples` - Create a new example

## Best Practices

### Code Style
- Use ESLint and Prettier for consistent code style
- Follow the configured rules in .eslintrc.js

### Testing
- Write tests for all new features
- Maintain good test coverage
- Follow the existing test patterns for controllers, services, and utilities

### Error Handling
- Use try/catch blocks in async functions
- Pass errors to Express error middleware using `next(error)`
- Handle expected errors with appropriate status codes

### Configuration
- Use the config module for managing environment-specific settings
- Never hardcode sensitive values

### Documentation
- Add JSDoc comments to functions and classes
- Keep API documentation in `docs/API.md` up to date

### Git Workflow
- Create feature branches from main
- Write meaningful commit messages
- Keep commits focused on single changes