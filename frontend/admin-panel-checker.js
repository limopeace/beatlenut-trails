const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3002';
const ADMIN_EMAIL = 'admin@beatlenut.com';
const ADMIN_PASSWORD = 'admin123';

// Create results directory
const resultsDir = path.join(__dirname, 'test-results', 'admin-workflows');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Admin panel workflows to test
const adminWorkflows = [
  { name: 'Login', path: '/admin/login', requiresAuth: false },
  { name: 'Dashboard', path: '/admin/dashboard', requiresAuth: true },
  { name: 'Orders', path: '/admin/orders', requiresAuth: true },
  { name: 'Products', path: '/admin/products', requiresAuth: true },
  { name: 'Sellers', path: '/admin/sellers', requiresAuth: true },
  { name: 'Users', path: '/admin/users', requiresAuth: true },
  { name: 'Blog', path: '/admin/blog', requiresAuth: true },
  { name: 'Services', path: '/admin/services', requiresAuth: true },
  { name: 'Approvals', path: '/admin/approvals', requiresAuth: true },
  { name: 'Reports', path: '/admin/reports', requiresAuth: true },
  { name: 'Settings', path: '/admin/settings', requiresAuth: true },
  { name: 'Account', path: '/admin/account', requiresAuth: true },
  { name: 'Bookings', path: '/admin/bookings', requiresAuth: true },
  { name: 'Messages', path: '/admin/messages', requiresAuth: true },
  { name: 'Notifications', path: '/admin/notifications', requiresAuth: true },
  { name: 'Reviews', path: '/admin/reviews', requiresAuth: true },
  { name: 'Images', path: '/admin/images', requiresAuth: true },
  { name: 'Homepage Reviews', path: '/admin/homepage-reviews', requiresAuth: true }
];

// Results tracking
const testResults = {
  passed: [],
  failed: [],
  errors: [],
  screenshots: []
};

async function takeScreenshot(page, name, description = '') {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const fullPath = path.join(resultsDir, filename);
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`📸 Screenshot: ${filename} - ${description}`);
    testResults.screenshots.push({
      name: filename,
      description,
      timestamp: new Date().toISOString(),
      workflow: name
    });
    return filename;
  } catch (error) {
    console.error(`Failed to take screenshot for ${name}:`, error.message);
    return null;
  }
}

async function loginAsAdmin(page) {
  try {
    console.log('🔐 Attempting admin login...');
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Check if login form exists
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
      throw new Error('Login form elements not found');
    }
    
    await page.type('input[type="email"]', ADMIN_EMAIL);
    await page.type('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for redirect or error
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('✅ Admin login successful');
      await takeScreenshot(page, 'login-success', 'Successfully logged into admin dashboard');
      return true;
    } else {
      console.log('❌ Admin login failed - not redirected to dashboard');
      await takeScreenshot(page, 'login-failed', 'Login failed - no redirect to dashboard');
      return false;
    }
  } catch (error) {
    console.error('❌ Admin login error:', error.message);
    await takeScreenshot(page, 'login-error', `Login error: ${error.message}`);
    return false;
  }
}

async function testWorkflow(page, workflow, isLoggedIn) {
  console.log(`\n🧪 Testing: ${workflow.name} (${workflow.path})`);
  
  const errors = [];
  const warnings = [];
  
  try {
    // Navigate to the page
    const response = await page.goto(`${BASE_URL}${workflow.path}`, { 
      waitUntil: 'networkidle0', 
      timeout: 15000 
    });
    
    // Check response status
    if (response && response.status() >= 400) {
      errors.push(`HTTP ${response.status()} error`);
    }
    
    // Wait a moment for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for various error indicators
    const pageContent = await page.content();
    const currentUrl = page.url();
    
    // Check for Next.js errors
    if (pageContent.includes('Application error') || pageContent.includes('500') || pageContent.includes('404')) {
      errors.push('Next.js application error detected');
    }
    
    // Check for React errors
    if (pageContent.includes('Error:') && pageContent.includes('React')) {
      errors.push('React error detected');
    }
    
    // Check for authentication redirect
    if (workflow.requiresAuth && currentUrl.includes('/admin/login') && !workflow.path.includes('/login')) {
      errors.push('Redirected to login (authentication issue)');
    }
    
    // Check for 404 page
    if (pageContent.includes('404') || pageContent.includes('Page Not Found')) {
      errors.push('404 Page Not Found');
    }
    
    // Check for empty or minimal content
    const bodyText = await page.$eval('body', el => el.innerText);
    if (bodyText.length < 100) {
      warnings.push('Very minimal content detected');
    }
    
    // Check for common admin elements
    const hasAdminHeader = await page.$('.admin-header, header, .navbar') !== null;
    const hasAdminSidebar = await page.$('.sidebar, nav, .admin-nav') !== null;
    const hasMainContent = await page.$('main, .main-content, .content') !== null;
    
    if (!hasAdminHeader && !hasAdminSidebar && !hasMainContent) {
      warnings.push('Missing typical admin layout elements');
    }
    
    // Check console errors
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleLogs.push(`Console Error: ${msg.text()}`);
      }
    });
    
    // Take screenshot
    const screenshotName = workflow.name.toLowerCase().replace(/\s+/g, '-');
    const screenshotFile = await takeScreenshot(page, screenshotName, 
      errors.length === 0 ? `✅ ${workflow.name} loaded successfully` : `❌ ${workflow.name} has issues`);
    
    // Determine result
    const result = {
      workflow: workflow.name,
      path: workflow.path,
      status: errors.length === 0 ? 'PASSED' : 'FAILED',
      errors: errors,
      warnings: warnings,
      screenshot: screenshotFile,
      url: currentUrl,
      timestamp: new Date().toISOString()
    };
    
    if (errors.length === 0) {
      console.log(`✅ ${workflow.name}: PASSED`);
      testResults.passed.push(result);
    } else {
      console.log(`❌ ${workflow.name}: FAILED`);
      console.log(`   Errors: ${errors.join(', ')}`);
      testResults.failed.push(result);
    }
    
    if (warnings.length > 0) {
      console.log(`⚠️  Warnings: ${warnings.join(', ')}`);
    }
    
    return result;
    
  } catch (error) {
    console.error(`❌ ${workflow.name}: ERROR - ${error.message}`);
    
    const errorResult = {
      workflow: workflow.name,
      path: workflow.path,
      status: 'ERROR',
      errors: [error.message],
      warnings: [],
      screenshot: await takeScreenshot(page, `${workflow.name.toLowerCase().replace(/\s+/g, '-')}-error`, 
        `Error testing ${workflow.name}: ${error.message}`),
      url: page.url(),
      timestamp: new Date().toISOString()
    };
    
    testResults.errors.push(errorResult);
    return errorResult;
  }
}

async function generateReport() {
  const reportPath = path.join(resultsDir, 'admin-panel-test-report.md');
  const timestamp = new Date().toISOString();
  
  let report = `# Admin Panel Comprehensive Test Report\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Total Workflows Tested:** ${adminWorkflows.length}\n`;
  report += `**Passed:** ${testResults.passed.length}\n`;
  report += `**Failed:** ${testResults.failed.length}\n`;
  report += `**Errors:** ${testResults.errors.length}\n\n`;
  
  // Summary
  report += `## Summary\n\n`;
  const totalTests = testResults.passed.length + testResults.failed.length + testResults.errors.length;
  const successRate = totalTests > 0 ? Math.round((testResults.passed.length / totalTests) * 100) : 0;
  report += `**Success Rate:** ${successRate}%\n\n`;
  
  // Passed tests
  if (testResults.passed.length > 0) {
    report += `## ✅ Passed Tests (${testResults.passed.length})\n\n`;
    testResults.passed.forEach(result => {
      report += `- **${result.workflow}** (${result.path})\n`;
      if (result.screenshot) {
        report += `  - Screenshot: ${result.screenshot}\n`;
      }
      if (result.warnings.length > 0) {
        report += `  - Warnings: ${result.warnings.join(', ')}\n`;
      }
      report += `\n`;
    });
  }
  
  // Failed tests
  if (testResults.failed.length > 0) {
    report += `## ❌ Failed Tests (${testResults.failed.length})\n\n`;
    testResults.failed.forEach(result => {
      report += `- **${result.workflow}** (${result.path})\n`;
      report += `  - **Errors:** ${result.errors.join(', ')}\n`;
      if (result.screenshot) {
        report += `  - Screenshot: ${result.screenshot}\n`;
      }
      if (result.warnings.length > 0) {
        report += `  - Warnings: ${result.warnings.join(', ')}\n`;
      }
      report += `\n`;
    });
  }
  
  // Error tests
  if (testResults.errors.length > 0) {
    report += `## 🚨 Error Tests (${testResults.errors.length})\n\n`;
    testResults.errors.forEach(result => {
      report += `- **${result.workflow}** (${result.path})\n`;
      report += `  - **Error:** ${result.errors.join(', ')}\n`;
      if (result.screenshot) {
        report += `  - Screenshot: ${result.screenshot}\n`;
      }
      report += `\n`;
    });
  }
  
  // Recommendations
  report += `## 🔧 Recommendations\n\n`;
  
  const missingPages = testResults.failed.filter(r => r.errors.some(e => e.includes('404')));
  if (missingPages.length > 0) {
    report += `### Missing Pages (${missingPages.length})\n`;
    report += `The following pages need to be created:\n`;
    missingPages.forEach(page => {
      report += `- ${page.path}\n`;
    });
    report += `\n`;
  }
  
  const authIssues = testResults.failed.filter(r => r.errors.some(e => e.includes('authentication')));
  if (authIssues.length > 0) {
    report += `### Authentication Issues (${authIssues.length})\n`;
    report += `The following pages have authentication problems:\n`;
    authIssues.forEach(page => {
      report += `- ${page.path}\n`;
    });
    report += `\n`;
  }
  
  const reactErrors = testResults.failed.filter(r => r.errors.some(e => e.includes('React') || e.includes('Application error')));
  if (reactErrors.length > 0) {
    report += `### React/Next.js Errors (${reactErrors.length})\n`;
    report += `The following pages have React or Next.js errors:\n`;
    reactErrors.forEach(page => {
      report += `- ${page.path}\n`;
    });
    report += `\n`;
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report generated: ${reportPath}`);
  
  return reportPath;
}

async function runAdminPanelTests() {
  console.log('🚀 Starting Admin Panel Comprehensive Testing...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Set up error handlers
    page.on('pageerror', error => {
      console.log(`Page Error: ${error.message}`);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console Error: ${msg.text()}`);
      }
    });
    
    // Test login first
    const loginResult = await testWorkflow(page, adminWorkflows[0], false);
    
    let isLoggedIn = false;
    if (loginResult.status === 'PASSED') {
      isLoggedIn = await loginAsAdmin(page);
    }
    
    // Test remaining workflows
    for (let i = 1; i < adminWorkflows.length; i++) {
      const workflow = adminWorkflows[i];
      
      if (workflow.requiresAuth && !isLoggedIn) {
        console.log(`⚠️  Skipping ${workflow.name} - not logged in`);
        continue;
      }
      
      await testWorkflow(page, workflow, isLoggedIn);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate report
    const reportPath = await generateReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ADMIN PANEL TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${testResults.passed.length}`);
    console.log(`❌ Failed: ${testResults.failed.length}`);
    console.log(`🚨 Errors: ${testResults.errors.length}`);
    console.log(`📄 Report: ${reportPath}`);
    console.log(`📸 Screenshots: ${resultsDir}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Fatal error during testing:', error);
  } finally {
    await browser.close();
  }
}

// Run the tests
runAdminPanelTests().catch(console.error);