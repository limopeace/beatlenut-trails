const puppeteer = require('puppeteer');

async function testESMFormSubmission() {
  let browser;
  let page;
  const errors = [];
  
  try {
    console.log('🚀 Testing ESM Form Submission...\n');

    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    // Monitor console for errors
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.log(`🔴 Console Error: ${text}`);
        errors.push({ type: 'console', text });
      }
    });

    // Monitor network responses
    page.on('response', async response => {
      const url = response.url();
      const status = response.status();
      
      if (url.includes('/api/')) {
        console.log(`🌐 API Call: ${status} ${url}`);
        
        if (status >= 400) {
          try {
            const responseText = await response.text();
            console.log(`🔴 API Error Response: ${responseText}`);
            errors.push({ type: 'api', url, status, response: responseText });
          } catch (e) {
            console.log(`🔴 API Error (could not read response)`);
          }
        }
      }
    });

    // Navigate to page
    await page.goto('http://localhost:3001/esm-portal/register', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('📝 Filling out complete form...');

    // Step 1: Personal Information
    await page.type('#firstName', 'John', { delay: 50 });
    await page.type('#lastName', 'Doe', { delay: 50 });
    await page.type('#email', `testuser${Date.now()}@example.com`, { delay: 50 });
    await page.type('#phone', '9876543210', { delay: 50 });
    await page.type('#password', 'TestPassword123!', { delay: 50 });
    await page.type('#confirmPassword', 'TestPassword123!', { delay: 50 });
    await page.type('#serviceBackground', 'Experienced Army officer with 15 years of service in logistics and operations management. Specialized in supply chain optimization and team leadership.', { delay: 20 });

    // Click Next
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextButton = buttons.find(btn => btn.textContent && btn.textContent.trim().toLowerCase().includes('next'));
      if (nextButton) nextButton.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Business Information
    await page.type('#businessName', 'Military Logistics Solutions', { delay: 50 });
    await page.type('#businessDescription', 'Professional consulting services specializing in logistics optimization, supply chain management, and operational efficiency for businesses seeking military-grade precision and reliability.', { delay: 20 });
    await page.type('#establishmentYear', '2021', { delay: 50 });
    await page.type('#website', 'https://millogistics.com', { delay: 50 });

    // Click Next
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextButton = buttons.find(btn => btn.textContent && btn.textContent.trim().toLowerCase().includes('next'));
      if (nextButton) nextButton.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Service Location
    await page.type('#address', '123 Military Road, Defense Colony', { delay: 50 });
    await page.type('#city', 'New Delhi', { delay: 50 });
    await page.type('#state', 'Delhi', { delay: 50 });
    await page.type('#pincode', '110024', { delay: 50 });
    await page.type('#serviceRadius', '100', { delay: 50 });

    // Click Next
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextButton = buttons.find(btn => btn.textContent && btn.textContent.trim().toLowerCase().includes('next'));
      if (nextButton) nextButton.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Service Categories
    const categoryCheckboxes = await page.$$('input[type="checkbox"][name="category"]');
    if (categoryCheckboxes.length > 0) {
      await categoryCheckboxes[0].click(); // Select first category
      console.log('✅ Selected service category');
    }

    // Click Next
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextButton = buttons.find(btn => btn.textContent && btn.textContent.trim().toLowerCase().includes('next'));
      if (nextButton) nextButton.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 5: Documents (Required - create dummy files)
    console.log('📎 Handling document uploads...');
    
    // Create temporary files for testing
    const fs = require('fs');
    const path = require('path');
    
    // Create dummy files
    const tempDir = '/tmp';
    const dummyImagePath = path.join(tempDir, 'dummy-image.jpg');
    const dummyDocPath = path.join(tempDir, 'dummy-doc.pdf');
    
    // Create minimal dummy files
    fs.writeFileSync(dummyImagePath, Buffer.from('dummy image content'));
    fs.writeFileSync(dummyDocPath, Buffer.from('dummy document content'));
    
    // Upload files
    const identityInput = await page.$('#identityProof');
    if (identityInput) {
      await identityInput.uploadFile(dummyDocPath);
      console.log('✅ Identity proof uploaded');
    }
    
    const serviceInput = await page.$('#serviceProof');
    if (serviceInput) {
      await serviceInput.uploadFile(dummyDocPath);
      console.log('✅ Service proof uploaded');
    }
    
    const profileImageInput = await page.$('#profileImage');
    if (profileImageInput) {
      await profileImageInput.uploadFile(dummyImagePath);
      console.log('✅ Profile image uploaded');
    }

    // Click Next
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextButton = buttons.find(btn => btn.textContent && btn.textContent.trim().toLowerCase().includes('next'));
      if (nextButton) nextButton.click();
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 6: Terms and Conditions
    const termsCheckbox = await page.$('#acceptTerms');
    if (termsCheckbox) {
      await termsCheckbox.click();
      console.log('✅ Terms accepted');
    }

    const privacyCheckbox = await page.$('#acceptPrivacyPolicy');
    if (privacyCheckbox) {
      await privacyCheckbox.click();
      console.log('✅ Privacy policy accepted');
    }

    // Take screenshot before submission
    await page.screenshot({ path: 'esm-before-submission.png', fullPage: true });

    // Submit the form
    console.log('🚀 Submitting form...');
    const submitButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => 
        btn.textContent && 
        (btn.textContent.trim().toLowerCase().includes('submit') || 
         btn.textContent.trim().toLowerCase().includes('register') ||
         btn.type === 'submit')
      );
    });

    if (submitButton) {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const submitBtn = buttons.find(btn => 
          btn.textContent && 
          (btn.textContent.trim().toLowerCase().includes('submit') || 
           btn.textContent.trim().toLowerCase().includes('register') ||
           btn.type === 'submit')
        );
        if (submitBtn) submitBtn.click();
      });

      // Wait for submission response
      console.log('⏳ Waiting for submission response...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Check for success/error messages
      const successMessage = await page.$('.success, .alert-success, [data-testid="success"]');
      const errorMessage = await page.$('.error, .alert-error, [data-testid="error"]');

      if (successMessage) {
        const successText = await successMessage.textContent();
        console.log(`✅ Success message: ${successText}`);
      } else if (errorMessage) {
        const errorText = await errorMessage.textContent();
        console.log(`❌ Error message: ${errorText}`);
        errors.push({ type: 'form-error', text: errorText });
      } else {
        console.log('⚠️  No clear success/error message found');
      }

    } else {
      console.log('❌ No submit button found');
      errors.push({ type: 'ui-error', text: 'Submit button not found' });
    }

    // Take final screenshot
    await page.screenshot({ path: 'esm-after-submission.png', fullPage: true });

    // Clean up temporary files
    try {
      fs.unlinkSync(dummyImagePath);
      fs.unlinkSync(dummyDocPath);
    } catch (e) {}

    console.log('\n📊 SUBMISSION TEST SUMMARY:');
    console.log(`   - Total Errors: ${errors.length}`);
    console.log(`   - Console Errors: ${errors.filter(e => e.type === 'console').length}`);
    console.log(`   - API Errors: ${errors.filter(e => e.type === 'api').length}`);
    console.log(`   - Form Errors: ${errors.filter(e => e.type === 'form-error').length}`);

    if (errors.length > 0) {
      console.log('\n🔴 ERRORS FOUND:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.type}: ${error.text}`);
        if (error.url) console.log(`   URL: ${error.url}`);
        if (error.status) console.log(`   Status: ${error.status}`);
      });
    } else {
      console.log('\n✅ No errors detected during submission test!');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (page) {
      await page.screenshot({ path: 'esm-submission-error.png', fullPage: true });
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
if (require.main === module) {
  testESMFormSubmission().catch(console.error);
}

module.exports = { testESMFormSubmission };