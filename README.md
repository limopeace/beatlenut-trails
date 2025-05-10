# Beatlenuts-GR

A Node.js Express application with a modular architecture.

## Features

- Express API server with organized structure
- Model-View-Controller (MVC) architecture
- Testing with Jest
- Linting with ESLint and formatting with Prettier
- Example middleware, controllers, routes, and utilities

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd beatlenuts-gr

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the server
npm start

# Start with automatic reloading for development
npm run dev
```

The server will start at http://localhost:3000

## Project Structure

```
beatlenuts-gr/
├── config/             # Configuration files
├── src/                # Source code
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.js        # Application entry point
├── tests/              # Test files
├── .eslintrc.js        # ESLint configuration
├── .gitignore          # Git ignore file
├── CLAUDE.md           # Claude Code guidance
├── jest.config.js      # Jest configuration
├── package.json        # npm package configuration
└── README.md           # Project documentation
```

## API Endpoints

- `GET /` - Welcome message
- `GET /examples` - Get all examples
- `GET /examples/:id` - Get example by ID
- `POST /examples` - Create a new example

## Development

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npx jest --watch

# Run tests with coverage
npx jest --coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## License

This project is licensed under the ISC License.