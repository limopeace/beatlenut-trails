const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testAdminWorkflow() {
  let browser = null;
  
  try {
    console.log('🚀 Starting Admin Portal Test');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, '../test-results/screenshots/admin-test');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    let stepCount = 1;
    
    // Step 1: Navigate to admin portal
    console.log('📍 Step 1: Navigate to Admin Portal');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-admin-portal-landing.png`), fullPage: true });
    
    // Step 2: Check if redirected to login
    console.log('📍 Step 2: Check Login Redirection');
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-login-page.png`), fullPage: true });
      console.log('✅ Redirected to login page');
    } else {
      console.log('ℹ️ Not redirected to login, checking for login form on current page');
    }
    
    // Step 3: Fill login form
    console.log('📍 Step 3: Fill Login Form');
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    
    if (emailInput && passwordInput) {
      await emailInput.type('admin@beatlenut.com');
      await passwordInput.type('admin123');
      await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-login-form-filled.png`), fullPage: true });
      console.log('✅ Login form filled');
      
      // Step 4: Submit login
      console.log('📍 Step 4: Submit Login');
      const loginButton = await page.$('button[type="submit"], button:contains("Login")');
      if (loginButton) {
        await loginButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-after-login.png`), fullPage: true });
        
        const finalUrl = page.url();
        console.log(`✅ Login submitted, final URL: ${finalUrl}`);
        
        // Step 5: Check dashboard
        console.log('📍 Step 5: Check Dashboard Content');
        if (finalUrl.includes('/dashboard') || finalUrl.includes('/admin')) {
          const headings = await page.$$eval('h1, h2, h3', els => 
            els.map(el => el.textContent.trim()).filter(text => text.length > 0)
          );
          
          console.log(`✅ Dashboard loaded with headings: ${headings.join(', ')}`);
          
          // Step 6: Test navigation
          console.log('📍 Step 6: Test Navigation Menu');
          const navLinks = await page.$$eval('nav a, [class*="nav"] a', els =>
            els.map(el => ({
              text: el.textContent.trim(),
              href: el.href
            })).filter(link => link.text.length > 0)
          );
          
          console.log(`✅ Found ${navLinks.length} navigation links`);
          
          // Try to navigate to sellers page
          const sellersLink = navLinks.find(link => 
            link.text.toLowerCase().includes('seller') || link.href.includes('sellers')
          );
          
          if (sellersLink) {
            console.log('📍 Step 7: Navigate to Sellers Page');
            await page.goto(sellersLink.href, { waitUntil: 'networkidle2' });
            await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-sellers-page.png`), fullPage: true });
            console.log('✅ Navigated to sellers page');
          }
          
          // Return to dashboard
          await page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
          await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-final-dashboard.png`), fullPage: true });
          
        } else {
          console.log('❌ Login may have failed, not redirected to dashboard');
        }
      } else {
        console.log('❌ Login button not found');
        await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-no-login-button.png`), fullPage: true });
      }
    } else {
      console.log('❌ Login form inputs not found');
      await page.screenshot({ path: path.join(screenshotsDir, `${stepCount++}-no-login-form.png`), fullPage: true });
    }
    
    console.log('🎉 Admin workflow test completed');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testAdminWorkflow();