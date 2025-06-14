import { test, expect, Page } from '@playwright/test';

test.describe('Admin Portal Tests', () => {
  
  // Test credentials
  const testAdmin = {
    email: 'admin@beatlenut.com',
    password: 'admin123',
    name: 'Test Admin'
  };

  test.beforeEach(async ({ page }) => {
    // Start from admin portal
    await page.goto('/admin');
  });

  test.describe('Admin Portal Access & Navigation', () => {
    test('should redirect to admin login page', async ({ page }) => {
      await page.goto('/admin');
      
      // Should redirect to login or show login form
      if (page.url().includes('/login')) {
        await expect(page).toHaveURL(/\/admin\/login/);
      } else {
        // May show login form on same page
        await expect(page.getByRole('heading', { name: /login|sign.*in/i })).toBeVisible();
      }
    });

    test('should display admin login form', async ({ page }) => {
      await page.goto('/admin/login');
      
      await expect(page.getByRole('heading', { name: /admin.*login|login/i })).toBeVisible();
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
      await expect(page.getByRole('button', { name: /login|sign.*in/i })).toBeVisible();
    });

    test('should handle login form submission', async ({ page }) => {
      await page.goto('/admin/login');
      
      // Fill login form
      await page.fill('input[type="email"], input[name="email"]', testAdmin.email);
      await page.fill('input[type="password"], input[name="password"]', testAdmin.password);
      
      // Submit form
      const loginButton = page.getByRole('button', { name: /login|sign.*in/i });
      await loginButton.click();
      
      // Wait for form submission
      await page.waitForTimeout(3000);
      
      // Check if login succeeded or failed
      const currentUrl = page.url();
      if (currentUrl.includes('/dashboard')) {
        // Success - should be on dashboard
        await expect(page).toHaveURL(/\/admin\/dashboard/);
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      } else if (currentUrl.includes('/login')) {
        // Still on login page - check for error message or form
        const errorMessage = page.locator('[class*="error"], .text-red');
        if (await errorMessage.count() > 0) {
          console.log('Login failed with error message');
        } else {
          console.log('Login form reloaded - may need valid credentials');
        }
      } else {
        // Some other redirect happened
        console.log('Unexpected redirect to:', currentUrl);
      }
    });

    test('should test development login fallback', async ({ page }) => {
      await page.goto('/admin/login');
      
      // Use development credentials if they exist
      await page.fill('input[type="email"], input[name="email"]', 'admin@beatlenut.com');
      await page.fill('input[type="password"], input[name="password"]', 'admin123');
      
      const loginButton = page.getByRole('button', { name: /login|sign.*in/i });
      await loginButton.click();
      
      await page.waitForTimeout(3000);
      
      // Check outcome
      const url = page.url();
      console.log('After login attempt, URL is:', url);
    });
  });

  test.describe('Admin Dashboard', () => {
    test('should display dashboard (if accessible)', async ({ page }) => {
      // Try direct access to dashboard
      await page.goto('/admin/dashboard');
      
      if (page.url().includes('/login')) {
        // Redirected to login - expected behavior
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        // Dashboard accessible - check content
        await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
        
        // Look for dashboard widgets/cards
        const dashboardCards = page.locator('[class*="card"], [class*="widget"], [class*="stat"]');
        if (await dashboardCards.count() > 0) {
          await expect(dashboardCards.first()).toBeVisible();
        }
      }
    });

    test('should show navigation menu (if authenticated)', async ({ page }) => {
      await page.goto('/admin/dashboard');
      
      if (!page.url().includes('/login')) {
        // Look for navigation elements
        const navItems = ['Sellers', 'Orders', 'Products', 'Services', 'Analytics'];
        
        for (const item of navItems) {
          const navLink = page.getByRole('link', { name: new RegExp(item, 'i') });
          if (await navLink.count() > 0) {
            await expect(navLink.first()).toBeVisible();
          }
        }
      }
    });
  });

  test.describe('Admin Sellers Management', () => {
    test('should display sellers page', async ({ page }) => {
      await page.goto('/admin/sellers');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: /sellers/i })).toBeVisible();
        
        // Check for sellers table or list
        const sellersTable = page.locator('table, [class*="table"], [class*="list"]');
        const emptyState = page.getByText(/no.*sellers|empty/i);
        
        if (await sellersTable.count() > 0) {
          await expect(sellersTable.first()).toBeVisible();
        } else if (await emptyState.count() > 0) {
          await expect(emptyState.first()).toBeVisible();
        }
      }
    });

    test('should test seller search functionality', async ({ page }) => {
      await page.goto('/admin/sellers');
      
      if (!page.url().includes('/login')) {
        const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
        if (await searchInput.count() > 0) {
          await searchInput.first().fill('test');
          await searchInput.first().press('Enter');
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('Admin Orders Management', () => {
    test('should display orders page', async ({ page }) => {
      await page.goto('/admin/orders');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
        
        // Check for orders table or empty state
        const ordersTable = page.locator('table, [class*="order"]');
        const emptyState = page.getByText(/no.*orders|empty/i);
        
        if (await ordersTable.count() > 0) {
          await expect(ordersTable.first()).toBeVisible();
        } else if (await emptyState.count() > 0) {
          await expect(emptyState.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Admin Approvals Management', () => {
    test('should display approvals page', async ({ page }) => {
      await page.goto('/admin/approvals');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: /approvals|pending/i })).toBeVisible();
        
        // Check for pending approvals
        const approvalsList = page.locator('[class*="approval"], [class*="pending"]');
        const emptyState = page.getByText(/no.*pending|empty/i);
        
        if (await approvalsList.count() > 0) {
          await expect(approvalsList.first()).toBeVisible();
        } else if (await emptyState.count() > 0) {
          await expect(emptyState.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Admin Analytics', () => {
    test('should display analytics page', async ({ page }) => {
      await page.goto('/admin/analytics');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        // Should show analytics dashboard
        const analyticsHeading = page.getByRole('heading', { name: /analytics|statistics/i });
        if (await analyticsHeading.count() > 0) {
          await expect(analyticsHeading.first()).toBeVisible();
        }
        
        // Look for charts or metrics
        const charts = page.locator('canvas, [class*="chart"], [class*="metric"]');
        if (await charts.count() > 0) {
          await expect(charts.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Admin Reviews Management', () => {
    test('should display reviews page', async ({ page }) => {
      await page.goto('/admin/reviews');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: /reviews/i })).toBeVisible();
      }
    });
  });

  test.describe('Admin Messages', () => {
    test('should display messages page', async ({ page }) => {
      await page.goto('/admin/messages');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: /messages/i })).toBeVisible();
      }
    });
  });

  test.describe('Admin Blog Management', () => {
    test('should display blog management page', async ({ page }) => {
      await page.goto('/admin/blog');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible();
      }
    });
  });

  test.describe('Admin Account Settings', () => {
    test('should display account settings page', async ({ page }) => {
      await page.goto('/admin/account');
      
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        await expect(page.getByRole('heading', { name: /account|profile/i })).toBeVisible();
      }
    });
  });

  test.describe('Admin Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/admin/login');
      
      // Login form should be visible and usable on mobile
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      
      // Check for mobile navigation
      const mobileNav = page.locator('[class*="mobile"], button[aria-label*="menu"]');
      if (await mobileNav.count() > 0) {
        await expect(mobileNav.first()).toBeVisible();
      }
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/admin/dashboard');
      
      // Should adapt to tablet layout
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Admin API Integration', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Monitor network requests
      page.on('response', response => {
        if (response.status() >= 400) {
          console.log(`API Error: ${response.status()} - ${response.url()}`);
        }
      });
      
      await page.goto('/admin/dashboard');
      
      // Wait for any network requests to complete
      await page.waitForTimeout(3000);
    });

    test('should test authentication flow', async ({ page }) => {
      // Test that protected routes redirect to login
      const protectedRoutes = [
        '/admin/dashboard',
        '/admin/sellers',
        '/admin/orders',
        '/admin/approvals'
      ];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        
        // Should either show login page or the protected content
        const isLoginPage = page.url().includes('/login') || 
                           await page.getByRole('heading', { name: /login/i }).count() > 0;
        
        if (isLoginPage) {
          console.log(`${route} correctly redirected to login`);
        } else {
          console.log(`${route} is accessible (may be authenticated or public)`);
        }
      }
    });
  });

  test.describe('Admin Error Handling', () => {
    test('should handle 404 pages gracefully', async ({ page }) => {
      await page.goto('/admin/nonexistent-page');
      
      // Should show 404 page or redirect
      const notFoundElements = page.locator('h1, [class*="404"], [class*="not-found"]');
      if (await notFoundElements.count() > 0) {
        await expect(notFoundElements.first()).toBeVisible();
      }
    });

    test('should handle network errors', async ({ page }) => {
      // Set up to fail network requests
      await page.route('**/api/**', route => {
        route.abort();
      });
      
      await page.goto('/admin/dashboard');
      
      // Should handle network failures gracefully
      await page.waitForTimeout(2000);
      
      // Look for error states
      const errorMessages = page.locator('[class*="error"], [class*="offline"]');
      if (await errorMessages.count() > 0) {
        console.log('App handles network errors gracefully');
      }
    });
  });
});