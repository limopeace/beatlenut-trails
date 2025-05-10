# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Beatlenuts-GR is a Node.js-based API server application using Express.

### Key Technologies
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Architecture
The application follows a modular architecture with separation of concerns:
- Express for HTTP handling
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
- `/src` - Source code
  - `index.js` - Application entry point
- `/tests` - Test files
- `/config` - Configuration files
- `/docs` - Documentation

### Key Components
- Express application setup in `src/index.js`
- Configuration in `config/default.js`

## Best Practices

### Code Style
- Use ESLint and Prettier for consistent code style
- Follow the configured rules in .eslintrc.js

### Testing
- Write tests for all new features
- Maintain good test coverage

### Configuration
- Use the config module for managing environment-specific settings
- Never hardcode sensitive values