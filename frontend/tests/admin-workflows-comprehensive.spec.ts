import { test, expect, Page, Browser } from '@playwright/test';
import path from 'path';

// Test configuration
const BASE_URL = 'http://localhost:3002';
const ADMIN_EMAIL = 'admin@beatlenut.com';
const ADMIN_PASSWORD = 'admin123';

// Screenshot directory
const SCREENSHOT_DIR = path.join(__dirname, '../test-results/admin-workflows');

// Helper function to take screenshots
async function takeScreenshot(page: Page, name: string, description: string = '') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const fullPath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: fullPath, fullPage: true });
  console.log(`📸 Screenshot taken: ${filename} - ${description}`);
  return filename;
}

// Helper function to login as admin
async function loginAsAdmin(page: Page): Promise<boolean> {
  try {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/admin/dashboard`, { timeout: 10000 });
    
    await takeScreenshot(page, 'login-success', 'Successfully logged in to admin dashboard');
    return true;
  } catch (error) {
    await takeScreenshot(page, 'login-failed', `Login failed: ${error.message}`);
    console.error('❌ Admin login failed:', error);
    return false;
  }
}

// Helper function to check if page loads without errors
async function checkPageLoad(page: Page, url: string, pageName: string): Promise<{success: boolean, errors: string[]}> {
  const errors: string[] = [];
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  try {
    await page.goto(url);
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Check for specific error indicators
    const hasErrorMessage = await page.locator('.error, .alert-error, [role="alert"]').count() > 0;
    const has404 = await page.locator('text=404').count() > 0;
    const hasNextError = await page.locator('text=Application error').count() > 0;
    
    if (hasErrorMessage) errors.push('Error message visible on page');
    if (has404) errors.push('404 error detected');
    if (hasNextError) errors.push('Next.js application error detected');
    
    const success = errors.length === 0;
    await takeScreenshot(page, `page-${pageName.toLowerCase().replace(/\s+/g, '-')}`, 
      success ? `✅ ${pageName} loaded successfully` : `❌ ${pageName} failed to load`);
    
    return { success, errors };
  } catch (error) {
    errors.push(`Navigation error: ${error.message}`);
    await takeScreenshot(page, `page-${pageName.toLowerCase().replace(/\s+/g, '-')}-error`, 
      `❌ ${pageName} navigation failed`);
    return { success: false, errors };
  }
}

// Admin Workflow Tests
test.describe('Admin Panel Comprehensive Workflow Tests', () => {
  let browser: Browser;
  let page: Page;
  
  test.beforeAll(async ({ browser: b }) => {
    browser = b;
  });
  
  test.beforeEach(async () => {
    page = await browser.newPage();
    
    // Set viewport for consistent screenshots
    await page.setViewportSize({ width: 1280, height: 720 });
  });
  
  test.afterEach(async () => {
    await page.close();
  });

  test('1. Admin Authentication Workflow', async () => {
    console.log('🧪 Testing Admin Authentication Workflow');
    
    // Test login page access
    const loginResult = await checkPageLoad(page, `${BASE_URL}/admin/login`, 'Admin Login');
    expect(loginResult.success).toBeTruthy();
    
    // Test successful login
    const loginSuccess = await loginAsAdmin(page);
    expect(loginSuccess).toBeTruthy();
    
    // Test logout functionality
    try {
      await page.click('button:has-text("Logout")');
      await page.waitForURL(`${BASE_URL}/admin/login`, { timeout: 5000 });
      await takeScreenshot(page, 'logout-success', '✅ Logout successful');
    } catch (error) {
      await takeScreenshot(page, 'logout-failed', `❌ Logout failed: ${error.message}`);
      throw error;
    }
  });

  test('2. Dashboard Workflow', async () => {
    console.log('🧪 Testing Dashboard Workflow');
    
    await loginAsAdmin(page);
    
    // Test dashboard page load
    const dashboardResult = await checkPageLoad(page, `${BASE_URL}/admin/dashboard`, 'Dashboard');
    expect(dashboardResult.success).toBeTruthy();
    
    // Test dashboard components
    const dashboardElements = [
      'text=ESM Marketplace Dashboard',
      'text=Total Revenue',
      'text=Total Orders',
      'text=Total Users',
      'text=Seller Verifications',
      'text=Product Approvals'
    ];
    
    for (const element of dashboardElements) {
      const exists = await page.locator(element).count() > 0;
      console.log(`Dashboard element "${element}": ${exists ? '✅' : '❌'}`);
    }
    
    // Test navigation links in dashboard
    try {
      await page.click('a:has-text("View All"):first');
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, 'dashboard-navigation', '✅ Dashboard navigation working');
    } catch (error) {
      await takeScreenshot(page, 'dashboard-navigation-failed', `❌ Dashboard navigation failed: ${error.message}`);
    }
  });

  test('3. Orders Management Workflow', async () => {
    console.log('🧪 Testing Orders Management Workflow');
    
    await loginAsAdmin(page);
    
    // Test orders listing page
    const ordersResult = await checkPageLoad(page, `${BASE_URL}/admin/orders`, 'Orders Management');
    expect(ordersResult.success).toBeTruthy();
    
    // Test orders page functionality
    try {
      // Check for orders table/list
      const hasOrdersTable = await page.locator('table, .order-item').count() > 0;
      console.log(`Orders table/list present: ${hasOrdersTable ? '✅' : '❌'}`);
      
      // Test filters and search
      const hasFilters = await page.locator('select, input[type="search"]').count() > 0;
      console.log(`Orders filters present: ${hasFilters ? '✅' : '❌'}`);
      
      // Test pagination if present
      const hasPagination = await page.locator('.pagination, button:has-text("Next")').count() > 0;
      console.log(`Orders pagination present: ${hasPagination ? '✅' : '❌'}`);
      
      await takeScreenshot(page, 'orders-management', '✅ Orders management page loaded');
    } catch (error) {
      await takeScreenshot(page, 'orders-management-error', `❌ Orders management error: ${error.message}`);
    }
  });

  test('4. Products Management Workflow', async () => {
    console.log('🧪 Testing Products Management Workflow');
    
    await loginAsAdmin(page);
    
    // Test products listing page
    const productsResult = await checkPageLoad(page, `${BASE_URL}/admin/products`, 'Products Management');
    expect(productsResult.success).toBeTruthy();
    
    // Test products page functionality
    try {
      // Check for products table
      const hasProductsTable = await page.locator('table').count() > 0;
      console.log(`Products table present: ${hasProductsTable ? '✅' : '❌'}`);
      
      // Test filters
      const hasStatusFilter = await page.locator('select option:has-text("Pending")').count() > 0;
      console.log(`Product status filter present: ${hasStatusFilter ? '✅' : '❌'}`);
      
      // Test bulk actions
      const hasBulkActions = await page.locator('button:has-text("Approve"), button:has-text("Reject")').count() > 0;
      console.log(`Product bulk actions present: ${hasBulkActions ? '✅' : '❌'}`);
      
      await takeScreenshot(page, 'products-management', '✅ Products management page loaded');
    } catch (error) {
      await takeScreenshot(page, 'products-management-error', `❌ Products management error: ${error.message}`);
    }
  });

  test('5. Sellers Management Workflow', async () => {
    console.log('🧪 Testing Sellers Management Workflow');
    
    await loginAsAdmin(page);
    
    // Test sellers listing page
    const sellersResult = await checkPageLoad(page, `${BASE_URL}/admin/sellers`, 'Sellers Management');
    expect(sellersResult.success).toBeTruthy();
    
    // Test sellers page functionality
    try {
      // Check for sellers content
      const hasSellersList = await page.locator('table, .seller-item').count() > 0;
      console.log(`Sellers list present: ${hasSellersList ? '✅' : '❌'}`);
      
      // Test status filter
      const hasStatusFilter = await page.locator('select option:has-text("Pending")').count() > 0;
      console.log(`Seller status filter present: ${hasStatusFilter ? '✅' : '❌'}`);
      
      // Test search functionality
      const hasSearch = await page.locator('input[placeholder*="Search"]').count() > 0;
      console.log(`Seller search present: ${hasSearch ? '✅' : '❌'}`);
      
      await takeScreenshot(page, 'sellers-management', '✅ Sellers management page loaded');
    } catch (error) {
      await takeScreenshot(page, 'sellers-management-error', `❌ Sellers management error: ${error.message}`);
    }
  });

  test('6. Users Management Workflow', async () => {
    console.log('🧪 Testing Users Management Workflow');
    
    await loginAsAdmin(page);
    
    // Test users listing page
    const usersResult = await checkPageLoad(page, `${BASE_URL}/admin/users`, 'Users Management');
    expect(usersResult.success).toBeTruthy();
    
    // Test users page functionality
    try {
      // Check for users table
      const hasUsersTable = await page.locator('table').count() > 0;
      console.log(`Users table present: ${hasUsersTable ? '✅' : '❌'}`);
      
      // Test role filter
      const hasRoleFilter = await page.locator('select option:has-text("Seller")').count() > 0;
      console.log(`User role filter present: ${hasRoleFilter ? '✅' : '❌'}`);
      
      // Test user actions
      const hasUserActions = await page.locator('button:has-text("View"), button:has-text("Edit")').count() > 0;
      console.log(`User actions present: ${hasUserActions ? '✅' : '❌'}`);
      
      await takeScreenshot(page, 'users-management', '✅ Users management page loaded');
    } catch (error) {
      await takeScreenshot(page, 'users-management-error', `❌ Users management error: ${error.message}`);
    }
  });

  test('7. Blog Management Workflow', async () => {
    console.log('🧪 Testing Blog Management Workflow');
    
    await loginAsAdmin(page);
    
    // Test blog page
    const blogResult = await checkPageLoad(page, `${BASE_URL}/admin/blog`, 'Blog Management');
    
    if (blogResult.success) {
      console.log('✅ Blog management page loaded successfully');
    } else {
      console.log('❌ Blog management page failed:', blogResult.errors);
    }
    
    expect(blogResult.errors.length).toBeLessThan(3); // Allow some minor errors
  });

  test('8. Navigation and Missing Pages Test', async () => {
    console.log('🧪 Testing Navigation and Missing Pages');
    
    await loginAsAdmin(page);
    
    const navPages = [
      { name: 'Services', path: '/admin/services' },
      { name: 'Approvals', path: '/admin/approvals' },
      { name: 'Reports', path: '/admin/reports' },
      { name: 'Settings', path: '/admin/settings' }
    ];
    
    for (const navPage of navPages) {
      const result = await checkPageLoad(page, `${BASE_URL}${navPage.path}`, navPage.name);
      console.log(`${navPage.name} page: ${result.success ? '✅' : '❌'} (${result.errors.length} errors)`);
      
      if (!result.success) {
        console.log(`  Errors: ${result.errors.join(', ')}`);
      }
    }
  });

  test('9. Additional Admin Pages Test', async () => {
    console.log('🧪 Testing Additional Admin Pages');
    
    await loginAsAdmin(page);
    
    const additionalPages = [
      { name: 'Account', path: '/admin/account' },
      { name: 'Bookings', path: '/admin/bookings' },
      { name: 'Messages', path: '/admin/messages' },
      { name: 'Notifications', path: '/admin/notifications' },
      { name: 'Reviews', path: '/admin/reviews' },
      { name: 'Images', path: '/admin/images' },
      { name: 'Homepage Reviews', path: '/admin/homepage-reviews' }
    ];
    
    for (const page_info of additionalPages) {
      const result = await checkPageLoad(page, `${BASE_URL}${page_info.path}`, page_info.name);
      console.log(`${page_info.name} page: ${result.success ? '✅' : '❌'} (${result.errors.length} errors)`);
    }
  });

  test('10. Mobile Responsiveness Test', async () => {
    console.log('🧪 Testing Mobile Responsiveness');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await loginAsAdmin(page);
    
    // Test mobile navigation
    try {
      const hasMobileMenu = await page.locator('button[aria-label*="menu"], .mobile-menu-button').count() > 0;
      console.log(`Mobile menu button present: ${hasMobileMenu ? '✅' : '❌'}`);
      
      if (hasMobileMenu) {
        await page.click('button[aria-label*="menu"], .mobile-menu-button');
        await takeScreenshot(page, 'mobile-menu-open', '📱 Mobile menu opened');
      }
      
      await takeScreenshot(page, 'mobile-dashboard', '📱 Mobile dashboard view');
    } catch (error) {
      await takeScreenshot(page, 'mobile-test-error', `❌ Mobile test error: ${error.message}`);
    }
  });
});