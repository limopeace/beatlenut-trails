const puppeteer = require('puppeteer');
const path = require('path');

async function testESMRegistration() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Starting ESM Portal Registration Test...\n');

    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: { width: 1280, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    // Enable console logging to catch Next.js errors
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error' || type === 'warning') {
        console.log(`🔴 Console ${type.toUpperCase()}: ${text}`);
      } else if (type === 'log' && (text.includes('error') || text.includes('Error'))) {
        console.log(`⚠️  Console LOG (potential error): ${text}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      console.log('🔴 PAGE ERROR:', error.message);
    });

    // Listen for response errors
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`🔴 HTTP ERROR: ${response.status()} - ${response.url()}`);
      }
    });

    // Navigate to ESM registration page
    console.log('📄 Navigating to ESM registration page...');
    await page.goto('http://localhost:3001/esm-portal/register', { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for the form to load
    console.log('⏳ Waiting for registration form to load...');
    await page.waitForSelector('form', { timeout: 10000 });

    // Fill out the multi-step registration form
    console.log('📝 Filling out multi-step registration form...');

    // Step 1: Personal Information
    console.log('Step 1: Personal Information');
    await page.type('#firstName', 'John', { delay: 50 });
    await page.type('#lastName', 'Doe', { delay: 50 });
    await page.type('#email', `test${Date.now()}@example.com`, { delay: 50 });
    await page.type('#phone', '9876543210', { delay: 50 });
    await page.type('#password', 'TestPassword123!', { delay: 50 });
    await page.type('#confirmPassword', 'TestPassword123!', { delay: 50 });
    await page.type('#serviceBackground', 'I am an ex-serviceman with 10 years of experience in the Army. I have expertise in logistics and management and want to provide consulting services to businesses.', { delay: 20 });
    
    // Click Next button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        if (button.textContent && button.textContent.includes('Next')) {
          button.click();
          break;
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Business Information
    console.log('Step 2: Business Information');
    await page.type('#businessName', 'Test ESM Business', { delay: 50 });
    await page.type('#businessDescription', 'A comprehensive business providing consulting services, training programs, and logistics support for various industries based on military experience and expertise.', { delay: 20 });
    await page.type('#establishmentYear', '2020', { delay: 50 });
    await page.type('#website', 'https://testbusiness.com', { delay: 50 });
    
    // Click Next button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        if (button.textContent && button.textContent.includes('Next')) {
          button.click();
          break;
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Service Location
    console.log('Step 3: Service Location');
    await page.type('#address', '123 Test Street, Test Area', { delay: 50 });
    await page.type('#city', 'Mumbai', { delay: 50 });
    await page.type('#state', 'Maharashtra', { delay: 50 });
    await page.type('#pincode', '400001', { delay: 50 });
    await page.type('#serviceRadius', '50', { delay: 50 });
    
    // Click Next button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        if (button.textContent && button.textContent.includes('Next')) {
          button.click();
          break;
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Service Categories
    console.log('Step 4: Service Categories');
    // Select first available category checkbox
    const categoryCheckboxes = await page.$$('input[type="checkbox"][name="category"]');
    if (categoryCheckboxes.length > 0) {
      await categoryCheckboxes[0].click();
    }
    
    // Click Next button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        if (button.textContent && button.textContent.includes('Next')) {
          button.click();
          break;
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 5: Documents (Skip file uploads for now)
    console.log('Step 5: Documents (skipping file uploads)');
    // Note: File uploads would require actual files, skipping for this test
    // Click Next button anyway to see what happens
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const button of buttons) {
        if (button.textContent && button.textContent.includes('Next')) {
          button.click();
          break;
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 6: Terms and Conditions
    console.log('Step 6: Terms and Conditions');
    const termsCheckbox = await page.$('#acceptTerms');
    if (termsCheckbox) {
      await termsCheckbox.click();
    }

    const privacyCheckbox = await page.$('#acceptPrivacyPolicy');
    if (privacyCheckbox) {
      await privacyCheckbox.click();
    }

    console.log('✅ Form steps completed');

    // Take a screenshot before submission
    await page.screenshot({ path: 'esm-registration-form.png', fullPage: true });
    console.log('📸 Screenshot saved: esm-registration-form.png');

    // Submit the form
    console.log('🚀 Submitting registration form...');
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      
      // Wait for navigation or success message
      try {
        await page.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle0' });
        console.log('✅ Form submitted successfully - page navigated');
      } catch (error) {
        // Check for success message on same page
        try {
          await page.waitForSelector('.success, .alert-success, [data-testid="success"]', { timeout: 5000 });
          console.log('✅ Form submitted successfully - success message displayed');
        } catch (msgError) {
          console.log('⚠️  Form submission response unclear - checking for errors...');
        }
      }
    } else {
      console.log('❌ Submit button not found');
    }

    // Take final screenshot
    await page.screenshot({ path: 'esm-registration-result.png', fullPage: true });
    console.log('📸 Final screenshot saved: esm-registration-result.png');

    // Check for any validation errors
    const errorElements = await page.$$('.error, .text-red-500, .alert-error, [role="alert"]');
    if (errorElements.length > 0) {
      console.log(`⚠️  Found ${errorElements.length} potential error elements on the page`);
      for (let i = 0; i < errorElements.length; i++) {
        const errorText = await errorElements[i].textContent();
        if (errorText && errorText.trim()) {
          console.log(`   Error ${i + 1}: ${errorText.trim()}`);
        }
      }
    }

    console.log('\n✅ ESM Registration Test Completed Successfully!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    if (page) {
      // Take error screenshot
      await page.screenshot({ path: 'esm-registration-error.png', fullPage: true });
      console.log('📸 Error screenshot saved: esm-registration-error.png');
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Check if this script is being run directly
if (require.main === module) {
  // Check if the required packages are installed
  try {
    require('puppeteer');
  } catch (error) {
    console.log('❌ Puppeteer is not installed. Please run: npm install puppeteer');
    process.exit(1);
  }

  testESMRegistration().catch(console.error);
}

module.exports = { testESMRegistration };