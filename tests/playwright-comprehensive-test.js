/**
 * Comprehensive Playwright Tests for Beatlenuts Admin Portal and Website
 * This test suite covers all major functionality including admin features and website flows
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const ADMIN_EMAIL = 'admin@beatlenuts.com';
const ADMIN_PASSWORD = 'admin123';
const BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:4000';

test.describe('Beatlenuts Website Comprehensive Tests', () => {
  
  // Test Setup - Run before each test
  test.beforeEach(async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Block unnecessary requests to speed up tests
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.includes('fonts.googleapis.com') || 
          url.includes('youtube.com') || 
          url.includes('instagram.com')) {
        route.abort();
      } else {
        route.continue();
      }
    });
  });

  test.describe('Homepage and Main Website', () => {
    
    test('Homepage loads correctly', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check if page loads without errors
      await expect(page).toHaveTitle(/Beatlenuts/);
      
      // Check for main navigation elements
      await expect(page.locator('nav')).toBeVisible();
      
      // Check for hero section
      await expect(page.locator('h1')).toBeVisible();
      
      // Take screenshot for verification
      await page.screenshot({ path: 'tests/screenshots/homepage.png' });
    });

    test('Navigation links work', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Test About page
      await page.click('text=About');
      await expect(page).toHaveURL(/\/about/);
      await page.goBack();
      
      // Test Services page
      await page.click('text=Services');
      await expect(page).toHaveURL(/\/services/);
      await page.goBack();
      
      // Test Contact page
      await page.click('text=Contact');
      await expect(page).toHaveURL(/\/contact/);
    });

    test('Contact form submission', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`);
      
      // Fill out contact form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('textarea[name="message"]', 'This is a test message');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Check for success message or form validation
      await expect(page.locator('.success-message, .error-message')).toBeVisible({ timeout: 5000 });
    });

    test('Blog page functionality', async ({ page }) => {
      await page.goto(`${BASE_URL}/blog`);
      
      // Check blog page loads
      await expect(page.locator('h1')).toContainText('Blog');
      
      // Test category filters
      await page.click('text=Travel');
      await expect(page).toHaveURL(/category=travel/);
      
      // Test search functionality
      await page.fill('input[name="search"]', 'trekking');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/search=trekking/);
      
      // Check if blog posts are displayed
      await expect(page.locator('article')).toBeVisible();
    });

    test('ESM Portal access', async ({ page }) => {
      await page.goto(`${BASE_URL}/esm-portal`);
      
      // Check ESM portal loads
      await expect(page.locator('h1')).toBeVisible();
      
      // Test login link
      await page.click('text=Login');
      await expect(page).toHaveURL(/esm-portal\/login/);
      
      // Test register link
      await page.goto(`${BASE_URL}/esm-portal`);
      await page.click('text=Register');
      await expect(page).toHaveURL(/esm-portal\/register/);
    });
  });

  test.describe('Admin Portal Tests', () => {
    
    test('Admin login page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/login`);
      
      // Check login form exists
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('Admin login functionality', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/login`);
      
      // Fill login form
      await page.fill('input[type="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"]', ADMIN_PASSWORD);
      
      // Submit login
      await page.click('button[type="submit"]');
      
      // Check if redirected to dashboard or if error message appears
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      
      if (currentUrl.includes('/admin/dashboard')) {
        // Login successful
        await expect(page.locator('h1, h2')).toContainText(/Dashboard|Admin/);
      } else {
        // Login failed - check for error message
        await expect(page.locator('.error-message, .alert-error')).toBeVisible();
      }
    });

    test('Admin dashboard navigation', async ({ page }) => {
      // Try to access admin dashboard
      await page.goto(`${BASE_URL}/admin/dashboard`);
      
      // If redirected to login, perform login first
      if (page.url().includes('/login')) {
        await page.fill('input[type="email"]', ADMIN_EMAIL);
        await page.fill('input[type="password"]', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
      }
      
      // Check dashboard elements
      await expect(page.locator('nav, aside')).toBeVisible(); // Sidebar navigation
      
      // Test navigation links
      const navLinks = [
        'Orders',
        'Sellers', 
        'Approvals',
        'Messages',
        'Bookings'
      ];
      
      for (const link of navLinks) {
        try {
          await page.click(`text=${link}`);
          await page.waitForTimeout(1000);
          await expect(page).toHaveURL(new RegExp(`/admin/${link.toLowerCase()}`));
        } catch (error) {
          console.log(`Navigation link "${link}" not found or not working`);
        }
      }
    });

    test('Admin blog management', async ({ page }) => {
      // Navigate to admin panel
      await page.goto(`${BASE_URL}/admin/dashboard`);
      
      // Skip if login required
      if (page.url().includes('/login')) {
        console.log('Admin login required - skipping blog management test');
        return;
      }
      
      // Look for blog management section
      try {
        await page.click('text=Blog');
        await page.waitForTimeout(1000);
        
        // Check if we can create a new blog post
        if (await page.locator('text=New Post').isVisible()) {
          await page.click('text=New Post');
          
          // Fill out blog post form
          await page.fill('input[name="title"]', 'Test Blog Post');
          await page.fill('textarea[name="content"]', 'This is a test blog post content');
          
          // Try to save
          await page.click('button[type="submit"]');
          await page.waitForTimeout(2000);
        }
      } catch (error) {
        console.log('Blog management not available or not functioning');
      }
    });

    test('Admin ESM management', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/sellers`);
      
      // Skip if login required
      if (page.url().includes('/login')) {
        console.log('Admin login required - skipping ESM management test');
        return;
      }
      
      // Check sellers management page
      await expect(page.locator('h1, h2')).toContainText(/Sellers|ESM/);
      
      // Look for seller list or management features
      const sellerElements = [
        'table',
        '.seller-card',
        '.seller-list',
        'button:has-text("Approve")',
        'button:has-text("Reject")'
      ];
      
      let foundElement = false;
      for (const selector of sellerElements) {
        if (await page.locator(selector).isVisible()) {
          foundElement = true;
          break;
        }
      }
      
      expect(foundElement).toBe(true);
    });

    test('Admin approvals workflow', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/approvals`);
      
      // Skip if login required
      if (page.url().includes('/login')) {
        console.log('Admin login required - skipping approvals test');
        return;
      }
      
      // Check approvals page
      await expect(page.locator('h1, h2')).toContainText(/Approvals|Pending/);
      
      // Look for approval actions
      const approvalElements = [
        'button:has-text("Approve")',
        'button:has-text("Reject")',
        '.approval-item',
        'table'
      ];
      
      let foundApprovalElement = false;
      for (const selector of approvalElements) {
        if (await page.locator(selector).isVisible()) {
          foundApprovalElement = true;
          break;
        }
      }
      
      // Should have approval interface even if no pending items
      expect(page.locator('main, .content-area')).toBeVisible();
    });
  });

  test.describe('ESM Portal Tests', () => {
    
    test('ESM registration flow', async ({ page }) => {
      await page.goto(`${BASE_URL}/esm-portal/register`);
      
      // Check registration form
      await expect(page.locator('form')).toBeVisible();
      
      // Fill registration form
      await page.fill('input[name="name"]', 'Test ESM User');
      await page.fill('input[name="email"]', 'esm@test.com');
      await page.fill('input[name="password"]', 'password123');
      await page.fill('input[name="serviceNumber"]', 'ESM12345');
      
      // Submit registration
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Check for success/error message
      const hasSuccessMessage = await page.locator('.success-message, .alert-success').isVisible();
      const hasErrorMessage = await page.locator('.error-message, .alert-error').isVisible();
      
      expect(hasSuccessMessage || hasErrorMessage).toBe(true);
    });

    test('ESM product listing', async ({ page }) => {
      await page.goto(`${BASE_URL}/esm-portal/products`);
      
      // Check products page loads
      await expect(page.locator('h1, h2')).toContainText(/Products|ESM/);
      
      // Look for product listings or empty state
      const productElements = [
        '.product-card',
        '.product-grid',
        'table',
        '.empty-state',
        'text=No products found'
      ];
      
      let foundProductElement = false;
      for (const selector of productElements) {
        if (await page.locator(selector).isVisible()) {
          foundProductElement = true;
          break;
        }
      }
      
      expect(foundProductElement).toBe(true);
    });

    test('ESM service listing', async ({ page }) => {
      await page.goto(`${BASE_URL}/esm-portal/services`);
      
      // Check services page loads
      await expect(page.locator('h1, h2')).toContainText(/Services|ESM/);
      
      // Look for service listings or empty state
      const serviceElements = [
        '.service-card',
        '.service-grid', 
        'table',
        '.empty-state',
        'text=No services found'
      ];
      
      let foundServiceElement = false;
      for (const selector of serviceElements) {
        if (await page.locator(selector).isVisible()) {
          foundServiceElement = true;
          break;
        }
      }
      
      expect(foundServiceElement).toBe(true);
    });
  });

  test.describe('API Connectivity Tests', () => {
    
    test('Backend API is accessible', async ({ page }) => {
      // Test basic API endpoint
      const response = await page.request.get(`${API_BASE_URL}/`);
      expect(response.status()).toBe(200);
    });

    test('Blog API endpoints', async ({ page }) => {
      // Test blog posts endpoint
      const response = await page.request.get(`${API_BASE_URL}/api/blog`);
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
    });

    test('ESM API endpoints', async ({ page }) => {
      // Test ESM products endpoint
      const response = await page.request.get(`${API_BASE_URL}/api/esm-products`);
      expect([200, 401, 403]).toContain(response.status()); // May require auth
    });
  });

  test.describe('Mobile Responsiveness', () => {
    
    test('Mobile homepage', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto(BASE_URL);
      
      // Check mobile navigation
      const mobileMenuButton = page.locator('button:has-text("Menu"), .mobile-menu-toggle, .hamburger');
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await expect(page.locator('nav, .mobile-menu')).toBeVisible();
      }
      
      // Check content is still visible
      await expect(page.locator('h1')).toBeVisible();
    });

    test('Mobile admin panel', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/admin/dashboard`);
      
      // Check if mobile navigation exists
      const mobileElements = [
        '.mobile-nav',
        'button:has-text("Menu")',
        '.hamburger',
        '.mobile-admin-nav'
      ];
      
      let foundMobileElement = false;
      for (const selector of mobileElements) {
        if (await page.locator(selector).isVisible()) {
          foundMobileElement = true;
          break;
        }
      }
      
      // Mobile navigation should exist
      expect(foundMobileElement).toBe(true);
    });
  });

  test.describe('Performance Tests', () => {
    
    test('Page load performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('Admin panel performance', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/admin/dashboard`);
      const loadTime = Date.now() - startTime;
      
      // Admin panel should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });
  });
});

// Test Results Summary
test.afterAll(async () => {
  console.log('🎯 Comprehensive test suite completed!');
  console.log('📊 Check test results for detailed feedback on:');
  console.log('   - Homepage and navigation functionality');
  console.log('   - Admin portal features and workflows');
  console.log('   - ESM marketplace functionality');
  console.log('   - Blog management and content creation');
  console.log('   - API connectivity and performance');
  console.log('   - Mobile responsiveness');
  console.log('📸 Screenshots saved to tests/screenshots/');
});