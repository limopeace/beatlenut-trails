const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000',
  adminCredentials: {
    email: 'admin@beatlenut.com',
    password: 'admin123'
  },
  esmTestUser: {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpass123',
    phone: '9876543210',
    role: 'seller'
  },
  testProduct: {
    name: 'Test Military Gear',
    category: 'electronics',
    price: '5000',
    description: 'High-quality military-grade equipment for ESM community',
    location: 'Delhi',
    condition: 'new'
  },
  screenshotDir: path.join(__dirname, 'test-results', 'comprehensive-test-' + Date.now()),
  viewport: { width: 1366, height: 768 },
  timeout: 30000
};

// Ensure screenshot directory exists
if (!fs.existsSync(config.screenshotDir)) {
  fs.mkdirSync(config.screenshotDir, { recursive: true });
}

// Utility functions
const utils = {
  async takeScreenshot(page, name, description = '') {
    const filename = `${String(utils.screenshotCounter).padStart(3, '0')}-${name}.png`;
    const filepath = path.join(config.screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename} ${description ? '- ' + description : ''}`);
    utils.screenshotCounter++;
    return filename;
  },

  screenshotCounter: 1,

  async waitAndClick(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
  },

  async waitAndType(page, selector, text, timeout = 10000) {
    await page.waitForSelector(selector, { timeout });
    await page.type(selector, text);
  },

  async waitForNavigation(page, timeout = 10000) {
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout });
  },

  async checkForErrors(page) {
    const errors = await page.evaluate(() => {
      const errors = [];
      const errorElements = document.querySelectorAll('.error, .alert-error, [class*="error"]');
      errorElements.forEach(el => {
        if (el.textContent.trim()) {
          errors.push(el.textContent.trim());
        }
      });
      return errors;
    });
    return errors;
  }
};

// Test results tracking
const testResults = {
  adminLogin: { success: false, errors: [], screenshots: [] },
  esmRegistration: { success: false, errors: [], screenshots: [] },
  productPosting: { success: false, errors: [], screenshots: [] },
  overall: { success: false, errors: [], totalScreenshots: 0 }
};

async function testAdminLogin(browser) {
  console.log('\n🔐 Testing Admin Panel Login...');
  const page = await browser.newPage();
  await page.setViewport(config.viewport);
  
  try {
    // Navigate to admin login
    await page.goto(`${config.baseUrl}/admin/login`, { waitUntil: 'networkidle0' });
    testResults.adminLogin.screenshots.push(
      await utils.takeScreenshot(page, 'admin-login-page', 'Admin login page loaded')
    );

    // Check if login form exists
    const loginForm = await page.$('form');
    if (!loginForm) {
      throw new Error('Login form not found on admin page');
    }

    // Fill in credentials
    await utils.waitAndType(page, 'input[type="email"], input[name="email"]', config.adminCredentials.email);
    await utils.waitAndType(page, 'input[type="password"], input[name="password"]', config.adminCredentials.password);
    
    testResults.adminLogin.screenshots.push(
      await utils.takeScreenshot(page, 'admin-credentials-filled', 'Credentials entered')
    );

    // Click login button
    const loginButton = await page.$('button[type="submit"], button:contains("Login"), button:contains("Sign In")');
    if (loginButton) {
      await loginButton.click();
    } else {
      // Try alternative selectors
      await utils.waitAndClick(page, 'button');
    }

    // Wait for navigation or response
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    testResults.adminLogin.screenshots.push(
      await utils.takeScreenshot(page, 'admin-post-login', 'After login attempt')
    );

    // Check if we're on dashboard or still on login page
    const currentUrl = page.url();
    if (currentUrl.includes('/admin/dashboard') || currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
      testResults.adminLogin.success = true;
      console.log('✅ Admin login successful');
      
      // Take dashboard screenshot
      await page.goto(`${config.baseUrl}/admin/dashboard`, { waitUntil: 'networkidle0' });
      testResults.adminLogin.screenshots.push(
        await utils.takeScreenshot(page, 'admin-dashboard', 'Admin dashboard loaded')
      );
    } else {
      const errors = await utils.checkForErrors(page);
      testResults.adminLogin.errors.push(...errors);
      throw new Error('Admin login failed - still on login page');
    }

  } catch (error) {
    console.log('❌ Admin login failed:', error.message);
    testResults.adminLogin.errors.push(error.message);
    testResults.adminLogin.screenshots.push(
      await utils.takeScreenshot(page, 'admin-login-error', 'Admin login error state')
    );
  } finally {
    await page.close();
  }
}

async function testESMRegistration(browser) {
  console.log('\n👤 Testing ESM Portal Registration...');
  const page = await browser.newPage();
  await page.setViewport(config.viewport);
  
  try {
    // Navigate to ESM registration
    await page.goto(`${config.baseUrl}/esm-portal/register`, { waitUntil: 'networkidle0' });
    testResults.esmRegistration.screenshots.push(
      await utils.takeScreenshot(page, 'esm-registration-page', 'ESM registration page loaded')
    );

    // Fill registration form
    const fields = [
      { selector: 'input[name="name"], input[placeholder*="name"]', value: config.esmTestUser.name },
      { selector: 'input[name="email"], input[type="email"]', value: config.esmTestUser.email },
      { selector: 'input[name="phone"], input[placeholder*="phone"]', value: config.esmTestUser.phone },
      { selector: 'input[name="password"], input[type="password"]', value: config.esmTestUser.password }
    ];

    for (const field of fields) {
      try {
        await utils.waitAndType(page, field.selector, field.value);
      } catch (error) {
        console.log(`⚠️ Could not fill field ${field.selector}: ${error.message}`);
      }
    }

    // Select role if available
    try {
      const roleSelector = await page.$('select[name="role"], input[value="seller"]');
      if (roleSelector) {
        await page.select('select[name="role"]', 'seller');
      }
    } catch (error) {
      console.log('⚠️ Role selection not found or failed');
    }

    testResults.esmRegistration.screenshots.push(
      await utils.takeScreenshot(page, 'esm-registration-filled', 'Registration form filled')
    );

    // Submit registration
    const submitButton = await page.$('button[type="submit"], button:contains("Register"), button:contains("Sign Up")');
    if (submitButton) {
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      testResults.esmRegistration.screenshots.push(
        await utils.takeScreenshot(page, 'esm-registration-submitted', 'After registration submission')
      );

      // Check for success or error messages
      const currentUrl = page.url();
      if (currentUrl.includes('/success') || currentUrl.includes('/login')) {
        testResults.esmRegistration.success = true;
        console.log('✅ ESM registration successful');
      } else {
        const errors = await utils.checkForErrors(page);
        testResults.esmRegistration.errors.push(...errors);
        console.log('⚠️ ESM registration may have issues');
      }
    } else {
      throw new Error('Submit button not found');
    }

  } catch (error) {
    console.log('❌ ESM registration failed:', error.message);
    testResults.esmRegistration.errors.push(error.message);
    testResults.esmRegistration.screenshots.push(
      await utils.takeScreenshot(page, 'esm-registration-error', 'ESM registration error state')
    );
  } finally {
    await page.close();
  }
}

async function testProductPosting(browser) {
  console.log('\n📦 Testing Product Posting in ESM Portal...');
  const page = await browser.newPage();
  await page.setViewport(config.viewport);
  
  try {
    // First login to ESM portal
    await page.goto(`${config.baseUrl}/esm-portal/login`, { waitUntil: 'networkidle0' });
    testResults.productPosting.screenshots.push(
      await utils.takeScreenshot(page, 'esm-login-page', 'ESM login page for product posting')
    );

    // Use the test user credentials (or try existing user)
    await utils.waitAndType(page, 'input[type="email"], input[name="email"]', config.esmTestUser.email);
    await utils.waitAndType(page, 'input[type="password"], input[name="password"]', config.esmTestUser.password);
    
    const loginButton = await page.$('button[type="submit"]');
    if (loginButton) {
      await loginButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Navigate to add product page
    await page.goto(`${config.baseUrl}/esm-portal/add-product`, { waitUntil: 'networkidle0' });
    testResults.productPosting.screenshots.push(
      await utils.takeScreenshot(page, 'esm-add-product-page', 'Add product page loaded')
    );

    // Fill product form
    const productFields = [
      { selector: 'input[name="name"], input[placeholder*="name"]', value: config.testProduct.name },
      { selector: 'input[name="price"], input[placeholder*="price"]', value: config.testProduct.price },
      { selector: 'textarea[name="description"], textarea[placeholder*="description"]', value: config.testProduct.description },
      { selector: 'input[name="location"], input[placeholder*="location"]', value: config.testProduct.location }
    ];

    for (const field of productFields) {
      try {
        await utils.waitAndType(page, field.selector, field.value);
      } catch (error) {
        console.log(`⚠️ Could not fill product field ${field.selector}: ${error.message}`);
      }
    }

    // Select category if available
    try {
      const categorySelect = await page.$('select[name="category"]');
      if (categorySelect) {
        await page.select('select[name="category"]', config.testProduct.category);
      }
    } catch (error) {
      console.log('⚠️ Category selection not found or failed');
    }

    testResults.productPosting.screenshots.push(
      await utils.takeScreenshot(page, 'esm-product-form-filled', 'Product form filled')
    );

    // Submit product
    const submitButton = await page.$('button[type="submit"], button:contains("Add Product"), button:contains("Submit")');
    if (submitButton) {
      await submitButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      testResults.productPosting.screenshots.push(
        await utils.takeScreenshot(page, 'esm-product-submitted', 'After product submission')
      );

      // Check for success
      const currentUrl = page.url();
      if (currentUrl.includes('/success') || currentUrl.includes('/my-listings') || currentUrl.includes('/products')) {
        testResults.productPosting.success = true;
        console.log('✅ Product posting successful');
      } else {
        const errors = await utils.checkForErrors(page);
        testResults.productPosting.errors.push(...errors);
        console.log('⚠️ Product posting may have issues');
      }
    } else {
      throw new Error('Submit button not found');
    }

  } catch (error) {
    console.log('❌ Product posting failed:', error.message);
    testResults.productPosting.errors.push(error.message);
    testResults.productPosting.screenshots.push(
      await utils.takeScreenshot(page, 'esm-product-error', 'Product posting error state')
    );
  } finally {
    await page.close();
  }
}

async function generateTestReport() {
  console.log('\n📊 Generating Test Report...');
  
  const totalScreenshots = testResults.adminLogin.screenshots.length + 
                          testResults.esmRegistration.screenshots.length + 
                          testResults.productPosting.screenshots.length;
  
  testResults.overall.totalScreenshots = totalScreenshots;
  testResults.overall.success = testResults.adminLogin.success && 
                               testResults.esmRegistration.success && 
                               testResults.productPosting.success;

  const report = `
# Comprehensive Test Report - ${new Date().toISOString()}

## Test Configuration
- Frontend URL: ${config.baseUrl}
- Viewport: ${config.viewport.width}x${config.viewport.height}
- Screenshots Directory: ${config.screenshotDir}
- Total Screenshots: ${totalScreenshots}

## Test Results Summary
- **Overall Success**: ${testResults.overall.success ? '✅ PASSED' : '❌ FAILED'}
- **Admin Login**: ${testResults.adminLogin.success ? '✅ PASSED' : '❌ FAILED'}
- **ESM Registration**: ${testResults.esmRegistration.success ? '✅ PASSED' : '❌ FAILED'}
- **Product Posting**: ${testResults.productPosting.success ? '✅ PASSED' : '❌ FAILED'}

## Detailed Results

### 1. Admin Panel Login Test
- **Status**: ${testResults.adminLogin.success ? '✅ PASSED' : '❌ FAILED'}
- **Screenshots**: ${testResults.adminLogin.screenshots.length}
- **Errors**: ${testResults.adminLogin.errors.length > 0 ? testResults.adminLogin.errors.join(', ') : 'None'}
- **Screenshots**: ${testResults.adminLogin.screenshots.join(', ')}

### 2. ESM Portal Registration Test
- **Status**: ${testResults.esmRegistration.success ? '✅ PASSED' : '❌ FAILED'}
- **Screenshots**: ${testResults.esmRegistration.screenshots.length}
- **Errors**: ${testResults.esmRegistration.errors.length > 0 ? testResults.esmRegistration.errors.join(', ') : 'None'}
- **Screenshots**: ${testResults.esmRegistration.screenshots.join(', ')}

### 3. Product Posting Test
- **Status**: ${testResults.productPosting.success ? '✅ PASSED' : '❌ FAILED'}
- **Screenshots**: ${testResults.productPosting.screenshots.length}
- **Errors**: ${testResults.productPosting.errors.length > 0 ? testResults.productPosting.errors.join(', ') : 'None'}
- **Screenshots**: ${testResults.productPosting.screenshots.join(', ')}

## Test Data Used
- **Admin Credentials**: ${config.adminCredentials.email}
- **Test User**: ${config.esmTestUser.email}
- **Test Product**: ${config.testProduct.name}

## Next Steps
${testResults.overall.success ? 
  '✅ All tests passed! The application is functioning correctly.' :
  '❌ Some tests failed. Please review the errors and screenshots for debugging.'}

---
Generated by Comprehensive Test Suite
`;

  const reportPath = path.join(config.screenshotDir, 'test-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Test report saved: ${reportPath}`);
  
  return report;
}

// Main test execution
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Test Suite...');
  console.log(`📁 Screenshots will be saved to: ${config.screenshotDir}`);
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    defaultViewport: config.viewport,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    // Run all tests
    await testAdminLogin(browser);
    await testESMRegistration(browser);
    await testProductPosting(browser);
    
    // Generate report
    const report = await generateTestReport();
    console.log('\n' + report);
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await browser.close();
    console.log('\n🏁 Test suite completed!');
    console.log(`📸 Screenshots saved in: ${config.screenshotDir}`);
  }
}

// Export for use in other scripts
module.exports = { runComprehensiveTests, config, testResults };

// Run if called directly
if (require.main === module) {
  runComprehensiveTests().catch(console.error);
}