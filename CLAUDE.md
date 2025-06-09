# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated: 26 May 2025**

## Project Overview

Beatlenuts-GR is a full-stack web application featuring a travel services website and Ex-Servicemen (ESM) marketplace with complete admin integration.

### Key Technologies

#### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework  
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

#### Frontend
- **Next.js 13+** - React framework with app router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - API client
- **Zod** - Form validation
- **React Hook Form** - Form handling

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

## 🚨 CLAUDE CODE BUILD ISSUE SOLUTIONS

### **Issue:** npm run build times out after 2 minutes in Claude Code

### **RECOMMENDED SOLUTIONS (in order of preference):**

#### **1. Use Enhanced Timeout Script**
```bash
# From frontend directory
./build-with-timeout.sh
```
**Purpose:** Sets CLAUDE_COMMAND_TIMEOUT=300000 environment variable

#### **2. Use Chained Command Approach**
```bash
# From frontend directory  
./build-chained.sh
```
**Purpose:** Breaks build into smaller steps that Claude Code handles better

#### **3. Use Fast Build Script**
```bash
# From frontend directory
npm run build:fast
```
**Purpose:** Optimized build with timeout protection (created locally)

#### **4. Use Individual Commands (Avoid pipes, use chaining)**
```bash
# Instead of: cd frontend && npm run build
# Use separate commands:
cd frontend
npm run build
```

#### **5. Quick Validation First**
```bash
# Always check syntax before attempting builds
npm run validate
```

### **Environment Variables for Claude Code:**
```bash
export CLAUDE_COMMAND_TIMEOUT=90000    # 90 seconds (realistic for Claude Code workflow)
export NODE_OPTIONS="--max_old_space_size=2048"
export NEXT_TELEMETRY_DISABLED=1
```

### **Build Scripts Available:**
- `npm run build:fast` - Optimized build with timeout protection
- `npm run build:quick` - Quick validation only  
- `npm run build:check` - TypeScript check only
- `npm run validate` - Complete quick validation
- `./build-with-timeout.sh` - Extended timeout approach
- `./build-chained.sh` - Step-by-step chained approach
- `./claude-build.sh` - Multiple strategies in one script

### **If Builds Still Fail:**
1. **Check for syntax errors first:** `npm run validate`
2. **Try manual build outside Claude Code:** `npm run build`
3. **Use CI/CD for production builds**

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
├── frontend/           # Next.js frontend
│   ├── src/           # Frontend source
│   ├── public/        # Static assets
│   ├── build-*.sh    # Claude Code build solutions
│   └── package.json   # Frontend dependencies
├── tests/              # Test files
├── docs/               # Documentation
└── CLAUDE.md          # This file
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

### ESM Portal API
- `POST /api/auth/esm-login` - ESM portal login
- `POST /api/auth/esm-register` - ESM portal registration
- `GET /api/esm-products` - List all products
- `POST /api/esm-products` - Create product (seller)
- `GET /api/esm-services` - List all services
- `POST /api/esm-services` - Create service (seller)

### Admin API
- `GET /api/admin/esm/sellers` - Manage sellers
- `PUT /api/admin/esm/sellers/:id/approve` - Approve seller
- `GET /api/admin/esm/analytics` - View analytics

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

## ESM Portal Specific Guidelines

### Authentication
- Use `esmApiClient` for ESM-specific API calls
- Use `adminApiClient` for admin-specific API calls
- Implement role-based access (seller/buyer/admin)
- Handle token expiration gracefully

### Frontend State Management
- Use `useEsmAuth` hook for authentication state
- Use `useAdminAuth` hook for admin authentication
- Implement loading states for all async operations
- Show proper error messages to users
- Use `LoadingSpinner` and `ErrorDisplay` components

### Form Validation
- Use Zod schemas for type-safe validation
- Validate on client and server side
- Provide clear error messages

### API Services
- `sellersService` - Seller management operations
- `approvalsService` - Approval workflow operations
- `dashboardService` - Dashboard statistics
- `orderService` - Order management (ready for implementation)

### Testing
- Run ESM portal tests: `node tests/esm-portal-comprehensive-test.js`
- Run admin auth tests: `node tests/admin-auth-test.js`
- Test both success and error paths
- Mock external services in tests

### Documentation
See comprehensive guides in `/docs`:
- [ESM Portal Implementation](docs/ESM_PORTAL_COMPLETE_IMPLEMENTATION.md)
- [Admin Integration](docs/ESM_PORTAL_ADMIN_INTEGRATION.md)
- [Admin Integration Complete](docs/ADMIN_INTEGRATION_COMPLETE.md)
- [API Documentation](docs/API_COMPLETE.md)
- [Testing Guide](docs/TESTING_GUIDE.md)

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.