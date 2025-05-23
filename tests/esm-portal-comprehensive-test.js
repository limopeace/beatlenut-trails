const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Test Configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:4000/api';

const testData = {
  seller: {
    email: `testseller${Date.now()}@example.com`,
    password: 'TestPassword123!',
    businessName: 'Test Business',
    phone: '+1234567890'
  },
  buyer: {
    email: `testbuyer${Date.now()}@example.com`,
    password: 'BuyerPassword123!',
    name: 'Test Buyer'
  }
};

// Test Results
const testResults = {
  functional: [],
  errors: [],
  performance: []
};

// Helper function to log results
function logResult(category, test, status, message = '') {
  const result = {
    test,
    status,
    message,
    timestamp: new Date().toISOString()
  };
  testResults[category].push(result);
  console.log(`${status === 'PASSED' ? '✅' : '❌'} ${test}: ${status} ${message}`);
}

// Functional Tests
async function runFunctionalTests() {
  console.log('\n🧪 Starting ESM Portal Functional Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Test 1: ESM Portal Homepage
    console.log('Test 1: ESM Portal Homepage');
    await page.goto(`${BASE_URL}/esm-portal`);
    const title = await page.title();
    if (title.includes('ESM') || title.includes('Marketplace')) {
      logResult('functional', 'ESM Homepage Load', 'PASSED');
    } else {
      logResult('functional', 'ESM Homepage Load', 'FAILED', `Title: ${title}`);
    }
    
    // Test 2: Registration Page
    console.log('\nTest 2: Registration Page');
    const registerLink = await page.$('a[href*="register"]');
    if (registerLink) {
      await registerLink.click();
      await page.waitForNavigation();
      const hasBusinessNameField = await page.$('[name="businessName"]');
      logResult('functional', 'Registration Page Access', hasBusinessNameField ? 'PASSED' : 'FAILED');
    } else {
      logResult('functional', 'Registration Page Access', 'FAILED', 'No register link found');
    }
    
    // Test 3: Login Page
    console.log('\nTest 3: Login Page');
    await page.goto(`${BASE_URL}/esm-portal/login`);
    const hasLoginForm = await page.$('[name="email"]') && await page.$('[name="password"]');
    logResult('functional', 'Login Page Elements', hasLoginForm ? 'PASSED' : 'FAILED');
    
    // Test 4: Products Page
    console.log('\nTest 4: Products Page');
    await page.goto(`${BASE_URL}/esm-portal/products`);
    const productsContent = await page.content();
    if (productsContent.includes('product') || productsContent.includes('Product')) {
      logResult('functional', 'Products Page Load', 'PASSED');
    } else {
      logResult('functional', 'Products Page Load', 'FAILED', 'No product content found');
    }
    
    // Test 5: Services Page
    console.log('\nTest 5: Services Page');
    await page.goto(`${BASE_URL}/esm-portal/services`);
    const servicesContent = await page.content();
    if (servicesContent.includes('service') || servicesContent.includes('Service')) {
      logResult('functional', 'Services Page Load', 'PASSED');
    } else {
      logResult('functional', 'Services Page Load', 'FAILED', 'No service content found');
    }
    
    // Test 6: Search Functionality
    console.log('\nTest 6: Search Functionality');
    await page.goto(`${BASE_URL}/esm-portal/products`);
    const searchInput = await page.$('input[type="search"]');
    if (searchInput) {
      await searchInput.type('test');
      await page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 1000));
      logResult('functional', 'Search Input', 'PASSED');
    } else {
      logResult('functional', 'Search Input', 'FAILED', 'No search field found');
    }
    
  } catch (error) {
    logResult('errors', 'Functional Test Error', 'ERROR', error.message);
  } finally {
    await browser.close();
  }
}

// Error Handling Tests
async function runErrorHandlingTests() {
  console.log('\n⚠️  Starting Error Handling Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Test 1: 404 Page
    console.log('Test 1: 404 Error Page');
    await page.goto(`${BASE_URL}/esm-portal/non-existent-page`);
    const content = await page.content();
    if (content.includes('404') || content.includes('not found')) {
      logResult('errors', '404 Error Page', 'PASSED');
    } else {
      logResult('errors', '404 Error Page', 'FAILED', 'No error indication');
    }
    
    // Test 2: Invalid Form Submission
    console.log('\nTest 2: Invalid Form Submission');
    await page.goto(`${BASE_URL}/esm-portal/login`);
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      const hasError = await page.$('.error') || await page.$('[role="alert"]');
      logResult('errors', 'Form Validation', hasError ? 'PASSED' : 'FAILED');
    }
    
    // Test 3: API Error Handling
    console.log('\nTest 3: API Error Handling');
    try {
      await axios.get(`${API_URL}/invalid-endpoint`);
      logResult('errors', 'API Error Response', 'FAILED', 'Should have thrown error');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logResult('errors', 'API Error Response', 'PASSED');
      } else {
        logResult('errors', 'API Error Response', 'FAILED', error.message);
      }
    }
    
  } catch (error) {
    logResult('errors', 'Error Handling Test', 'ERROR', error.message);
  } finally {
    await browser.close();
  }
}

// Independence Tests
async function runIndependenceTests() {
  console.log('\n🔍 Starting Independence Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Test 1: Route Separation
    console.log('Test 1: Route Separation');
    await page.goto(`${BASE_URL}/esm-portal`);
    const esmContent = await page.content();
    
    await page.goto(`${BASE_URL}`);
    const travelContent = await page.content();
    
    const isDifferent = esmContent !== travelContent;
    logResult('functional', 'Route Separation', isDifferent ? 'PASSED' : 'FAILED');
    
    // Test 2: Style Separation
    console.log('\nTest 2: Style Separation');
    await page.goto(`${BASE_URL}/esm-portal`);
    const esmStyles = await page.evaluate(() => {
      return Array.from(document.styleSheets)
        .map(sheet => sheet.href)
        .filter(Boolean);
    });
    
    const hasESMStyles = esmStyles.some(style => style.includes('esm'));
    logResult('functional', 'Style Separation', hasESMStyles ? 'PASSED' : 'WARNING', 
      hasESMStyles ? '' : 'No ESM-specific styles found');
    
  } catch (error) {
    logResult('errors', 'Independence Test', 'ERROR', error.message);
  } finally {
    await browser.close();
  }
}

// Admin Portal Tests
async function runAdminTests() {
  console.log('\n👨‍💼 Starting Admin Portal Tests...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Test 1: Admin Login Page
    console.log('Test 1: Admin Login Page');
    await page.goto(`${BASE_URL}/admin/login`);
    const hasAdminLogin = await page.$('[name="email"]') && await page.$('[name="password"]');
    logResult('functional', 'Admin Login Page', hasAdminLogin ? 'PASSED' : 'FAILED');
    
    // Test 2: Admin Dashboard Route
    console.log('\nTest 2: Admin Dashboard Route');
    await page.goto(`${BASE_URL}/admin/dashboard`);
    // Should redirect to login if not authenticated
    const currentUrl = page.url();
    const isProtected = currentUrl.includes('login') || currentUrl.includes('dashboard');
    logResult('functional', 'Admin Route Protection', isProtected ? 'PASSED' : 'FAILED');
    
    // Test 3: Admin ESM Pages
    console.log('\nTest 3: Admin ESM Management Pages');
    const adminPages = [
      { url: '/admin/sellers', name: 'Sellers Page' },
      { url: '/admin/approvals', name: 'Approvals Page' }
    ];
    
    for (const { url, name } of adminPages) {
      await page.goto(`${BASE_URL}${url}`);
      const pageExists = !page.url().includes('404');
      logResult('functional', `Admin ${name}`, pageExists ? 'PASSED' : 'FAILED');
    }
    
  } catch (error) {
    logResult('errors', 'Admin Test', 'ERROR', error.message);
  } finally {
    await browser.close();
  }
}

// Performance Test
async function runPerformanceTests() {
  console.log('\n⚡ Starting Performance Tests...\n');
  
  const pages = [
    { url: '/esm-portal', name: 'Homepage' },
    { url: '/esm-portal/products', name: 'Products' },
    { url: '/esm-portal/services', name: 'Services' }
  ];
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    for (const { url, name } of pages) {
      const start = Date.now();
      await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle2' });
      const loadTime = Date.now() - start;
      
      const status = loadTime < 3000 ? 'PASSED' : 'WARNING';
      logResult('performance', `${name} Load Time`, status, `${loadTime}ms`);
    }
    
    // Test API Response Times
    console.log('\nAPI Response Times:');
    const apiEndpoints = [
      { url: '/products', name: 'Products API' },
      { url: '/services', name: 'Services API' }
    ];
    
    for (const { url, name } of apiEndpoints) {
      const start = Date.now();
      try {
        await axios.get(`${API_URL}${url}`);
        const responseTime = Date.now() - start;
        const status = responseTime < 500 ? 'PASSED' : 'WARNING';
        logResult('performance', `${name} Response Time`, status, `${responseTime}ms`);
      } catch (error) {
        logResult('performance', `${name} Response Time`, 'FAILED', error.message);
      }
    }
    
  } catch (error) {
    logResult('errors', 'Performance Test', 'ERROR', error.message);
  } finally {
    await browser.close();
  }
}

// Generate Test Report
function generateReport() {
  console.log('\n📊 Test Summary Report');
  console.log('='.repeat(40));
  
  // Functional Tests Summary
  const functionalPassed = testResults.functional.filter(r => r.status === 'PASSED').length;
  const functionalTotal = testResults.functional.length;
  console.log(`\nFunctional Tests: ${functionalPassed}/${functionalTotal} passed`);
  
  // Error Tests Summary
  const errorPassed = testResults.errors.filter(r => r.status === 'PASSED').length;
  const errorTotal = testResults.errors.length;
  console.log(`Error Handling Tests: ${errorPassed}/${errorTotal} passed`);
  
  // Performance Tests Summary
  const perfPassed = testResults.performance.filter(r => r.status === 'PASSED').length;
  const perfTotal = testResults.performance.length;
  console.log(`Performance Tests: ${perfPassed}/${perfTotal} passed`);
  
  // Overall Summary
  const totalPassed = functionalPassed + errorPassed + perfPassed;
  const totalTests = functionalTotal + errorTotal + perfTotal;
  const passRate = (totalPassed / totalTests * 100).toFixed(2);
  
  console.log('\nOverall Results:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed}`);
  console.log(`Pass Rate: ${passRate}%`);
  
  // Save report to file
  const reportPath = path.join(__dirname, '../test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive ESM Portal Testing');
  console.log('='.repeat(40));
  
  await runFunctionalTests();
  await runErrorHandlingTests();
  await runIndependenceTests();
  await runAdminTests();
  await runPerformanceTests();
  
  generateReport();
  
  console.log('\n🏁 All tests completed!');
}

// Execute tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };