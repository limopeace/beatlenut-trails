const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test the fixed admin login
async function testFixedAdminLogin() {
  console.log('🔐 Testing Fixed Admin Login Integration...');
  
  const screenshotDir = path.join(__dirname, 'test-results', 'admin-login-test-' + Date.now());
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Monitor console logs and network requests
  const logs = [];
  const networkRequests = [];
  
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`);
    console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('request', request => {
    networkRequests.push({
      method: request.method(),
      url: request.url(),
      headers: request.headers()
    });
    console.log(`[Network] ${request.method()} ${request.url()}`);
  });
  
  page.on('response', response => {
    console.log(`[Response] ${response.status()} ${response.url()}`);
  });

  try {
    // Navigate to admin login
    console.log('📍 Navigating to admin login page...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    
    await page.screenshot({ 
      path: path.join(screenshotDir, '01-admin-login-page-fixed.png'), 
      fullPage: true 
    });
    console.log('📸 Screenshot: Login page loaded');

    // Check if the form elements exist
    const emailInput = await page.$('#email');
    const passwordInput = await page.$('#password');
    const submitButton = await page.$('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('Login form elements not found');
    }
    
    console.log('✅ All form elements found');

    // Fill credentials (they should be pre-filled)
    const emailValue = await page.$eval('#email', el => el.value);
    const passwordValue = await page.$eval('#password', el => el.value);
    
    console.log(`📝 Email pre-filled: ${emailValue}`);
    console.log(`📝 Password pre-filled: ${passwordValue ? '***' : 'empty'}`);
    
    // If not pre-filled, fill them
    if (!emailValue) {
      await page.type('#email', 'admin@beatlenut.com');
    }
    if (!passwordValue) {
      await page.type('#password', 'admin123');
    }

    await page.screenshot({ 
      path: path.join(screenshotDir, '02-credentials-ready.png'), 
      fullPage: true 
    });
    console.log('📸 Screenshot: Credentials ready');

    // Submit the form
    console.log('🚀 Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Wait for network activity or navigation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await page.screenshot({ 
      path: path.join(screenshotDir, '03-after-login-submit.png'), 
      fullPage: true 
    });
    console.log('📸 Screenshot: After login submission');

    // Check current URL and cookies
    const currentUrl = page.url();
    const cookies = await page.cookies();
    const adminToken = cookies.find(c => c.name === 'admin_token');
    
    console.log(`📍 Current URL: ${currentUrl}`);
    console.log(`🍪 Admin token found: ${adminToken ? 'Yes' : 'No'}`);
    
    if (adminToken) {
      console.log(`🔑 Token value: ${adminToken.value.substring(0, 20)}...`);
    }

    // Check if we're on dashboard or got redirected
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Successfully redirected to dashboard!');
      
      await page.screenshot({ 
        path: path.join(screenshotDir, '04-admin-dashboard-success.png'), 
        fullPage: true 
      });
      console.log('📸 Screenshot: Admin dashboard');
      
      return { success: true, message: 'Admin login working correctly!' };
    } else if (currentUrl.includes('/admin/login')) {
      console.log('⚠️ Still on login page - checking for errors...');
      
      // Look for error messages
      const errorElement = await page.$('.text-red-700, .text-red-800, [class*="error"]');
      let errorMessage = 'Unknown error';
      
      if (errorElement) {
        errorMessage = await page.evaluate(el => el.textContent, errorElement);
        console.log(`❌ Error message: ${errorMessage}`);
      }
      
      return { success: false, message: errorMessage };
    } else {
      console.log(`🤔 Unexpected URL: ${currentUrl}`);
      return { success: false, message: `Redirected to unexpected URL: ${currentUrl}` };
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    await page.screenshot({ 
      path: path.join(screenshotDir, '99-error-state.png'), 
      fullPage: true 
    });
    
    return { success: false, message: error.message };
  } finally {
    // Save test results
    const report = {
      timestamp: new Date().toISOString(),
      logs: logs,
      networkRequests: networkRequests.slice(-10), // Last 10 requests
      screenshotDir: screenshotDir
    };
    
    fs.writeFileSync(
      path.join(screenshotDir, 'test-report.json'), 
      JSON.stringify(report, null, 2)
    );
    
    await browser.close();
    console.log(`📁 Test results saved to: ${screenshotDir}`);
  }
}

// Run the test
if (require.main === module) {
  testFixedAdminLogin()
    .then(result => {
      console.log('\n🎯 TEST RESULT:');
      console.log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log(`Message: ${result.message}`);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test crashed:', error);
      process.exit(1);
    });
}

module.exports = { testFixedAdminLogin };