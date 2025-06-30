const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureWebsiteScreenshots() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'mobile-design-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Define pages to analyze
  const pages = [
    { name: 'homepage', url: 'http://localhost:3000' },
    { name: 'about', url: 'http://localhost:3000/about' },
    { name: 'services', url: 'http://localhost:3000/services' },
    { name: 'activities', url: 'http://localhost:3000/activities' },
    { name: 'destinations', url: 'http://localhost:3000/destinations' },
    { name: 'travel-listings', url: 'http://localhost:3000/travel-listings' },
    { name: 'contact', url: 'http://localhost:3000/contact' },
    { name: 'team', url: 'http://localhost:3000/team' }
  ];

  try {
    // Desktop screenshots (1920x1080)
    console.log('📸 Capturing desktop screenshots...');
    const desktopPage = await browser.newPage();
    await desktopPage.setViewport({ width: 1920, height: 1080 });

    for (const pageInfo of pages) {
      try {
        console.log(`📸 Desktop: Capturing ${pageInfo.name}...`);
        await desktopPage.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
        
        // Capture full page screenshot
        await desktopPage.screenshot({
          path: path.join(screenshotsDir, `desktop-${pageInfo.name}.png`),
          fullPage: true
        });
        
        console.log(`✅ Desktop ${pageInfo.name} captured`);
      } catch (error) {
        console.log(`❌ Failed to capture desktop ${pageInfo.name}: ${error.message}`);
      }
    }

    // Mobile screenshots (375x667 - iPhone SE)
    console.log('📱 Capturing mobile screenshots...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });

    for (const pageInfo of pages) {
      try {
        console.log(`📱 Mobile: Capturing ${pageInfo.name}...`);
        await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
        
        // Capture full page screenshot
        await mobilePage.screenshot({
          path: path.join(screenshotsDir, `mobile-${pageInfo.name}.png`),
          fullPage: true
        });
        
        console.log(`✅ Mobile ${pageInfo.name} captured`);
      } catch (error) {
        console.log(`❌ Failed to capture mobile ${pageInfo.name}: ${error.message}`);
      }
    }

    // Tablet screenshots (768x1024 - iPad)
    console.log('📱 Capturing tablet screenshots...');
    const tabletPage = await browser.newPage();
    await tabletPage.setViewport({ width: 768, height: 1024 });

    for (const pageInfo of pages) {
      try {
        console.log(`📱 Tablet: Capturing ${pageInfo.name}...`);
        await tabletPage.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
        
        // Capture full page screenshot
        await tabletPage.screenshot({
          path: path.join(screenshotsDir, `tablet-${pageInfo.name}.png`),
          fullPage: true
        });
        
        console.log(`✅ Tablet ${pageInfo.name} captured`);
      } catch (error) {
        console.log(`❌ Failed to capture tablet ${pageInfo.name}: ${error.message}`);
      }
    }

    console.log('\n🎉 Screenshot capture completed!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

// Run the screenshot capture
captureWebsiteScreenshots().catch(console.error);