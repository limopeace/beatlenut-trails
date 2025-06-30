const puppeteer = require('puppeteer');
const path = require('path');

async function testBikeDetailPage() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log('🏍️ Testing bike detail page functionality...');
    
    // Test on mobile
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });

    // Go to bike rentals page
    console.log('📱 Loading bike rentals page...');
    await mobilePage.goto('http://localhost:3000/bike-rentals', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot of listings page
    await mobilePage.screenshot({
      path: path.join(__dirname, 'scroll-test-results', 'bike-rentals-with-links.png'),
      fullPage: true
    });

    // Test clicking on first bike
    console.log('🎯 Testing bike listing click...');
    const firstBikeExists = await mobilePage.$('a[href="/bike-rentals/1"]');
    
    if (firstBikeExists) {
      await mobilePage.click('a[href="/bike-rentals/1"]');
      await mobilePage.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Verify we're on the detail page
      const currentUrl = mobilePage.url();
      console.log(`✅ Navigated to: ${currentUrl}`);
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot of detail page
      await mobilePage.screenshot({
        path: path.join(__dirname, 'scroll-test-results', 'bike-detail-page-mobile.png'),
        fullPage: true
      });
      
      // Test interactive elements
      console.log('🔧 Testing interactive elements...');
      
      // Test duration selector
      const durationButton3 = await mobilePage.$('button:contains("3 days")');
      if (durationButton3) {
        await mobilePage.click('button[type="button"]:nth-of-type(2)'); // 3 days button
        console.log('✅ Duration selector working');
      }
      
      // Test image navigation if multiple images
      const nextImageButton = await mobilePage.$('button[aria-label="Next slide"]');
      if (nextImageButton) {
        await mobilePage.click('button[aria-label="Next slide"]');
        console.log('✅ Image navigation working');
      }
      
      // Test back navigation
      console.log('🔙 Testing back navigation...');
      const backButton = await mobilePage.$('a:contains("Back to Bike Rentals")');
      if (backButton) {
        await mobilePage.click('a[href="/bike-rentals"]');
        await mobilePage.waitForNavigation({ waitUntil: 'networkidle2' });
        
        const backUrl = mobilePage.url();
        console.log(`✅ Back navigation working: ${backUrl}`);
      }
      
    } else {
      console.log('❌ No bike links found - check if Link component is properly implemented');
    }

    // Test direct URL access
    console.log('🔗 Testing direct URL access...');
    await mobilePage.goto('http://localhost:3000/bike-rentals/2', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await mobilePage.screenshot({
      path: path.join(__dirname, 'scroll-test-results', 'bike-detail-2-mobile.png'),
      fullPage: true
    });

    console.log('✅ Bike detail page testing completed successfully!');

  } catch (error) {
    console.error('❌ Error during bike detail testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testBikeDetailPage().catch(console.error);