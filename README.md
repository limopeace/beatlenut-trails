# Beatlenuts-GR API & Frontend

A comprehensive travel business platform with a robust Node.js Express RESTful API backend and Next.js frontend. Features include travel services showcase and an Ex-Servicemen (ESM) marketplace.

![Node.js](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen)
![Express](https://img.shields.io/badge/express-%5E4.18.2-blue)
![MongoDB](https://img.shields.io/badge/mongodb-%5E8.14.2-green)
![Next.js](https://img.shields.io/badge/next.js-%5E13.0.0-purple)
![License](https://img.shields.io/badge/license-ISC-yellow)

## 🚀 Features

### Backend API
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

### Frontend
- **Next.js Framework**: Server-side rendering and optimized performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Two Main Sections**:
  - **Travel Website**: Showcasing Northeast India travel experiences
  - **ESM Marketplace**: Platform for Ex-Servicemen to sell products and services
- **TypeScript**: Type-safe codebase for better maintainability
- **Modular Components**: Reusable UI components following best practices
- **Form Validation**: Zod schema validation for type-safe forms
- **API Integration**: Axios-based API client with interceptors

### ESM Portal Features
- **Enhanced Seller Registration**: Multi-step registration with improved UX
  - Comprehensive service categories (OLX/Quikr style)
  - "Other" option with custom categories input
  - Enhanced document upload with visual feedback
  - Real-time validation and progress tracking
- **Product Management**: CRUD operations for products with image upload
- **Service Listings**: Service providers can list their offerings
- **Authentication**: Separate auth system for ESM portal
- **Admin Oversight**: Admin panel integration for monitoring
- **Messaging System**: Built-in communication between buyers and sellers
- **Approval Workflow**: Admin approval system for new sellers
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces

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

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Create .env file from example
cp .env.example .env
```

## 🏃‍♂️ Running the Application

### Quick Start (Recommended)

For local testing, use the automated setup script:

```bash
# Make the script executable (first time only)
chmod +x local-testing.sh

# Start both backend and frontend servers
./local-testing.sh
```

This will:
- Set up environment files
- Install dependencies for both backend and frontend
- Start backend server on port 4000
- Start frontend server on port 3000
- Display helpful testing information

To stop all servers:
```bash
./stop-servers.sh
```

### Manual Setup

#### Backend

```bash
# Start the server
npm start

# Start with automatic reloading for development
npm run dev
```

The backend API server will start at http://localhost:4000

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev
```

The frontend will be available at http://localhost:3000

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health
- **API Documentation**: http://localhost:4000/api-docs (when available)

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

#### ESM Marketplace

**Authentication**
- `POST /api/auth/esm-login` - ESM portal login
- `POST /api/auth/esm-register` - ESM portal registration
- `POST /api/auth/esm-logout` - ESM portal logout
- `GET /api/auth/esm-me` - Get current ESM user
- `PUT /api/auth/esm-profile` - Update ESM profile

**Products**
- `GET /api/esm-products` - List all products
- `GET /api/esm-products/:id` - Get product details
- `POST /api/esm-products` - Create new product (seller only)
- `PUT /api/esm-products/:id` - Update product (seller only)
- `DELETE /api/esm-products/:id` - Delete product (seller only)

**Services**
- `GET /api/esm-services` - List all services
- `GET /api/esm-services/:id` - Get service details
- `POST /api/esm-services` - Create new service (seller only)
- `PUT /api/esm-services/:id` - Update service (seller only)
- `DELETE /api/esm-services/:id` - Delete service (seller only)

For complete documentation:
- [ESM Portal Implementation](docs/ESM_PORTAL_COMPLETE_IMPLEMENTATION.md)
- [ESM Marketplace Guide](docs/ESM_MARKETPLACE.md)
- [Admin Integration](docs/ADMIN_INTERFACE_IMPLEMENTATION.md)

## 🧪 Testing

### Backend Testing (Jest)
```bash
# Run all backend tests
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

### Frontend E2E Testing (Playwright)
```bash
# Navigate to frontend directory first
cd frontend

# Run all end-to-end tests
npm run test:e2e

# Run tests with UI interface
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run specific test suites
npm run test:esm        # ESM Portal tests
npm run test:admin      # Admin Portal tests
npm run test:website    # Main Website tests

# View test report
npm run test:report
```

### Test Coverage
- **ESM Portal**: Registration, login, products, services, responsive design
- **Admin Portal**: Dashboard, sellers, orders, approvals, authentication
- **Main Website**: Homepage, navigation, responsiveness
- **API Integration**: Backend endpoints, error handling

## 📁 Project Structure

```
beatlenuts-gr/
├── config/                    # Configuration files
├── docs/                      # Documentation files
├── frontend/                  # Next.js frontend application
│   ├── public/                # Static assets
│   ├── src/                   # Frontend source code
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components
│   │   └── styles/            # Global styles
│   └── config files           # Next.js configuration
├── src/                       # Backend source code
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Express middleware
│   ├── models/                # Data models
│   │   ├── mongoose/          # Mongoose schema definitions
│   │   └── user.js            # User model
│   ├── repositories/          # Data access layer
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── index.js               # Application entry point
├── tests/                     # Test files
├── .env.example               # Example environment variables
├── CLAUDE.md                  # Claude Code guidance
├── jest.config.js             # Jest configuration
└── package.json               # npm package configuration
```

## 📝 Code Quality

```bash
# Lint backend code
npm run lint

# Format backend code
npm run format

# Lint frontend code
cd frontend && npm run lint

# Format frontend code
cd frontend && npm run format
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [ESM Portal Implementation Summary](docs/ESM_PORTAL_IMPLEMENTATION_SUMMARY.md)
- [Complete API Documentation](docs/API_COMPLETE.md)
- [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md)
- [Testing Guide](docs/TESTING_GUIDE.md)
- [Server Troubleshooting Guide](docs/SERVER_TROUBLESHOOTING.md) - Solutions for common server issues
- [Admin Panel Integration](docs/ESM_PORTAL_ADMIN_INTEGRATION.md)
- [Admin API Client Setup](docs/ADMIN_API_CLIENT_SETUP.md) - Admin API integration guide
- [Admin Frontend Integration Plan](docs/ADMIN_FRONTEND_INTEGRATION_PLAN.md) - Admin frontend-backend integration
- [Project Status](docs/PROJECT_STATUS.md)

## 🔐 Environment Variables

Copy `.env.example` to `.env` and customize the following variables:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/beatlenuts-gr
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
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

## 📘 Additional Documentation

- [Project Status](docs/PROJECT_STATUS.md) - Current project status and pending tasks
- [ESM Marketplace](docs/ESM_MARKETPLACE.md) - Detailed documentation of the ESM marketplace
- [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md) - Frontend architectural details
- [Bike Animation Restoration](docs/BIKE_ANIMATION_RESTORATION.md) - Details of the motorcycle animation implementation

## 📄 License

This project is licensed under the ISC License.