const puppeteer = require('puppeteer');
const axios = require('axios');

const testAdminToken = async () => {
  console.log('🔧 Testing Admin Token Consistency');
  console.log('=====================================');
  
  const config = {
    baseUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:4000',
    adminCredentials: {
      email: 'admin@beatlenut.com',
      password: 'admin123'
    }
  };
  
  let browser, page;
  
  try {
    // Initialize browser
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1366, height: 768 }
    });
    page = await browser.newPage();
    
    // Enable request interception to see headers
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('/api/admin/')) {
        console.log(`🌐 Request: ${request.method()} ${request.url()}`);
        const headers = request.headers();
        if (headers.authorization) {
          console.log(`🔐 Authorization: ${headers.authorization.substring(0, 30)}...`);
        } else {
          console.log('❌ No Authorization header found');
        }
      }
      request.continue();
    });
    
    // Step 1: Admin login via API to get token
    console.log('🔑 Step 1: Admin login via API...');
    const loginResponse = await axios.post(`${config.backendUrl}/api/auth/admin/login`, config.adminCredentials);
    const adminToken = loginResponse.data.data.token;
    console.log(`✅ API Login successful, token: ${adminToken.substring(0, 20)}...`);
    
    // Step 2: Login via UI and set token
    console.log('🌐 Step 2: Admin login via UI...');
    await page.goto(`${config.baseUrl}/admin/login`, { waitUntil: 'networkidle0' });
    
    // Fill and submit login form
    await page.type('input[name="email"]', config.adminCredentials.email);
    await page.type('input[name="password"]', config.adminCredentials.password);
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check what tokens are stored
    const cookieToken = await page.evaluate(() => {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'admin_token') return value;
      }
      return null;
    });
    
    const localStorageToken = await page.evaluate(() => {
      return localStorage.getItem('admin_token');
    });
    
    console.log(`🍪 Cookie token: ${cookieToken ? cookieToken.substring(0, 20) + '...' : 'Not found'}`);
    console.log(`💾 LocalStorage token: ${localStorageToken ? localStorageToken.substring(0, 20) + '...' : 'Not found'}`);
    
    // Step 3: Test admin API calls
    console.log('📊 Step 3: Testing admin API calls...');
    
    // Direct API call with token
    try {
      const directApiResponse = await axios.get(`${config.backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Direct API call with token: SUCCESS');
    } catch (error) {
      console.log(`❌ Direct API call failed: ${error.response?.status} ${error.response?.statusText}`);
    }
    
    // UI-triggered API call
    console.log('🖱️ Triggering UI admin API calls...');
    await page.goto(`${config.baseUrl}/admin/dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.goto(`${config.baseUrl}/admin/sellers`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Token testing completed');
    
  } catch (error) {
    console.error('💥 Token test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Run the test
testAdminToken().catch(console.error);