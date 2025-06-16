const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AdminDashboardWorkflow {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.screenshotCounter = 1;
    this.workflowName = 'admin-dashboard';
    this.resultsDir = path.join(__dirname, '../test-results/admin-workflows', this.workflowName);
    
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
  }

  async takeScreenshot(step) {
    const filename = `${this.screenshotCounter.toString().padStart(2, '0')}-${step}.png`;
    const filepath = path.join(this.resultsDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });
    this.screenshotCounter++;
    return filename;
  }

  async logStep(step, success, details = '') {
    const screenshot = await this.takeScreenshot(step.replace(/\s+/g, '-').toLowerCase());
    this.testResults.push({
      step,
      success,
      details,
      screenshot,
      timestamp: new Date().toISOString()
    });
    console.log(`${success ? '✅' : '❌'} ${step}: ${details}`);
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Browser Error:', msg.text());
      }
    });
  }

  async performLogin() {
    // Navigate to admin login
    await this.page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
    
    // Fill login form
    const emailInput = await this.page.$('input[type="email"], input[name="email"]');
    const passwordInput = await this.page.$('input[type="password"], input[name="password"]');
    
    if (emailInput && passwordInput) {
      await emailInput.type('admin@beatlenut.com');
      await passwordInput.type('admin123');
      
      const loginButton = await this.page.$('button[type="submit"], button:contains("Login")');
      if (loginButton) {
        await loginButton.click();
        await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        return true;
      }
    }
    return false;
  }

  async runWorkflow() {
    try {
      await this.init();
      
      console.log('🚀 Starting Admin Dashboard Workflow Test');
      
      // Step 1: Perform login first
      const loginSuccess = await this.performLogin();
      await this.logStep('Admin Login', loginSuccess, loginSuccess ? 'Successfully logged in' : 'Login failed');
      
      if (!loginSuccess) {
        throw new Error('Cannot proceed without successful login');
      }
      
      // Step 2: Navigate to dashboard
      await this.page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
      await this.logStep('Navigate to Dashboard', true, 'Loaded dashboard page');
      
      // Step 3: Check page title and heading
      const title = await this.page.title();
      const headings = await this.page.$$eval('h1, h2, h3', els => 
        els.map(el => el.textContent.trim()).filter(text => text.length > 0)
      );
      
      const hasDashboardHeading = headings.some(h => h.toLowerCase().includes('dashboard'));
      await this.logStep('Dashboard Page Title', title.length > 0, `Page title: ${title}`);
      await this.logStep('Dashboard Heading', hasDashboardHeading, `Found headings: ${headings.join(', ')}`);
      
      // Step 4: Check for statistics/KPI cards
      const statCards = await this.page.$$('[class*="stat"], [class*="card"], [class*="metric"], [class*="kpi"]');
      const cardTexts = await this.page.$$eval('[class*="stat"], [class*="card"], [class*="metric"], [class*="kpi"]', els =>
        els.map(el => el.textContent.trim()).filter(text => text.length > 0).slice(0, 5)
      );
      
      await this.logStep('Statistics Cards', statCards.length > 0, 
        `Found ${statCards.length} stat cards: ${cardTexts.join(', ')}`);
      
      // Step 5: Check for charts or visualizations
      const charts = await this.page.$$('canvas, svg[class*="chart"], [class*="chart"]');
      await this.logStep('Charts and Visualizations', charts.length > 0, 
        `Found ${charts.length} chart elements`);
      
      // Step 6: Check for recent activity or data tables
      const tables = await this.page.$$('table, [class*="table"]');
      const tableHeaders = await this.page.$$eval('table th, [class*="table"] [class*="header"]', els =>
        els.map(el => el.textContent.trim()).filter(text => text.length > 0).slice(0, 5)
      );
      
      await this.logStep('Data Tables', tables.length > 0, 
        `Found ${tables.length} tables with headers: ${tableHeaders.join(', ')}`);
      
      // Step 7: Check navigation menu
      const navLinks = await this.page.$$eval('nav a, [class*="nav"] a, [class*="sidebar"] a', els =>
        els.map(el => ({
          text: el.textContent.trim(),
          href: el.href
        })).filter(link => link.text.length > 0).slice(0, 8)
      );
      
      await this.logStep('Navigation Menu', navLinks.length > 0, 
        `Found ${navLinks.length} nav links: ${navLinks.map(l => l.text).join(', ')}`);
      
      // Step 8: Test navigation to sellers page
      const sellersLink = navLinks.find(link => 
        link.text.toLowerCase().includes('seller') || link.href.includes('sellers')
      );
      
      if (sellersLink) {
        await this.page.goto(sellersLink.href, { waitUntil: 'networkidle2' });
        const sellersHeadings = await this.page.$$eval('h1, h2, h3', els => 
          els.map(el => el.textContent.trim()).filter(text => text.length > 0)
        );
        
        await this.logStep('Sellers Page Navigation', true, 
          `Navigated to sellers page, found headings: ${sellersHeadings.join(', ')}`);
      } else {
        await this.logStep('Sellers Page Navigation', false, 'Sellers link not found in navigation');
      }
      
      // Step 9: Test navigation to orders page
      const ordersLink = navLinks.find(link => 
        link.text.toLowerCase().includes('order') || link.href.includes('orders')
      );
      
      if (ordersLink) {
        await this.page.goto(ordersLink.href, { waitUntil: 'networkidle2' });
        const ordersHeadings = await this.page.$$eval('h1, h2, h3', els => 
          els.map(el => el.textContent.trim()).filter(text => text.length > 0)
        );
        
        await this.logStep('Orders Page Navigation', true, 
          `Navigated to orders page, found headings: ${ordersHeadings.join(', ')}`);
      } else {
        await this.logStep('Orders Page Navigation', false, 'Orders link not found in navigation');
      }
      
      // Step 10: Return to dashboard
      await this.page.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
      await this.logStep('Return to Dashboard', true, 'Successfully returned to dashboard');
      
    } catch (error) {
      await this.logStep('Workflow Error', false, error.message);
    } finally {
      await this.generateReport();
      await this.cleanup();
    }
  }

  async generateReport() {
    const report = {
      workflowName: this.workflowName,
      testDate: new Date().toISOString(),
      totalSteps: this.testResults.length,
      passedSteps: this.testResults.filter(r => r.success).length,
      failedSteps: this.testResults.filter(r => !r.success).length,
      results: this.testResults
    };
    
    const reportPath = path.join(this.resultsDir, 'report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    const mdReport = this.generateMarkdownReport(report);
    const mdPath = path.join(this.resultsDir, 'report.md');
    fs.writeFileSync(mdPath, mdReport);
    
    console.log(`📊 Test Report: ${report.passedSteps}/${report.totalSteps} steps passed`);
    console.log(`📁 Results saved to: ${this.resultsDir}`);
  }

  generateMarkdownReport(report) {
    const success = report.passedSteps === report.totalSteps;
    
    return `# Admin Dashboard Workflow Test Report

**Date:** ${new Date(report.testDate).toLocaleString()}
**Status:** ${success ? '✅ PASSED' : '❌ FAILED'}
**Score:** ${report.passedSteps}/${report.totalSteps} steps passed

## Test Results

${report.results.map((result, index) => `
### Step ${index + 1}: ${result.step}
- **Status:** ${result.success ? '✅ PASSED' : '❌ FAILED'}
- **Details:** ${result.details}
- **Screenshot:** ![${result.step}](${result.screenshot})
- **Timestamp:** ${new Date(result.timestamp).toLocaleString()}
`).join('\n')}

## Summary
${success ? 
  'All tests passed! Admin dashboard workflow is working correctly.' : 
  `${report.failedSteps} test(s) failed. Please review the screenshots and details above.`
}
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run the workflow
const workflow = new AdminDashboardWorkflow();
workflow.runWorkflow().catch(console.error);

module.exports = AdminDashboardWorkflow;