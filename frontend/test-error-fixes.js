const puppeteer = require('puppeteer');
const path = require('path');

async function testErrorFixes() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log('🧪 Testing error fixes...');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 });

    // Capture console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(`PAGE ERROR: ${error.message}`);
    });

    page.on('requestfailed', request => {
      errors.push(`FAILED REQUEST: ${request.url()}`);
    });

    // Test bike rentals page
    console.log('📱 Testing bike-rentals page...');
    await page.goto('http://localhost:3000/bike-rentals', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    const bikeRentalsErrors = [...errors];
    errors.length = 0;

    // Test clicking on View Details button
    console.log('🎯 Testing View Details button...');
    const viewDetailsButton = await page.$('a[href="/bike-rentals/1"]');
    if (viewDetailsButton) {
      await viewDetailsButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    const bikeDetailErrors = [...errors];

    // Take screenshots
    await page.screenshot({
      path: path.join(__dirname, 'error-analysis', 'bike-detail-fixed.png'),
      fullPage: true
    });

    console.log('\n📊 Error Fix Results:');
    console.log('=====================');
    console.log(`🏍️  Bike Rentals Page Errors: ${bikeRentalsErrors.length}`);
    console.log(`📄 Bike Detail Page Errors: ${bikeDetailErrors.length}`);

    if (bikeRentalsErrors.length > 0) {
      console.log('\n🔴 Bike Rentals Errors:');
      bikeRentalsErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.substring(0, 100)}...`);
      });
    }

    if (bikeDetailErrors.length > 0) {
      console.log('\n🔴 Bike Detail Errors:');
      bikeDetailErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.substring(0, 100)}...`);
      });
    }

    if (bikeRentalsErrors.length === 0 && bikeDetailErrors.length === 0) {
      console.log('\n✅ All major errors have been fixed!');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testErrorFixes().catch(console.error);