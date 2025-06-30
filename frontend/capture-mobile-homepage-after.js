const puppeteer = require('puppeteer');
const path = require('path');

async function captureHomepageAfter() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Mobile screenshot (375x667 - iPhone SE)
    console.log('📱 Capturing mobile homepage after fixes...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });

    console.log('📱 Loading homepage...');
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for animations
    
    // Capture full page screenshot
    await mobilePage.screenshot({
      path: path.join(__dirname, 'mobile-design-screenshots', 'mobile-homepage-after-fixes.png'),
      fullPage: true
    });
    
    console.log('✅ Mobile homepage after fixes captured');

    // Also capture desktop for comparison
    console.log('📸 Capturing desktop homepage after fixes...');
    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1920, height: 1080 });

    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for animations
    
    await desktopPage.screenshot({
      path: path.join(__dirname, 'mobile-design-screenshots', 'desktop-homepage-after-fixes.png'),
      fullPage: true
    });
    
    console.log('✅ Desktop homepage after fixes captured');

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot capture
captureHomepageAfter().catch(console.error);