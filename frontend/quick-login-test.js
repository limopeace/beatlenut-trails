const puppeteer = require('puppeteer');

async function quickLoginTest() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🔐 Testing admin login...');
  
  try {
    // Enable console logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto('http://localhost:3002/admin/login', { waitUntil: 'networkidle0' });
    
    // Fill form (inputs are pre-filled, but let's clear and type)
    await page.click('#email');
    await page.keyboard.down('Meta');
    await page.keyboard.press('a');
    await page.keyboard.up('Meta');
    await page.type('#email', 'admin@beatlenut.com');
    
    await page.click('#password');
    await page.keyboard.down('Meta');
    await page.keyboard.press('a'); 
    await page.keyboard.up('Meta');
    await page.type('#password', 'admin123');
    
    console.log('Form filled, submitting...');
    
    // Click submit button
    await page.click('button[type="button"]');
    
    // Wait for navigation or response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Login successful!');
      
      // Check dashboard content
      const title = await page.title();
      console.log('Dashboard title:', title);
      
      const hasStats = await page.$('.text-3xl, .text-2xl') !== null;
      console.log('Dashboard has stats:', hasStats);
      
    } else {
      console.log('❌ Login failed - still on login page');
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
  
  await browser.close();
}

quickLoginTest().catch(console.error);