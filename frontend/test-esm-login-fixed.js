const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testEsmLoginFixed() {
  let browser;
  const testId = Date.now();
  const screenshotDir = `test-results/esm-login-fixed-${testId}`;
  
  // Create screenshot directory
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results', { recursive: true });
  }
  fs.mkdirSync(screenshotDir, { recursive: true });

  try {
    console.log('🚀 Starting ESM login fixed test...');
    
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
      if (url.includes('/api/esm/sellers')) {
        console.log(`📡 ESM API Response: ${response.status()} - ${url}`);
      }
    });
    
    console.log('📱 Testing ESM Portal Login with fixed endpoints...');
    
    // Step 1: Create a test seller first via the correct API
    console.log('👤 Creating test seller account via correct API...');
    
    const testSellerData = {
      fullName: 'Test Seller Fixed',
      email: `testseller.fixed.${testId}@example.com`,
      password: 'TestPassword123!',
      phone: '+919876543210',
      location: 'Test City, India',
      serviceBranch: 'army',
      rank: 'Captain',
      serviceNumber: `TSF${testId}`,
      serviceYears: { from: 2000, to: 2010 },
      businessName: 'Test Business Fixed',
      sellerType: { products: true, services: false },
      category: 'handicrafts',
      description: 'Test seller for debugging purposes with fixed API',
      verificationDocument: 'test-document.pdf'
    };
    
    const registrationResult = await page.evaluate(async (sellerData) => {
      try {
        const res = await fetch('http://localhost:4000/api/esm/sellers/register', {
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
    
    if (registrationResult.status !== 201) {
      console.log('❌ Registration failed, cannot test login');
      return;
    }
    
    // Step 2: Test direct API login call
    console.log('🔧 Testing direct API login call with correct endpoint...');
    
    const directApiResult = await page.evaluate(async (email, password) => {
      try {
        const res = await fetch('http://localhost:4000/api/esm/sellers/login', {
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
    
    if (directApiResult.status !== 200) {
      console.log('❌ Direct API login failed');
      return;
    }
    
    // Step 3: Now test the frontend login
    console.log('🌐 Testing frontend login...');
    
    await page.goto('http://localhost:3000/esm-portal/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `${screenshotDir}/01-esm-login-page.png`, fullPage: true });
    console.log('✅ Navigated to ESM login page');
    
    // Fill login form
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', testSellerData.email);
    await page.type('input[type="password"]', testSellerData.password);
    
    await page.screenshot({ path: `${screenshotDir}/02-login-form-filled.png`, fullPage: true });
    console.log('✅ Filled login form');
    
    // Submit login
    await page.click('button[type="submit"]');
    console.log('🔄 Submitted login form');
    
    // Wait for navigation or response
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: `${screenshotDir}/03-after-login-attempt.png`, fullPage: true });
    
    // Check current URL to see if login was successful
    const currentUrl = page.url();
    console.log('📍 Current URL after login attempt:', currentUrl);
    
    // Step 4: If login was successful, take screenshot of seller dashboard
    if (!currentUrl.includes('/login')) {
      console.log('🎉 Login appears successful! Taking screenshot of seller landing page...');
      await page.screenshot({ path: `${screenshotDir}/04-seller-dashboard.png`, fullPage: true });
      
      // Try to navigate to different ESM portal pages to show functionality
      try {
        await page.goto('http://localhost:3000/esm-portal/add-product', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: `${screenshotDir}/05-add-product-page.png`, fullPage: true });
        console.log('✅ Navigated to add product page');
        
        await page.goto('http://localhost:3000/esm-portal/add-service', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: `${screenshotDir}/06-add-service-page.png`, fullPage: true });
        console.log('✅ Navigated to add service page');
        
        await page.goto('http://localhost:3000/esm-portal/products', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: `${screenshotDir}/07-products-page.png`, fullPage: true });
        console.log('✅ Navigated to products page');
        
      } catch (navError) {
        console.log('⚠️ Could not navigate to all pages:', navError.message);
      }
    } else {
      console.log('❌ Login failed - still on login page');
      
      // Check for any error messages on the page
      try {
        const errorMessages = await page.$$eval('[class*="error"], [class*="alert"], .text-red-600', elements => 
          elements.map(el => el.textContent?.trim()).filter(text => text && text.length > 0)
        );
        console.log('⚠️ Error messages found:', errorMessages);
      } catch (e) {
        console.log('ℹ️ No error messages found on page');
      }
    }
    
    // Step 5: Generate test report
    const reportData = {
      testId,
      timestamp: new Date().toISOString(),
      registrationResult,
      directApiResult,
      finalUrl: currentUrl,
      loginSuccessful: !currentUrl.includes('/login'),
      testSeller: {
        email: testSellerData.email,
        fullName: testSellerData.fullName,
        businessName: testSellerData.businessName
      }
    };
    
    fs.writeFileSync(
      `${screenshotDir}/test-report.json`,
      JSON.stringify(reportData, null, 2)
    );
    
    console.log(`📊 Test completed! Results saved in: ${screenshotDir}/`);
    console.log('🎯 Key findings:');
    console.log(`   - Registration Status: ${registrationResult.status || 'Error'}`);
    console.log(`   - Direct API Login Status: ${directApiResult.status || 'Error'}`);
    console.log(`   - Frontend Login Successful: ${!currentUrl.includes('/login')}`);
    console.log(`   - Test Seller Email: ${testSellerData.email}`);
    
    if (!currentUrl.includes('/login')) {
      console.log('✅ SUCCESS: ESM portal login is working correctly!');
    } else {
      console.log('❌ FAILURE: ESM portal login is not working');
    }
    
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
testEsmLoginFixed().catch(console.error);