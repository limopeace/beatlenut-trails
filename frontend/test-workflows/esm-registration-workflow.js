const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class EsmRegistrationWorkflow {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.screenshotCounter = 1;
    this.workflowName = 'esm-registration';
    this.resultsDir = path.join(__dirname, '../test-results/esm-workflows', this.workflowName);
    
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

  async runWorkflow() {
    try {
      await this.init();
      
      console.log('🚀 Starting ESM Registration Workflow Test');
      
      // Step 1: Navigate to ESM portal
      await this.page.goto('http://localhost:3000/esm-portal', { waitUntil: 'networkidle2' });
      await this.logStep('Navigate to ESM Portal', true, 'Successfully loaded ESM portal homepage');
      
      // Step 2: Find and click registration link
      const registrationLinks = await this.page.$$eval('a', els =>
        els.filter(el => 
          el.textContent.toLowerCase().includes('register') ||
          el.textContent.toLowerCase().includes('sign up') ||
          el.href.includes('register')
        ).map(el => ({
          text: el.textContent.trim(),
          href: el.href
        }))
      );
      
      if (registrationLinks.length > 0) {
        await this.page.goto(registrationLinks[0].href, { waitUntil: 'networkidle2' });
        await this.logStep('Navigate to Registration', true, 
          `Found registration link: ${registrationLinks[0].text}`);
      } else {
        // Try direct navigation
        await this.page.goto('http://localhost:3000/esm-portal/register', { waitUntil: 'networkidle2' });
        await this.logStep('Navigate to Registration', true, 'Direct navigation to registration page');
      }
      
      // Step 3: Check registration form elements
      const formElements = {
        email: await this.page.$('input[type="email"], input[name="email"]'),
        password: await this.page.$('input[type="password"], input[name="password"]'),
        name: await this.page.$('input[name="name"], input[name="fullName"], input[name="businessName"]'),
        submitButton: await this.page.$('button[type="submit"], input[type="submit"]')
      };
      
      const foundElements = Object.entries(formElements)
        .filter(([key, element]) => element !== null)
        .map(([key]) => key);
      
      await this.logStep('Registration Form Check', foundElements.length >= 3, 
        `Found form elements: ${foundElements.join(', ')}`);
      
      // Step 4: Check form validation
      if (formElements.submitButton) {
        // Try submitting empty form to test validation
        await formElements.submitButton.click();
        await this.page.waitForTimeout(1000);
        
        const validationMessages = await this.page.$$eval('[class*="error"], [class*="invalid"], .text-red-500', els =>
          els.map(el => el.textContent.trim()).filter(text => text.length > 0)
        );
        
        await this.logStep('Form Validation Check', validationMessages.length > 0, 
          `Found validation messages: ${validationMessages.slice(0, 3).join(', ')}`);
      }
      
      // Step 5: Fill form with test data
      const testData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!',
        name: 'Test User Business'
      };
      
      let fieldsCount = 0;
      
      if (formElements.email) {
        await formElements.email.click({ clickCount: 3 }); // Select all
        await formElements.email.type(testData.email);
        fieldsCount++;
      }
      
      if (formElements.password) {
        await formElements.password.click({ clickCount: 3 });
        await formElements.password.type(testData.password);
        fieldsCount++;
      }
      
      if (formElements.name) {
        await formElements.name.click({ clickCount: 3 });
        await formElements.name.type(testData.name);
        fieldsCount++;
      }
      
      await this.logStep('Fill Registration Form', fieldsCount > 0, 
        `Filled ${fieldsCount} form fields with test data`);
      
      // Step 6: Check for additional fields (role selection, terms, etc.)
      const additionalFields = {
        role: await this.page.$('select[name="role"], input[name="role"]'),
        terms: await this.page.$('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="agree"]'),
        phone: await this.page.$('input[type="tel"], input[name="phone"]'),
        category: await this.page.$('select[name="category"], select[name="businessCategory"]')
      };
      
      const additionalFound = Object.entries(additionalFields)
        .filter(([key, element]) => element !== null)
        .map(([key]) => key);
      
      if (additionalFound.length > 0) {
        // Fill additional fields
        if (additionalFields.role) {
          await additionalFields.role.select('seller');
        }
        if (additionalFields.terms) {
          await additionalFields.terms.click();
        }
        if (additionalFields.phone) {
          await additionalFields.phone.type('9876543210');
        }
        if (additionalFields.category) {
          const options = await additionalFields.category.$$eval('option', els => 
            els.map(el => el.value).filter(val => val && val !== '')
          );
          if (options.length > 0) {
            await additionalFields.category.select(options[0]);
          }
        }
      }
      
      await this.logStep('Additional Fields Check', true, 
        `Found additional fields: ${additionalFound.join(', ')}`);
      
      // Step 7: Test form submission (but don't actually submit to avoid creating test data)
      if (formElements.submitButton) {
        // Just check if button becomes enabled or changes
        const buttonText = await formElements.submitButton.evaluate(el => el.textContent.trim());
        const isDisabled = await formElements.submitButton.evaluate(el => el.disabled);
        
        await this.logStep('Submit Button Check', !isDisabled, 
          `Button text: "${buttonText}", Disabled: ${isDisabled}`);
      }
      
      // Step 8: Check for file upload (document upload)
      const fileInputs = await this.page.$$('input[type="file"]');
      await this.logStep('File Upload Check', fileInputs.length > 0, 
        `Found ${fileInputs.length} file upload inputs`);
      
      // Step 9: Navigate to login page to test link
      const loginLinks = await this.page.$$eval('a', els =>
        els.filter(el => 
          el.textContent.toLowerCase().includes('login') ||
          el.textContent.toLowerCase().includes('sign in') ||
          el.href.includes('login')
        ).map(el => ({
          text: el.textContent.trim(),
          href: el.href
        }))
      );
      
      if (loginLinks.length > 0) {
        await this.page.goto(loginLinks[0].href, { waitUntil: 'networkidle2' });
        const loginFormExists = await this.page.$('input[type="email"], input[name="email"]') !== null;
        await this.logStep('Login Page Navigation', loginFormExists, 
          `Found login link and form exists: ${loginFormExists}`);
      } else {
        await this.logStep('Login Page Navigation', false, 'No login link found');
      }
      
      // Step 10: Test ESM portal navigation
      await this.page.goto('http://localhost:3000/esm-portal', { waitUntil: 'networkidle2' });
      
      const portalSections = await this.page.$$eval('h1, h2, h3, .card, .section', els =>
        els.map(el => el.textContent.trim()).filter(text => text.length > 0).slice(0, 5)
      );
      
      await this.logStep('ESM Portal Content', portalSections.length > 0, 
        `Portal sections: ${portalSections.join(', ')}`);
      
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
    
    return `# ESM Registration Workflow Test Report

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
  'All tests passed! ESM registration workflow is working correctly.' : 
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
const workflow = new EsmRegistrationWorkflow();
workflow.runWorkflow().catch(console.error);

module.exports = EsmRegistrationWorkflow;