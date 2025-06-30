const puppeteer = require('puppeteer');
const path = require('path');

async function captureAboutAfter() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Mobile screenshot (375x667 - iPhone SE)
    console.log('📱 Capturing about page mobile after fixes...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });

    console.log('📱 Loading about page...');
    await mobilePage.goto('http://localhost:3000/about', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for animations
    
    // Capture full page screenshot
    await mobilePage.screenshot({
      path: path.join(__dirname, 'mobile-design-screenshots', 'mobile-about-after-fixes.png'),
      fullPage: true
    });
    
    console.log('✅ Mobile about after fixes captured');

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot capture
captureAboutAfter().catch(console.error);