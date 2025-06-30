const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function checkConsoleErrors() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Create error analysis directory
  const errorDir = path.join(__dirname, 'error-analysis');
  if (!fs.existsSync(errorDir)) {
    fs.mkdirSync(errorDir);
  }

  // Define pages to check
  const pages = [
    { name: 'homepage', url: 'http://localhost:3000' },
    { name: 'about', url: 'http://localhost:3000/about' },
    { name: 'services', url: 'http://localhost:3000/services' },
    { name: 'activities', url: 'http://localhost:3000/activities' },
    { name: 'destinations', url: 'http://localhost:3000/destinations' },
    { name: 'travel-listings', url: 'http://localhost:3000/travel-listings' },
    { name: 'contact', url: 'http://localhost:3000/contact' },
    { name: 'team', url: 'http://localhost:3000/team' },
    { name: 'bike-rentals', url: 'http://localhost:3000/bike-rentals' },
    { name: 'bike-detail-1', url: 'http://localhost:3000/bike-rentals/1' },
    { name: 'bike-detail-2', url: 'http://localhost:3000/bike-rentals/2' }
  ];

  const errorReport = [];

  try {
    console.log('🐛 Checking for console errors on all pages...');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      consoleMessages.push({
        type: type,
        text: text,
        timestamp: new Date().toISOString()
      });
      
      if (type === 'error' || type === 'warning') {
        console.log(`${type.toUpperCase()}: ${text}`);
      }
    });

    // Capture page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.log(`PAGE ERROR: ${error.message}`);
    });

    // Capture failed requests
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure().errorText,
        timestamp: new Date().toISOString()
      });
      console.log(`FAILED REQUEST: ${request.url()} - ${request.failure().errorText}`);
    });

    for (const pageInfo of pages) {
      try {
        console.log(`\n🔍 Checking ${pageInfo.name}...`);
        
        // Clear previous messages
        consoleMessages.length = 0;
        pageErrors.length = 0;
        failedRequests.length = 0;

        await page.goto(pageInfo.url, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for any async operations

        // Filter relevant errors
        const errors = consoleMessages.filter(msg => msg.type === 'error');
        const warnings = consoleMessages.filter(msg => msg.type === 'warning');

        const pageReport = {
          page: pageInfo.name,
          url: pageInfo.url,
          errors: errors,
          warnings: warnings,
          pageErrors: [...pageErrors],
          failedRequests: [...failedRequests],
          totalIssues: errors.length + warnings.length + pageErrors.length + failedRequests.length
        };

        errorReport.push(pageReport);

        console.log(`   Errors: ${errors.length}`);
        console.log(`   Warnings: ${warnings.length}`);
        console.log(`   Page Errors: ${pageErrors.length}`);
        console.log(`   Failed Requests: ${failedRequests.length}`);
        console.log(`   Total Issues: ${pageReport.totalIssues}`);

        // Log specific errors for immediate attention
        if (errors.length > 0) {
          console.log(`   🔴 ERRORS FOUND:`);
          errors.forEach((error, index) => {
            console.log(`     ${index + 1}. ${error.text}`);
          });
        }

        if (pageErrors.length > 0) {
          console.log(`   🔴 PAGE ERRORS FOUND:`);
          pageErrors.forEach((error, index) => {
            console.log(`     ${index + 1}. ${error.message}`);
          });
        }

        if (failedRequests.length > 0) {
          console.log(`   🔴 FAILED REQUESTS:`);
          failedRequests.forEach((req, index) => {
            console.log(`     ${index + 1}. ${req.url} - ${req.failure}`);
          });
        }

      } catch (error) {
        console.log(`❌ Failed to check ${pageInfo.name}: ${error.message}`);
        errorReport.push({
          page: pageInfo.name,
          url: pageInfo.url,
          checkError: error.message,
          totalIssues: 1
        });
      }
    }

    // Generate comprehensive error report
    const reportPath = path.join(errorDir, 'console-errors-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(errorReport, null, 2));

    // Generate summary
    const totalPages = errorReport.length;
    const pagesWithErrors = errorReport.filter(p => p.totalIssues > 0).length;
    const totalErrors = errorReport.reduce((sum, p) => sum + (p.errors?.length || 0), 0);
    const totalWarnings = errorReport.reduce((sum, p) => sum + (p.warnings?.length || 0), 0);

    console.log('\n📊 Console Error Analysis Summary:');
    console.log('=====================================');
    console.log(`📄 Total Pages Checked: ${totalPages}`);
    console.log(`🔴 Pages with Issues: ${pagesWithErrors}`);
    console.log(`❌ Total Errors: ${totalErrors}`);
    console.log(`⚠️  Total Warnings: ${totalWarnings}`);
    console.log(`🎯 Success Rate: ${Math.round(((totalPages - pagesWithErrors) / totalPages) * 100)}%`);

    console.log('\n🔍 Issues by Page:');
    errorReport.forEach(page => {
      if (page.totalIssues > 0) {
        console.log(`   ${page.page}: ${page.totalIssues} issues`);
      }
    });

    console.log(`\n📁 Detailed report saved to: ${reportPath}`);

    // Generate fix recommendations
    const commonErrors = {};
    errorReport.forEach(page => {
      if (page.errors) {
        page.errors.forEach(error => {
          const errorKey = error.text.substring(0, 100); // First 100 chars
          commonErrors[errorKey] = (commonErrors[errorKey] || 0) + 1;
        });
      }
    });

    if (Object.keys(commonErrors).length > 0) {
      console.log('\n🔧 Most Common Errors (need fixing):');
      Object.entries(commonErrors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([error, count]) => {
          console.log(`   ${count}x: ${error}${error.length > 100 ? '...' : ''}`);
        });
    }

  } catch (error) {
    console.error('❌ Error during console error checking:', error);
  } finally {
    await browser.close();
  }
}

// Run the error check
checkConsoleErrors().catch(console.error);