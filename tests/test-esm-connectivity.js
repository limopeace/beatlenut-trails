/**
 * Test ESM Portal API connectivity
 */
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';
const FRONTEND_URL = 'http://localhost:3002';

async function testConnection() {
  console.log('Testing ESM Portal API connectivity...\n');
  
  const tests = [
    {
      name: 'Backend server',
      url: API_BASE_URL,
      method: 'GET'
    },
    {
      name: 'Frontend server',
      url: FRONTEND_URL,
      method: 'GET'
    },
    {
      name: 'ESM Login endpoint',
      url: `${API_BASE_URL}/auth/esm-login`,
      method: 'POST',
      data: {
        email: 'test@example.com',
        password: 'wrongpassword'
      }
    },
    {
      name: 'ESM Products endpoint',
      url: `${API_BASE_URL}/esm-products`,
      method: 'GET'
    },
    {
      name: 'ESM Services endpoint',
      url: `${API_BASE_URL}/esm-services`,
      method: 'GET'
    }
  ];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name} at ${test.url}...`);
      const config = {
        method: test.method,
        url: test.url,
        timeout: 5000
      };
      
      if (test.data) {
        config.data = test.data;
      }
      
      const response = await axios(config);
      console.log(`✓ ${test.name} is accessible`);
      console.log(`  Status: ${response.status}`);
      console.log(`  Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
      
    } catch (error) {
      console.log(`✗ ${test.name} failed`);
      if (error.response) {
        console.log(`  Status: ${error.response.status}`);
        console.log(`  Error: ${error.response.data.message || error.message}`);
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`  Error: Server is not running at ${test.url}`);
      } else {
        console.log(`  Error: ${error.message}`);
      }
    }
    console.log();
  }
}

// Run the test
testConnection()
  .then(() => {
    console.log('Connectivity test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Connectivity test failed:', error);
    process.exit(1);
  });