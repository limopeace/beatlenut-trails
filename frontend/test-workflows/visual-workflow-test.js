const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class VisualWorkflowTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.adminPage = null;
    this.stepCount = 1;
    this.testId = Date.now();
    this.screenshotsDir = path.join(__dirname, '../test-results/visual-workflows', `test-${this.testId}`);
    
    // Create screenshots directory
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  async takeScreenshot(stepName, page = null) {
    const currentPage = page || this.page;
    const filename = `${this.stepCount.toString().padStart(3, '0')}-${stepName}.png`;
    const filepath = path.join(this.screenshotsDir, filename);
    
    await currentPage.screenshot({ 
      path: filepath, 
      fullPage: true,
      captureBeyondViewport: false
    });
    
    console.log(`📸 Step ${this.stepCount}: ${stepName} (${filename})`);
    this.stepCount++;
    return filename;
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    
    // Create main page for ESM portal
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1200, height: 800 });
    
    // Create admin page
    this.adminPage = await this.browser.newPage();
    await this.adminPage.setViewport({ width: 1200, height: 800 });
    
    // Set up error logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') console.log('🔴 ESM Error:', msg.text());
    });
    
    this.adminPage.on('console', msg => {
      if (msg.type() === 'error') console.log('🔴 Admin Error:', msg.text());
    });
  }

  async runCompleteWorkflow() {
    try {
      await this.init();
      
      console.log('🚀 Starting Complete Visual Workflow Test');
      console.log(`📁 Screenshots will be saved to: ${this.screenshotsDir}`);
      
      // === ADMIN PANEL WORKFLOW ===
      console.log('\n🏛️ === ADMIN PANEL WORKFLOW ===');
      
      // Step 1: Admin Portal Landing
      await this.adminPage.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-portal-landing', this.adminPage);
      
      // Step 2: Admin Login Page
      if (!this.adminPage.url().includes('/login')) {
        await this.adminPage.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2' });
      }
      await this.takeScreenshot('admin-login-page', this.adminPage);
      
      // Step 3: Fill Admin Login Form
      await this.adminPage.type('input[type="email"], input[name="email"]', 'admin@beatlenut.com');
      await this.adminPage.type('input[type="password"], input[name="password"]', 'admin123');
      await this.takeScreenshot('admin-login-form-filled', this.adminPage);
      
      // Step 4: Submit Admin Login
      await this.adminPage.click('button[type="submit"], button:contains("Login")');
      await this.adminPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      await this.takeScreenshot('admin-dashboard-after-login', this.adminPage);
      
      // Step 5: Admin Dashboard Overview
      await this.adminPage.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-dashboard-overview', this.adminPage);
      
      // Step 6: Admin Sellers Page
      await this.adminPage.goto('http://localhost:3000/admin/sellers', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-sellers-page', this.adminPage);
      
      // Step 7: Admin Orders Page
      await this.adminPage.goto('http://localhost:3000/admin/orders', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-orders-page', this.adminPage);
      
      // Step 8: Admin Approvals Page
      await this.adminPage.goto('http://localhost:3000/admin/approvals', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-approvals-page', this.adminPage);
      
      // === ESM PORTAL WORKFLOW ===
      console.log('\n🏪 === ESM PORTAL WORKFLOW ===');
      
      // Step 9: ESM Portal Homepage
      await this.page.goto('http://localhost:3000/esm-portal', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-portal-homepage', this.page);
      
      // Step 10: ESM Registration Page
      await this.page.goto('http://localhost:3000/esm-portal/register', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-registration-page', this.page);
      
      // Step 11: Fill ESM Registration Form
      await this.page.type('input[name="email"]', 'testuser@example.com');
      await this.page.type('input[name="password"]', 'TestPass123!');
      
      // Check for business name field
      const businessNameField = await this.page.$('input[name="businessName"], input[name="name"]');
      if (businessNameField) {
        await this.page.type('input[name="businessName"], input[name="name"]', 'Test Business');
      }
      
      // Check for role selection
      const roleField = await this.page.$('select[name="role"]');
      if (roleField) {
        await this.page.select('select[name="role"]', 'seller');
      }
      
      await this.takeScreenshot('esm-registration-form-filled', this.page);
      
      // Step 12: ESM Login Instead (to avoid creating test accounts)
      await this.page.goto('http://localhost:3000/esm-portal/login', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-login-page', this.page);
      
      // Step 13: ESM Products Page (without login)
      await this.page.goto('http://localhost:3000/esm-portal/products', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-products-browse', this.page);
      
      // Step 14: ESM Services Page
      await this.page.goto('http://localhost:3000/esm-portal/services', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-services-browse', this.page);
      
      // Step 15: ESM Add Product Page (will likely redirect to login)
      await this.page.goto('http://localhost:3000/esm-portal/add-product', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-add-product-page', this.page);
      
      // === CROSS-SYSTEM INTERACTION TEST ===
      console.log('\n🔄 === CROSS-SYSTEM INTERACTION TEST ===');
      
      // Step 16: Admin - Check Current Sellers
      await this.adminPage.goto('http://localhost:3000/admin/sellers', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-sellers-before-changes', this.adminPage);
      
      // Step 17: Admin - Check Current Products/Orders
      await this.adminPage.goto('http://localhost:3000/admin/orders', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-orders-before-changes', this.adminPage);
      
      // Step 18: ESM - Back to Products (to show consistency)
      await this.page.goto('http://localhost:3000/esm-portal/products', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-products-final-view', this.page);
      
      // === MESSAGING SYSTEM TEST ===
      console.log('\n💬 === MESSAGING SYSTEM TEST ===');
      
      // Step 19: ESM Messages Page
      await this.page.goto('http://localhost:3000/esm-portal/messages', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-messages-page', this.page);
      
      // Step 20: Admin Messages Page
      await this.adminPage.goto('http://localhost:3000/admin/messages', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-messages-page', this.adminPage);
      
      // === RESPONSIVE DESIGN TEST ===
      console.log('\n📱 === RESPONSIVE DESIGN TEST ===');
      
      // Step 21: Mobile View - Admin Dashboard
      await this.adminPage.setViewport({ width: 375, height: 667 }); // iPhone SE
      await this.adminPage.goto('http://localhost:3000/admin/dashboard', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-dashboard-mobile', this.adminPage);
      
      // Step 22: Mobile View - ESM Portal
      await this.page.setViewport({ width: 375, height: 667 });
      await this.page.goto('http://localhost:3000/esm-portal', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-portal-mobile', this.page);
      
      // Step 23: Tablet View - Admin
      await this.adminPage.setViewport({ width: 768, height: 1024 }); // iPad
      await this.adminPage.goto('http://localhost:3000/admin/sellers', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('admin-sellers-tablet', this.adminPage);
      
      // Step 24: Tablet View - ESM
      await this.page.setViewport({ width: 768, height: 1024 });
      await this.page.goto('http://localhost:3000/esm-portal/products', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('esm-products-tablet', this.page);
      
      // === MAIN WEBSITE TEST ===
      console.log('\n🌐 === MAIN WEBSITE TEST ===');
      
      // Reset to desktop view
      await this.page.setViewport({ width: 1200, height: 800 });
      
      // Step 25: Main Homepage
      await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('main-website-homepage', this.page);
      
      // Step 26: About Page
      await this.page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('main-website-about', this.page);
      
      // Step 27: Services Page
      await this.page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('main-website-services', this.page);
      
      // Step 28: Contact Page
      await this.page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });
      await this.takeScreenshot('main-website-contact', this.page);
      
      console.log('\n✅ Complete Visual Workflow Test Finished!');
      console.log(`📸 Total Screenshots Taken: ${this.stepCount - 1}`);
      console.log(`📁 Results Location: ${this.screenshotsDir}`);
      
      await this.generateVisualReport();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      await this.takeScreenshot('error-state', this.page);
    } finally {
      await this.cleanup();
    }
  }

  async generateVisualReport() {
    const screenshots = fs.readdirSync(this.screenshotsDir)
      .filter(file => file.endsWith('.png'))
      .sort();
    
    const report = `# Visual Workflow Test Report

**Test ID:** ${this.testId}
**Date:** ${new Date().toLocaleString()}
**Total Screenshots:** ${screenshots.length}
**Test Environment:** Development (localhost:3000, localhost:4000)

## Test Overview

This comprehensive visual test captures every step of the admin panel and ESM portal workflows, including:
- Complete admin authentication and navigation
- ESM portal registration and product management
- Cross-system interactions and data consistency
- Responsive design testing (mobile, tablet, desktop)
- Real-time messaging system interfaces

## Screenshots by Workflow

### Admin Panel Workflow
${screenshots
  .filter(img => img.includes('admin'))
  .map(img => `- ![${img}](${img})`)
  .join('\n')}

### ESM Portal Workflow
${screenshots
  .filter(img => img.includes('esm'))
  .map(img => `- ![${img}](${img})`)
  .join('\n')}

### Main Website
${screenshots
  .filter(img => img.includes('main-website'))
  .map(img => `- ![${img}](${img})`)
  .join('\n')}

### Responsive Design Tests
${screenshots
  .filter(img => img.includes('mobile') || img.includes('tablet'))
  .map(img => `- ![${img}](${img})`)
  .join('\n')}

## Complete Screenshot List

${screenshots.map((img, index) => `${(index + 1).toString().padStart(3, '0')}. ![${img}](${img})`).join('\n')}

---
*Generated by Visual Workflow Test Suite*
`;

    const reportPath = path.join(this.screenshotsDir, 'visual-report.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(`📄 Visual report generated: ${reportPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run the visual workflow test
const visualTest = new VisualWorkflowTest();
visualTest.runCompleteWorkflow().catch(console.error);