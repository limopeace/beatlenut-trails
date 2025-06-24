const axios = require('axios');

// API connectivity test
const config = {
  frontendUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:4000',
  adminCredentials: {
    email: 'admin@beatlenut.com',
    password: 'admin123'
  }
};

async function testAPIConnectivity() {
  console.log('🔍 Testing API Connectivity...\n');
  
  // Test 1: Backend Health Check
  try {
    console.log('1. Testing Backend Health...');
    const healthResponse = await axios.get(`${config.backendUrl}/health`);
    console.log('✅ Backend Health:', healthResponse.data);
  } catch (error) {
    console.log('❌ Backend Health Error:', error.message);
  }

  // Test 2: Admin Login API
  try {
    console.log('\n2. Testing Admin Login API...');
    const loginResponse = await axios.post(`${config.backendUrl}/api/auth/login`, config.adminCredentials);
    console.log('✅ Admin Login API:', loginResponse.data);
  } catch (error) {
    console.log('❌ Admin Login API Error:', error.response?.data || error.message);
  }

  // Test 3: ESM Registration API
  try {
    console.log('\n3. Testing ESM Registration Endpoint...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpass123',
      phoneNumber: '9876543210',
      role: 'seller',
      termsAccepted: true
    };
    
    const response = await axios.post(`${config.backendUrl}/api/esm/sellers/register`, testUser);
    console.log('✅ ESM Registration API Response:', response.data);
  } catch (error) {
    console.log('❌ ESM Registration API Error:', error.response?.data || error.message);
  }

  // Test 4: Frontend Accessibility
  try {
    console.log('\n4. Testing Frontend Accessibility...');
    const frontendResponse = await axios.get(config.frontendUrl);
    console.log('✅ Frontend accessible, status:', frontendResponse.status);
  } catch (error) {
    console.log('❌ Frontend Error:', error.message);
  }

  console.log('\n🏁 API Connectivity Test Complete');
}

if (require.main === module) {
  testAPIConnectivity().catch(console.error);
}

module.exports = { testAPIConnectivity, config };