const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AdminLoginWorkflow {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.screenshotCounter = 1;
    this.workflowName = 'admin-login';
    this.resultsDir = path.join(__dirname, '../test-results/admin-workflows', this.workflowName);
    
    // Create results directory
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
    
    // Set up console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Browser Error:', msg.text());
      }
    });
  }

  async runWorkflow() {
    try {
      await this.init();
      
      console.log('🚀 Starting Admin Login Workflow Test');
      
      // Step 1: Navigate to admin portal
      await this.page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
      await this.logStep('Navigate to Admin Portal', true, 'Successfully loaded /admin');
      
      // Step 2: Check if redirected to login or has login form
      const currentUrl = this.page.url();
      const hasLoginForm = await this.page.$('input[type="email"], input[name="email"]') !== null;
      
      if (currentUrl.includes('/login') || hasLoginForm) {
        await this.logStep('Login Page Detection', true, `Found login page/form at ${currentUrl}`);
        
        // Step 3: Fill login form
        const emailInput = await this.page.$('input[type="email"], input[name="email"]');
        const passwordInput = await this.page.$('input[type="password"], input[name="password"]');
        
        if (emailInput && passwordInput) {
          await emailInput.type('admin@beatlenut.com');
          await passwordInput.type('admin123');
          await this.logStep('Fill Login Form', true, 'Entered admin credentials');
          
          // Step 4: Submit form
          const loginButton = await this.page.$('button[type="submit"], button:contains("Login"), button:contains("Sign In")');
          if (loginButton) {
            await loginButton.click();
            await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
            await this.logStep('Submit Login Form', true, 'Clicked login button and waited for navigation');
            
            // Step 5: Verify successful login
            const finalUrl = this.page.url();
            const isDashboard = finalUrl.includes('/dashboard');
            const hasAdminContent = await this.page.$('h1, h2, h3') !== null;
            
            if (isDashboard || finalUrl.includes('/admin')) {
              await this.logStep('Login Success Verification', true, `Redirected to ${finalUrl}`);
              
              // Step 6: Check for admin dashboard elements
              const headings = await this.page.$$eval('h1, h2, h3, h4', els => 
                els.map(el => el.textContent.trim()).filter(text => text.length > 0)
              );
              
              if (headings.length > 0) {
                await this.logStep('Dashboard Content Check', true, `Found headings: ${headings.slice(0, 3).join(', ')}`);
              } else {
                await this.logStep('Dashboard Content Check', false, 'No headings found on admin page');
              }
              
              // Step 7: Check navigation menu
              const navLinks = await this.page.$$eval('nav a, [role="navigation"] a, .nav a', els =>
                els.map(el => el.textContent.trim()).filter(text => text.length > 0)
              );
              
              if (navLinks.length > 0) {
                await this.logStep('Navigation Menu Check', true, `Found nav links: ${navLinks.slice(0, 5).join(', ')}`);
              } else {
                await this.logStep('Navigation Menu Check', false, 'No navigation links found');
              }
              
            } else {
              await this.logStep('Login Success Verification', false, `Still at ${finalUrl}, expected dashboard`);
            }
          } else {
            await this.logStep('Submit Login Form', false, 'Login button not found');
          }
        } else {
          await this.logStep('Fill Login Form', false, 'Email or password input not found');
        }
      } else {
        await this.logStep('Login Page Detection', false, `No login form found at ${currentUrl}`);
      }
      
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
    
    // Create markdown report
    const mdReport = this.generateMarkdownReport(report);
    const mdPath = path.join(this.resultsDir, 'report.md');
    fs.writeFileSync(mdPath, mdReport);
    
    console.log(`📊 Test Report: ${report.passedSteps}/${report.totalSteps} steps passed`);
    console.log(`📁 Results saved to: ${this.resultsDir}`);
  }

  generateMarkdownReport(report) {
    const success = report.passedSteps === report.totalSteps;
    
    return `# Admin Login Workflow Test Report

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
  'All tests passed! Admin login workflow is working correctly.' : 
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
const workflow = new AdminLoginWorkflow();
workflow.runWorkflow().catch(console.error);

module.exports = AdminLoginWorkflow;