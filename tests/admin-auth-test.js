/**
 * Test script for Admin Authentication
 * This script tests the admin authentication flow
 */

const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Test credentials
const testAdmin = {
  email: 'admin@beatlenut.com',
  password: 'admin123'
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Test functions
async function testAdminLogin() {
  logInfo('Testing Admin Login...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
      email: testAdmin.email,
      password: testAdmin.password
    });
    
    if (response.data.token && response.data.user) {
      logSuccess('Admin login successful!');
      log(`User: ${JSON.stringify(response.data.user, null, 2)}`, colors.cyan);
      return response.data.token;
    } else {
      logError('Login response missing token or user data');
      return null;
    }
  } catch (error) {
    logError(`Admin login failed: ${error.response?.data?.message || error.message}`);
    if (error.response) {
      log(`Error status: ${error.response.status}`, colors.red);
      log(`Error details: ${JSON.stringify(error.response.data, null, 2)}`, colors.red);
    } else {
      log(`Error: ${error.message}`, colors.red);
      log(`Error stack: ${error.stack}`, colors.red);
    }
    return null;
  }
}

async function testTokenVerification(token) {
  logInfo('Testing Token Verification...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/admin/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.data.user) {
      logSuccess('Token verification successful!');
      log(`User data: ${JSON.stringify(response.data.user, null, 2)}`, colors.cyan);
      return true;
    } else {
      logError('Token verification response missing user data');
      return false;
    }
  } catch (error) {
    logError(`Token verification failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testProtectedRoute(token) {
  logInfo('Testing Protected Route Access...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/esm/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logSuccess('Protected route access successful!');
    log(`Dashboard data: ${JSON.stringify(response.data, null, 2)}`, colors.cyan);
    return true;
  } catch (error) {
    logError(`Protected route access failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testInvalidToken() {
  logInfo('Testing Invalid Token...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/admin/verify`, {
      headers: {
        'Authorization': 'Bearer invalid-token-12345'
      }
    });
    
    logError('Invalid token should have been rejected!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      logSuccess('Invalid token properly rejected!');
      return true;
    }
    logError(`Unexpected error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log('\n=== Admin Authentication Test Suite ===\n', colors.bright);
  
  try {
    // Test 1: Admin Login
    const token = await testAdminLogin();
    if (!token) {
      logError('Failed to obtain admin token. Stopping tests.');
      return;
    }
    
    log('\n---\n');
    
    // Test 2: Token Verification
    const isValid = await testTokenVerification(token);
    if (!isValid) {
      logError('Token verification failed. Stopping tests.');
      return;
    }
    
    log('\n---\n');
    
    // Test 3: Protected Route Access
    await testProtectedRoute(token);
    
    log('\n---\n');
    
    // Test 4: Invalid Token
    await testInvalidToken();
    
    log('\n---\n');
    
    logSuccess('\nAll tests completed!');
    
  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
  }
}

// Run the tests
runTests();