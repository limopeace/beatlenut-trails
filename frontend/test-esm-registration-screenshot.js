const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function screenshotESMRegistration() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Set viewport size
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to ESM registration page
    console.log('📄 Navigating to ESM registration page...');
    await page.goto('http://localhost:3002/esm-portal/register', { waitUntil: 'networkidle2' });
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'test-results', 'esm-registration-hero-updated.png');
    
    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    console.log(`📸 Screenshot saved to: ${screenshotPath}`);
    
    // Also take a focused screenshot of just the hero section
    const heroElement = await page.$('section.bg-deep-forest');
    if (heroElement) {
      const heroScreenshotPath = path.join(__dirname, 'test-results', 'esm-registration-hero-section-only.png');
      await heroElement.screenshot({ path: heroScreenshotPath });
      console.log(`📸 Hero section screenshot saved to: ${heroScreenshotPath}`);
    }
    
  } catch (error) {
    console.error('❌ Screenshot failed:', error.message);
  } finally {
    await browser.close();
  }
}

screenshotESMRegistration();