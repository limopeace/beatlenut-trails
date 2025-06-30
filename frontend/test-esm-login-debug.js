const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testEsmLogin() {
  let browser;
  const testId = Date.now();
  const screenshotDir = `test-results/esm-login-debug-${testId}`;
  
  // Create screenshot directory
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results', { recursive: true });
  }
  fs.mkdirSync(screenshotDir, { recursive: true });

  try {
    console.log('🚀 Starting ESM login debug test...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Error:', msg.text());
      } else if (msg.text().includes('AxiosError') || msg.text().includes('401')) {
        console.log('🔍 Network Error:', msg.text());
      }
    });
    
    // Enable network request logging
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/auth/esm-login')) {
        console.log(`📡 Login API Response: ${response.status()} - ${url}`);
      }
    });
    
    console.log('📱 Testing ESM Portal Login...');
    
    // Step 1: Go to ESM login page
    await page.goto('http://localhost:3000/esm-portal/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `${screenshotDir}/01-esm-login-page.png`, fullPage: true });
    console.log('✅ Navigated to ESM login page');
    
    // Step 2: First check if we have any registered sellers
    console.log('🔍 Checking for existing sellers via API...');
    
    try {
      // Try to fetch seller data to see what exists
      const response = await page.evaluate(async () => {
        try {
          const res = await fetch('http://localhost:4000/api/esm-sellers', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await res.json();
          return { status: res.status, data };
        } catch (error) {
          return { error: error.message };
        }
      });
      
      console.log('📊 Sellers API Response:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('⚠️  Could not fetch sellers:', error.message);
    }
    
    // Step 3: Try to create a test seller first
    console.log('👤 Creating test seller account...');
    
    const testSellerData = {
      fullName: 'Test Seller Debug',
      email: `testseller.debug.${testId}@example.com`,
      password: 'TestPassword123!',
      phone: '+91-9876543210',
      location: 'Test City, India',
      serviceBranch: 'army',
      rank: 'Captain',
      serviceNumber: `TS${testId}`,
      serviceYears: { from: 2000, to: 2010 },
      businessName: 'Test Business Debug',
      sellerType: { products: true, services: false },
      category: 'handicrafts',
      description: 'Test seller for debugging purposes',
      verificationDocument: 'test-document.pdf'
    };
    
    const registrationResult = await page.evaluate(async (sellerData) => {
      try {
        const res = await fetch('http://localhost:4000/api/esm-sellers/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sellerData)
        });
        const data = await res.json();
        return { status: res.status, data };
      } catch (error) {
        return { error: error.message };
      }
    }, testSellerData);
    
    console.log('📝 Registration Result:', JSON.stringify(registrationResult, null, 2));
    
    // Step 4: Now try to login with the test seller
    console.log('🔐 Attempting login with test credentials...');
    
    // Fill login form
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', testSellerData.email);
    await page.type('input[type="password"]', testSellerData.password);
    
    await page.screenshot({ path: `${screenshotDir}/02-login-form-filled.png`, fullPage: true });
    console.log('✅ Filled login form');
    
    // Try to submit login
    await page.click('button[type="submit"]');
    console.log('🔄 Submitted login form');
    
    // Wait a bit and capture any response
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${screenshotDir}/03-after-login-attempt.png`, fullPage: true });
    
    // Check current URL to see if login was successful
    const currentUrl = page.url();
    console.log('📍 Current URL after login attempt:', currentUrl);
    
    // Step 5: Let's also test the direct API call
    console.log('🔧 Testing direct API login call...');
    
    const directApiResult = await page.evaluate(async (email, password) => {
      try {
        const res = await fetch('http://localhost:4000/api/esm-sellers/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        return { status: res.status, data, headers: Object.fromEntries(res.headers.entries()) };
      } catch (error) {
        return { error: error.message };
      }
    }, testSellerData.email, testSellerData.password);
    
    console.log('🎯 Direct API Login Result:', JSON.stringify(directApiResult, null, 2));
    
    // Step 6: If login was successful, navigate to seller dashboard
    if (currentUrl.includes('/esm-portal') && !currentUrl.includes('/login')) {
      console.log('🎉 Login appears successful! Taking screenshot of landing page...');
      await page.screenshot({ path: `${screenshotDir}/04-seller-dashboard.png`, fullPage: true });
    } else {
      console.log('❌ Login failed - still on login page');
      
      // Check for any error messages on the page
      try {
        const errorMessages = await page.$$eval('[class*="error"], [class*="alert"]', elements => 
          elements.map(el => el.textContent)
        );
        console.log('⚠️  Error messages found:', errorMessages);
      } catch (e) {
        console.log('ℹ️  No error messages found on page');
      }
    }
    
    // Step 7: Generate test report
    const reportData = {
      testId,
      timestamp: new Date().toISOString(),
      registrationResult,
      directApiResult,
      finalUrl: currentUrl,
      loginSuccessful: !currentUrl.includes('/login')
    };
    
    fs.writeFileSync(
      `${screenshotDir}/test-report.json`,
      JSON.stringify(reportData, null, 2)
    );
    
    console.log(`📊 Test completed! Results saved in: ${screenshotDir}/`);
    console.log('🎯 Key findings:');
    console.log(`   - Registration Status: ${registrationResult.status || 'Error'}`);
    console.log(`   - Direct API Login Status: ${directApiResult.status || 'Error'}`);
    console.log(`   - Login Successful: ${!currentUrl.includes('/login')}`);
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testEsmLogin().catch(console.error);