const puppeteer = require('puppeteer');

async function testESMRegistrationDetailed() {
  let browser;
  let page;
  const errors = [];
  const warnings = [];
  const networkErrors = [];
  
  try {
    console.log('🚀 Starting Detailed ESM Portal Registration Test...\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    // Detailed console monitoring
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      const location = msg.location();
      
      if (type === 'error') {
        errors.push({ type: 'console-error', text, location });
        console.log(`🔴 CONSOLE ERROR: ${text}`);
        if (location.url) {
          console.log(`   at ${location.url}:${location.lineNumber}:${location.columnNumber}`);
        }
      } else if (type === 'warning') {
        warnings.push({ type: 'console-warning', text, location });
        console.log(`⚠️  CONSOLE WARNING: ${text}`);
      } else if (type === 'log' && (text.includes('error') || text.includes('Error') || text.includes('failed'))) {
        console.log(`📝 CONSOLE LOG (potential issue): ${text}`);
      }
    });

    // Page error monitoring
    page.on('pageerror', error => {
      errors.push({ type: 'page-error', text: error.message, stack: error.stack });
      console.log('🔴 PAGE ERROR:', error.message);
      console.log('Stack:', error.stack);
    });

    // Network monitoring
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push({ url: response.url(), status: response.status(), statusText: response.statusText() });
        console.log(`🔴 HTTP ERROR: ${response.status()} ${response.statusText()} - ${response.url()}`);
      }
    });

    page.on('requestfailed', request => {
      networkErrors.push({ url: request.url(), failure: request.failure().errorText });
      console.log(`🔴 REQUEST FAILED: ${request.failure().errorText} - ${request.url()}`);
    });

    // Navigate to ESM registration page
    console.log('📄 Navigating to ESM registration page...');
    const navigationResponse = await page.goto('http://localhost:3001/esm-portal/register', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log(`📊 Navigation status: ${navigationResponse.status()}`);

    // Wait for form to load and analyze page structure
    console.log('⏳ Waiting for page to fully load...');
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Check if the page loaded correctly
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    // Check for form existence
    const forms = await page.$$('form');
    console.log(`📝 Found ${forms.length} form(s) on the page`);
    
    // Check for input fields
    const inputs = await page.$$('input');
    console.log(`🔤 Found ${inputs.length} input field(s)`);
    
    // Check for buttons
    const buttons = await page.$$('button');
    console.log(`🔘 Found ${buttons.length} button(s)`);
    
    // Try to find specific form elements
    const firstNameInput = await page.$('#firstName');
    const emailInput = await page.$('#email');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log(`🔍 Form analysis:`);
    console.log(`   - firstName input: ${firstNameInput ? 'Found' : 'Not found'}`);
    console.log(`   - email input: ${emailInput ? 'Found' : 'Not found'}`);
    console.log(`   - submit button: ${submitButton ? 'Found' : 'Not found'}`);

    // Take a screenshot of the initial state
    await page.screenshot({ path: 'esm-initial-state.png', fullPage: true });
    console.log('📸 Initial state screenshot saved: esm-initial-state.png');

    // Check for any React/Next.js specific errors in the DOM
    const reactErrors = await page.evaluate(() => {
      const errorBoundaries = document.querySelectorAll('[data-reactroot] [role="alert"], .error-boundary, .react-error');
      const errorMessages = [];
      errorBoundaries.forEach(el => {
        errorMessages.push(el.textContent);
      });
      return errorMessages;
    });

    if (reactErrors.length > 0) {
      console.log('🔴 React/Next.js errors found in DOM:');
      reactErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    // Try to interact with the form if it exists
    if (firstNameInput) {
      console.log('✅ Form found, attempting to fill basic fields...');
      
      try {
        await page.type('#firstName', 'John', { delay: 100 });
        console.log('✅ firstName field filled');
      } catch (error) {
        console.log(`❌ Error filling firstName: ${error.message}`);
        errors.push({ type: 'interaction-error', field: 'firstName', error: error.message });
      }

      try {
        await page.type('#lastName', 'Doe', { delay: 100 });
        console.log('✅ lastName field filled');
      } catch (error) {
        console.log(`❌ Error filling lastName: ${error.message}`);
        errors.push({ type: 'interaction-error', field: 'lastName', error: error.message });
      }

      try {
        await page.type('#email', `test${Date.now()}@example.com`, { delay: 100 });
        console.log('✅ email field filled');
      } catch (error) {
        console.log(`❌ Error filling email: ${error.message}`);
        errors.push({ type: 'interaction-error', field: 'email', error: error.message });
      }

      // Take screenshot after filling basic fields
      await page.screenshot({ path: 'esm-basic-fields-filled.png', fullPage: true });
      console.log('📸 Basic fields screenshot saved: esm-basic-fields-filled.png');
    } else {
      console.log('❌ No form found on the page');
      errors.push({ type: 'form-not-found', text: 'Registration form not found on page' });
    }

    // Check for any hydration errors
    const hydrationErrors = await page.evaluate(() => {
      const logs = [];
      // Check for common Next.js hydration error patterns
      const textContent = document.body.textContent || '';
      if (textContent.includes('Hydration error') || textContent.includes('hydration mismatch')) {
        logs.push('Potential hydration error detected in page content');
      }
      return logs;
    });

    if (hydrationErrors.length > 0) {
      console.log('🔴 Potential hydration errors:');
      hydrationErrors.forEach(error => {
        console.log(`   - ${error}`);
        errors.push({ type: 'hydration-error', text: error });
      });
    }

    // Summary Report
    console.log('\n📊 TEST SUMMARY:');
    console.log(`   - Console Errors: ${errors.filter(e => e.type === 'console-error').length}`);
    console.log(`   - Console Warnings: ${warnings.length}`);
    console.log(`   - Network Errors: ${networkErrors.length}`);
    console.log(`   - Interaction Errors: ${errors.filter(e => e.type === 'interaction-error').length}`);
    console.log(`   - React/Hydration Errors: ${errors.filter(e => e.type === 'hydration-error').length}`);

    if (errors.length > 0) {
      console.log('\n🔴 DETAILED ERROR ANALYSIS:');
      errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.type.toUpperCase()}:`);
        console.log(`   Message: ${error.text}`);
        if (error.location) {
          console.log(`   Location: ${error.location.url}:${error.location.lineNumber}`);
        }
        if (error.stack) {
          console.log(`   Stack: ${error.stack.split('\n')[0]}`);
        }
      });
    }

    if (networkErrors.length > 0) {
      console.log('\n🌐 NETWORK ERRORS:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.url} - ${error.status || error.failure}`);
      });
    }

    console.log('\n✅ Detailed ESM Registration Test Completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    errors.push({ type: 'test-error', text: error.message, stack: error.stack });
    
    if (page) {
      await page.screenshot({ path: 'esm-test-failure.png', fullPage: true });
      console.log('📸 Failure screenshot saved: esm-test-failure.png');
    }
  } finally {
    if (browser) {
      await browser.close();
    }

    // Return summary for analysis
    return {
      errors,
      warnings,
      networkErrors,
      summary: {
        totalErrors: errors.length,
        totalWarnings: warnings.length,
        totalNetworkErrors: networkErrors.length,
        testSuccessful: errors.length === 0
      }
    };
  }
}

// Run the test
if (require.main === module) {
  testESMRegistrationDetailed()
    .then(result => {
      console.log('\n🏁 Final Test Result:', result.summary);
    })
    .catch(console.error);
}

module.exports = { testESMRegistrationDetailed };