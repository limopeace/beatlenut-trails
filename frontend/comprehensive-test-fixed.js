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
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser' + Date.now() + '@example.com', // Unique email each time
    password: 'testpass123',
    phone: '9876543210'
  },
  testProduct: {
    name: 'Test Military Equipment',
    category: 'electronics',
    price: '5000',
    description: 'High-quality military-grade equipment for ESM community. This is a test product with a description longer than 50 characters to meet validation requirements.',
    stock: '10'
  },
  screenshotDir: path.join(__dirname, 'test-results', 'fixed-test-' + Date.now()),
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

  async waitAndType(page, selector, text, timeout = 10000, clearFirst = true) {
    await page.waitForSelector(selector, { timeout });
    if (clearFirst) {
      await page.click(selector, { clickCount: 3 }); // Select all
    }
    await page.type(selector, text);
  },

  async waitForNavigation(page, timeout = 10000) {
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout });
  },

  async checkForErrors(page) {
    const errors = await page.evaluate(() => {
      const errors = [];
      const errorElements = document.querySelectorAll('.text-red-500, .error, .alert-error, [class*="error"]');
      errorElements.forEach(el => {
        if (el.textContent.trim()) {
          errors.push(el.textContent.trim());
        }
      });
      return errors;
    });
    return errors;
  },

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    // Check if form exists
    const emailInput = await page.$('#email');
    const passwordInput = await page.$('#password');
    const loginButton = await page.$('button[type="button"]');

    if (!emailInput || !passwordInput || !loginButton) {
      throw new Error('Admin login form elements not found');
    }

    // The form has default values, but let's clear and type fresh values
    await utils.waitAndType(page, '#email', config.adminCredentials.email);
    await utils.waitAndType(page, '#password', config.adminCredentials.password);
    
    testResults.adminLogin.screenshots.push(
      await utils.takeScreenshot(page, 'admin-credentials-filled', 'Credentials entered')
    );

    // Click the demo login button
    await utils.waitAndClick(page, 'button[type="button"]');
    
    // Wait for navigation
    await utils.sleep(3000);
    
    testResults.adminLogin.screenshots.push(
      await utils.takeScreenshot(page, 'admin-post-login', 'After login attempt')
    );

    // Check if we're on dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/admin/dashboard') || currentUrl.includes('/admin') && !currentUrl.includes('/login')) {
      testResults.adminLogin.success = true;
      console.log('✅ Admin login successful');
      
      // Take dashboard screenshot
      if (!currentUrl.includes('/admin/dashboard')) {
        await page.goto(`${config.baseUrl}/admin/dashboard`, { waitUntil: 'networkidle0' });
      }
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

    // This is a multi-step form, start with step 1
    // Fill personal information (step 1)
    await utils.waitAndType(page, '#firstName', config.esmTestUser.firstName);
    await utils.waitAndType(page, '#lastName', config.esmTestUser.lastName);
    await utils.waitAndType(page, '#email', config.esmTestUser.email);
    await utils.waitAndType(page, '#phone', config.esmTestUser.phone);
    await utils.waitAndType(page, '#password', config.esmTestUser.password);
    await utils.waitAndType(page, '#confirmPassword', config.esmTestUser.password);

    testResults.esmRegistration.screenshots.push(
      await utils.takeScreenshot(page, 'esm-step1-filled', 'Step 1 - Personal info filled')
    );

    // Click Next to go to step 2
    const nextButton = await page.$('button:has-text("Next")') || await page.$('button[type="button"]:last-of-type');
    if (nextButton) {
      await nextButton.click();
      await utils.sleep(2000);
      
      testResults.esmRegistration.screenshots.push(
        await utils.takeScreenshot(page, 'esm-step2', 'Step 2 - Business info')
      );

      // Fill business information (optional, can skip)
      try {
        await utils.waitAndType(page, '#businessName', 'Test Business', 5000);
        await utils.waitAndType(page, '#businessDescription', 'Test business description', 5000);
      } catch (error) {
        console.log('⚠️ Business fields not found or optional, continuing...');
      }

      // Click Next to go to step 3
      const nextButton2 = await page.$('button:has-text("Next")') || await page.$('button[type="button"]:last-of-type');
      if (nextButton2) {
        await nextButton2.click();
        await utils.sleep(2000);
        
        testResults.esmRegistration.screenshots.push(
          await utils.takeScreenshot(page, 'esm-step3', 'Step 3 - Location info')
        );

        // Fill location (optional)
        try {
          await utils.waitAndType(page, '#address', 'Test Address', 5000);
          await utils.waitAndType(page, '#city', 'Test City', 5000);
          await utils.waitAndType(page, '#state', 'Test State', 5000);
          await utils.waitAndType(page, '#pincode', '123456', 5000);
        } catch (error) {
          console.log('⚠️ Location fields not found or optional, continuing...');
        }

        // Continue through steps until we reach the final step
        let currentStep = 3;
        while (currentStep < 6) {
          const nextBtn = await page.$('button:has-text("Next")');
          if (nextBtn) {
            await nextBtn.click();
            await utils.sleep(2000);
            currentStep++;
            
            testResults.esmRegistration.screenshots.push(
              await utils.takeScreenshot(page, `esm-step${currentStep}`, `Step ${currentStep}`)
            );

            // If we're on step 4 (categories), select at least one
            if (currentStep === 4) {
              try {
                const categoryCheckbox = await page.$('input[name="category"]');
                if (categoryCheckbox) {
                  await categoryCheckbox.click();
                }
              } catch (error) {
                console.log('⚠️ Category selection failed, continuing...');
              }
            }
          } else {
            break;
          }
        }

        // Final step - accept terms and submit
        try {
          await utils.waitAndClick(page, '#acceptTerms', 5000);
          await utils.waitAndClick(page, '#acceptPrivacyPolicy', 5000);
        } catch (error) {
          console.log('⚠️ Terms checkboxes not found, continuing...');
        }

        testResults.esmRegistration.screenshots.push(
          await utils.takeScreenshot(page, 'esm-final-step', 'Final step - Terms accepted')
        );

        // Submit the form
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
          await submitButton.click();
          await utils.sleep(5000);
          
          testResults.esmRegistration.screenshots.push(
            await utils.takeScreenshot(page, 'esm-registration-submitted', 'After registration submission')
          );

          // Check for success
          const currentUrl = page.url();
          const pageContent = await page.content();
          if (currentUrl.includes('/success') || pageContent.includes('success') || pageContent.includes('registered')) {
            testResults.esmRegistration.success = true;
            console.log('✅ ESM registration successful');
          } else {
            const errors = await utils.checkForErrors(page);
            testResults.esmRegistration.errors.push(...errors);
            console.log('⚠️ ESM registration status unclear, check screenshots');
          }
        } else {
          throw new Error('Submit button not found');
        }
      }
    } else {
      throw new Error('Next button not found in step 1');
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
    // Go directly to add product page (assuming we have a session or can access it)
    await page.goto(`${config.baseUrl}/esm-portal/add-product`, { waitUntil: 'networkidle0' });
    testResults.productPosting.screenshots.push(
      await utils.takeScreenshot(page, 'esm-add-product-page', 'Add product page loaded')
    );

    // Check if we need to login first
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('🔄 Need to login first...');
      
      // Login with test user (assuming they registered successfully)
      await utils.waitAndType(page, '#email', config.esmTestUser.email);
      await utils.waitAndType(page, '#password', config.esmTestUser.password);
      
      const loginButton = await page.$('button[type="submit"]') || await page.$('button[type="button"]');
      if (loginButton) {
        await loginButton.click();
        await utils.sleep(3000);
        
        // Navigate to add product again
        await page.goto(`${config.baseUrl}/esm-portal/add-product`, { waitUntil: 'networkidle0' });
      }
    }

    testResults.productPosting.screenshots.push(
      await utils.takeScreenshot(page, 'esm-product-form-start', 'Product form ready')
    );

    // Fill product form using exact selectors from analysis
    await utils.waitAndType(page, '#name', config.testProduct.name);
    await utils.waitAndType(page, '#price', config.testProduct.price);
    await utils.waitAndType(page, '#description', config.testProduct.description);
    await utils.waitAndType(page, '#stock', config.testProduct.stock);

    // Select category
    await page.select('#category', config.testProduct.category);

    testResults.productPosting.screenshots.push(
      await utils.takeScreenshot(page, 'esm-product-form-filled', 'Product form filled')
    );

    // Handle image upload - create a simple test image file
    const testImagePath = path.join(config.screenshotDir, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'test image content');
    
    try {
      const fileInput = await page.$('#images');
      if (fileInput) {
        await fileInput.uploadFile(testImagePath);
        await utils.sleep(2000);
        
        testResults.productPosting.screenshots.push(
          await utils.takeScreenshot(page, 'esm-product-with-image', 'Product with image uploaded')
        );
      }
    } catch (error) {
      console.log('⚠️ Image upload failed:', error.message);
    }

    // Submit product
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await utils.sleep(5000);
      
      testResults.productPosting.screenshots.push(
        await utils.takeScreenshot(page, 'esm-product-submitted', 'After product submission')
      );

      // Check for success
      const currentUrl = page.url();
      const pageContent = await page.content();
      if (currentUrl.includes('/my-listings') || pageContent.includes('success') || pageContent.includes('created')) {
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
# Fixed Comprehensive Test Report - ${new Date().toISOString()}

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

## Fixed Issues from Previous Test
1. ✅ Used correct CSS selectors based on actual component analysis
2. ✅ Fixed admin login button selector (button[type="button"])
3. ✅ Implemented multi-step form handling for ESM registration
4. ✅ Used exact field IDs and names from component code
5. ✅ Added proper wait times and error handling
6. ✅ Improved screenshot naming and descriptions

## Next Steps
${testResults.overall.success ? 
  '✅ All tests passed! The application is functioning correctly.' :
  'Please review the detailed screenshots to identify any remaining issues.'}

---
Generated by Fixed Comprehensive Test Suite
`;

  const reportPath = path.join(config.screenshotDir, 'test-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Test report saved: ${reportPath}`);
  
  return report;
}

// Main test execution
async function runComprehensiveTests() {
  console.log('🚀 Starting Fixed Comprehensive Test Suite...');
  console.log(`📁 Screenshots will be saved to: ${config.screenshotDir}`);
  
  const browser = await puppeteer.launch({
    headless: false, // Keep browser visible to see what's happening
    defaultViewport: config.viewport,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    slowMo: 100 // Add slight delay between actions for better visibility
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
    console.log('\n🏁 Fixed test suite completed!');
    console.log(`📸 Screenshots saved in: ${config.screenshotDir}`);
  }
}

// Export for use in other scripts
module.exports = { runComprehensiveTests, config, testResults };

// Run if called directly
if (require.main === module) {
  runComprehensiveTests().catch(console.error);
}