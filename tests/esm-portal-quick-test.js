const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

async function capturePortalScreenshots() {
  console.log('📸 Starting ESM Portal Visual Testing...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const screenshots = [
    { url: 'http://localhost:3000/esm-portal', name: 'esm-portal-homepage' },
    { url: 'http://localhost:3000/esm-portal/login', name: 'login-page' },
    { url: 'http://localhost:3000/esm-portal/register', name: 'registration-form' },
    { url: 'http://localhost:3000/esm-portal/products', name: 'products-page' },
    { url: 'http://localhost:3000/esm-portal/services', name: 'services-page' },
    { url: 'http://localhost:3000/admin/login', name: 'admin-login' },
    { url: 'http://localhost:3000/admin/dashboard', name: 'admin-dashboard' },
    { url: 'http://localhost:3000/admin/sellers', name: 'admin-sellers' },
    { url: 'http://localhost:3000/admin/approvals', name: 'admin-approvals' }
  ];
  
  for (const { url, name } of screenshots) {
    try {
      console.log(`Capturing: ${name}...`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for dynamic content
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      await page.screenshot({ 
        path: path.join(screenshotsDir, filename),
        fullPage: true 
      });
      console.log(`✅ Saved: ${filename}`);
    } catch (error) {
      console.error(`❌ Error capturing ${name}:`, error.message);
    }
  }
  
  // Test responsive design
  console.log('\n📱 Testing Responsive Design...');
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];
  
  await page.goto('http://localhost:3000/esm-portal');
  
  for (const { name, width, height } of viewports) {
    await page.setViewport({ width, height });
    await new Promise(resolve => setTimeout(resolve, 500));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `esm-portal-${name}_${timestamp}.png`;
    await page.screenshot({ 
      path: path.join(screenshotsDir, filename),
      fullPage: true 
    });
    console.log(`✅ Captured ${name} view: ${filename}`);
  }
  
  await browser.close();
  console.log('\n🏁 Visual testing completed!');
}

// Run the test
if (require.main === module) {
  capturePortalScreenshots().catch(console.error);
}

module.exports = { capturePortalScreenshots };