const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testScrollFixes() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Create test results directory
  const testDir = path.join(__dirname, 'scroll-test-results');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }

  // Define pages to test
  const pages = [
    { name: 'homepage', url: 'http://localhost:3000' },
    { name: 'about', url: 'http://localhost:3000/about' },
    { name: 'bike-rentals', url: 'http://localhost:3000/bike-rentals' },
    { name: 'bike-detail', url: 'http://localhost:3000/bike-rentals/1' },
    { name: 'services', url: 'http://localhost:3000/services' },
    { name: 'contact', url: 'http://localhost:3000/contact' }
  ];

  const testResults = [];

  try {
    console.log('🧪 Testing scroll fixes on mobile...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 375, height: 667 });

    for (const pageInfo of pages) {
      try {
        console.log(`📱 Testing ${pageInfo.name}...`);
        await mobilePage.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check for horizontal scroll
        const scrollInfo = await mobilePage.evaluate(() => {
          return {
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight,
            verticalRatio: document.documentElement.scrollHeight / window.innerHeight
          };
        });

        const result = {
          page: pageInfo.name,
          url: pageInfo.url,
          horizontalScrollFixed: !scrollInfo.hasHorizontalScroll,
          documentWidth: scrollInfo.documentWidth,
          viewportWidth: scrollInfo.viewportWidth,
          verticalRatio: scrollInfo.verticalRatio.toFixed(1),
          status: scrollInfo.hasHorizontalScroll ? '❌ HORIZONTAL SCROLL DETECTED' : '✅ NO HORIZONTAL SCROLL'
        };

        testResults.push(result);

        // Take screenshot
        await mobilePage.screenshot({
          path: path.join(testDir, `${pageInfo.name}-after-fixes.png`),
          fullPage: true
        });

        console.log(`${result.status} - ${pageInfo.name} (${scrollInfo.documentWidth}px)`);

      } catch (error) {
        console.log(`❌ Failed to test ${pageInfo.name}: ${error.message}`);
        testResults.push({
          page: pageInfo.name,
          url: pageInfo.url,
          error: error.message,
          status: '❌ TEST FAILED'
        });
      }
    }

    // Generate test report
    const reportPath = path.join(testDir, 'scroll-fixes-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));

    console.log('\n📊 Scroll Fixes Test Results:');
    console.log('==============================');

    const fixedCount = testResults.filter(r => r.horizontalScrollFixed).length;
    const totalTests = testResults.filter(r => !r.error).length;

    console.log(`✅ Fixed: ${fixedCount}/${totalTests} pages`);
    console.log(`🔧 Success Rate: ${Math.round((fixedCount/totalTests) * 100)}%\n`);

    testResults.forEach(result => {
      if (result.error) {
        console.log(`❌ ${result.page}: ${result.error}`);
      } else {
        console.log(`${result.status} - ${result.page}`);
        console.log(`   Width: ${result.documentWidth}px (viewport: ${result.viewportWidth}px)`);
        console.log(`   Vertical: ${result.verticalRatio}x viewport height`);
      }
    });

    console.log(`\n📁 Test results saved to: ${reportPath}`);
    console.log(`📸 Screenshots saved to: ${testDir}`);

  } catch (error) {
    console.error('❌ Error during scroll testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testScrollFixes().catch(console.error);