const puppeteer = require('puppeteer');
const axios = require('axios');

// Test Configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:4000/api';

const testUser = {
  seller: {
    email: 'testseller@example.com',
    password: 'TestPassword123!',
    businessName: 'Test Business',
    phone: '+1234567890'
  },
  buyer: {
    email: 'testbuyer@example.com',
    password: 'BuyerPassword123!',
    name: 'Test Buyer'
  }
};

// Test Suite
async function runFunctionalTests() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Starting ESM Portal Functional Tests...');
    
    // Test 1: Seller Registration
    console.log('\n📝 Test 1: Seller Registration');
    await page.goto(`${BASE_URL}/esm-portal/register`);
    await page.waitForSelector('[name="businessName"]');
    
    await page.type('[name="businessName"]', testUser.seller.businessName);
    await page.type('[name="email"]', testUser.seller.email);
    await page.type('[name="password"]', testUser.seller.password);
    await page.type('[name="phone"]', testUser.seller.phone);
    await page.type('[name="businessDescription"]', 'Test business description');
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    const registrationSuccess = await page.url().includes('/esm-portal/register/success');
    console.log(`✅ Seller Registration: ${registrationSuccess ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: Seller Login
    console.log('\n🔐 Test 2: Seller Login');
    await page.goto(`${BASE_URL}/esm-portal/login`);
    await page.type('[name="email"]', testUser.seller.email);
    await page.type('[name="password"]', testUser.seller.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    const loginSuccess = await page.url().includes('/esm-portal/dashboard');
    console.log(`✅ Seller Login: ${loginSuccess ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Add Product
    console.log('\n📦 Test 3: Add Product');
    await page.goto(`${BASE_URL}/esm-portal/add-product`);
    await page.waitForSelector('[name="name"]');
    
    await page.type('[name="name"]', 'Test Product');
    await page.type('[name="description"]', 'Test product description');
    await page.type('[name="price"]', '99.99');
    await page.type('[name="quantity"]', '10');
    
    // Upload test image
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.uploadFile('path/to/test-image.jpg');
    }
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    const productAdded = await page.url().includes('/esm-portal/products');
    console.log(`✅ Add Product: ${productAdded ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Message System
    console.log('\n💬 Test 4: Message System');
    await page.goto(`${BASE_URL}/esm-portal/messages`);
    await page.waitForSelector('.message-list');
    
    // Check if messages page loads
    const messagesLoaded = await page.$('.message-list') !== null;
    console.log(`✅ Messages Page: ${messagesLoaded ? 'PASSED' : 'FAILED'}`);
    
    // Test 5: Search Functionality
    console.log('\n🔍 Test 5: Search Functionality');
    await page.goto(`${BASE_URL}/esm-portal/products`);
    await page.waitForSelector('input[type="search"]');
    
    await page.type('input[type="search"]', 'Test Product');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    const searchResults = await page.$$('.product-card');
    console.log(`✅ Search Results: ${searchResults.length > 0 ? 'PASSED' : 'FAILED'}`);
    
    // Test 6: Error Handling
    console.log('\n⚠️  Test 6: Error Handling');
    await page.goto(`${BASE_URL}/esm-portal/non-existent-page`);
    
    const errorPage = await page.$('.error-page') !== null;
    console.log(`✅ 404 Error Page: ${errorPage ? 'PASSED' : 'FAILED'}`);
    
  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    await browser.close();
    console.log('\n🏁 Functional Tests Completed');
  }
}

// Run tests
if (require.main === module) {
  runFunctionalTests();
}

module.exports = { runFunctionalTests };