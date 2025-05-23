# Testing Guide

**Last Updated: 20 May 2025**

## Overview

This guide covers all testing procedures for the Beatlenuts-GR platform, including unit tests, integration tests, API testing, and end-to-end testing.

## Test Structure

```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
├── api/              # API tests
├── esm-portal/       # ESM portal specific tests
└── utils/            # Test utilities
```

## Running Tests

### Backend Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## ESM Portal Testing

### Test Files

1. **Comprehensive Test Suite**
   ```bash
   node tests/esm-portal-comprehensive-test.js
   ```
   Tests all ESM functionality including:
   - Authentication flow
   - Product/service management
   - Search and filtering
   - Error handling
   - Performance

2. **Quick Test**
   ```bash
   node tests/esm-portal-quick-test.js
   ```
   Basic smoke tests for:
   - Server connectivity
   - Login functionality
   - Product listing

3. **Admin Integration Test**
   ```bash
   node tests/esm-portal-admin-test.js
   ```
   Tests admin functionality:
   - Seller approval workflow
   - Product moderation
   - Analytics access

4. **API Connectivity Test**
   ```bash
   node tests/test-esm-connectivity.js
   ```
   Verifies API endpoints:
   - Authentication endpoints
   - CRUD operations
   - Error responses

## Test Coverage

### Backend Coverage Goals

- Controllers: 90%
- Services: 95%
- Models: 85%
- Middleware: 90%
- Utils: 100%

### Frontend Coverage Goals

- Components: 85%
- Hooks: 95%
- Services: 90%
- Utils: 100%

## Unit Testing

### Example Test Structure

```javascript
// tests/unit/services/esmProductService.test.js
describe('ESM Product Service', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      // Test implementation
    });

    it('should validate required fields', async () => {
      // Test implementation
    });
  });
});
```

## Integration Testing

### Database Integration

```javascript
// tests/integration/database.test.js
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URL);
});

afterAll(async () => {
  await mongoose.disconnect();
});
```

### API Integration

```javascript
// tests/integration/api/esm-products.test.js
const request = require('supertest');
const app = require('../../../src/index');

describe('ESM Products API', () => {
  it('GET /api/esm-products', async () => {
    const response = await request(app)
      .get('/api/esm-products')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.products)).toBe(true);
  });
});
```

## E2E Testing

### Puppeteer Setup

```javascript
// tests/e2e/esm-portal.e2e.js
const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: process.env.CI ? 'new' : false
  });
  page = await browser.newPage();
});

afterAll(async () => {
  await browser.close();
});

describe('ESM Portal E2E', () => {
  it('should complete seller registration', async () => {
    await page.goto('http://localhost:3002/esm-portal/register');
    // Test implementation
  });
});
```

## Performance Testing

### Load Testing

```javascript
// tests/performance/load-test.js
const loadtest = require('loadtest');

const options = {
  url: 'http://localhost:4000/api/esm-products',
  maxRequests: 1000,
  concurrency: 10
};

loadtest.loadTest(options, (error, result) => {
  if (error) {
    console.error('Load test failed:', error);
  } else {
    console.log('Load test results:', result);
  }
});
```

## Security Testing

### Authentication Tests

```javascript
// tests/security/auth.test.js
describe('Authentication Security', () => {
  it('should reject invalid tokens', async () => {
    const response = await request(app)
      .get('/api/esm-products')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);
  });

  it('should enforce role-based access', async () => {
    const buyerToken = await getBuyerToken();
    const response = await request(app)
      .post('/api/esm-products')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send(productData)
      .expect(403);
  });
});
```

## Mocking and Stubbing

### Service Mocks

```javascript
// tests/mocks/emailService.mock.js
module.exports = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendBulkEmail: jest.fn().mockResolvedValue({ sent: 10, failed: 0 })
};
```

### Database Mocks

```javascript
// tests/mocks/repositories.mock.js
const mockProductRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};
```

## Test Data Management

### Fixtures

```javascript
// tests/fixtures/products.js
module.exports = {
  validProduct: {
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    category: 'electronics'
  },
  invalidProduct: {
    name: '', // Invalid - empty name
    price: -50 // Invalid - negative price
  }
};
```

### Seed Data

```javascript
// tests/utils/seedData.js
async function seedDatabase() {
  await User.create(testUsers);
  await Product.create(testProducts);
  await Service.create(testServices);
}
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Debugging Tests

### Debug Mode

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output

```bash
# Run with verbose output
npm test -- --verbose
```

## Test Reports

### Coverage Reports

```bash
# Generate HTML coverage report
npm run test:coverage -- --coverageReporters=html
```

### Test Results

Test results are saved in:
- `coverage/` - Coverage reports
- `test-results/` - JUnit XML reports
- `screenshots/` - E2E test screenshots

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Names**: Use descriptive test names
3. **AAA Pattern**: Arrange, Act, Assert
4. **Mock External Services**: Don't make real API calls
5. **Clean Up**: Always clean up test data
6. **Fast Tests**: Keep tests fast and focused
7. **Error Cases**: Test both success and failure paths

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Ensure test database is running
   docker-compose up -d test-db
   ```

2. **Port Conflicts**
   ```bash
   # Kill process on port
   lsof -ti:4000 | xargs kill -9
   ```

3. **Timeout Errors**
   ```javascript
   // Increase timeout for slow tests
   jest.setTimeout(30000);
   ```

## Continuous Monitoring

### Test Metrics

Monitor:
- Test execution time
- Flaky test frequency
- Coverage trends
- Failed test patterns

### Alerts

Set up alerts for:
- Coverage drops below threshold
- Test suite failures
- Performance regressions

## Future Enhancements

1. **Visual Regression Testing**
2. **Accessibility Testing**
3. **Contract Testing**
4. **Mutation Testing**
5. **Security Scanning**