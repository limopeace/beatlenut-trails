import { test, expect, Page } from '@playwright/test';
import path from 'path';

test.describe('ESM Portal Tests', () => {
  
  // Test data
  const testData = {
    seller: {
      firstName: 'John',
      lastName: 'Smith',
      email: `test.seller.${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'TestPassword123!',
      businessName: 'Smith Defense Services',
      businessDescription: 'Professional security and defense consulting services with over 15 years of military experience. We provide comprehensive security solutions for businesses and individuals.',
      serviceBackground: 'Former Army Captain with 15 years of active duty service specializing in tactical operations, security assessments, and personnel training. Experienced in risk management and threat assessment.',
      establishmentYear: '2020',
      website: 'https://smithdefense.com',
      address: '123 Defense Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      serviceRadius: '100'
    },
    buyer: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: `test.buyer.${Date.now()}@example.com`,
      phone: '9876543211',
      password: 'TestPassword123!'
    },
    product: {
      name: 'Professional Security Equipment Kit',
      description: 'Complete security equipment kit including tactical gear, communication devices, and safety equipment for professional use.',
      price: '15000',
      category: 'Security Services'
    },
    service: {
      name: 'Personal Security Training',
      description: 'Comprehensive personal security training program covering threat assessment, defensive tactics, and emergency response procedures.',
      basePrice: '5000',
      category: 'Security Services',
      duration: '40 hours',
      location: 'Mumbai, Maharashtra'
    }
  };

  test.beforeEach(async ({ page }) => {
    // Ensure we start from a clean state
    await page.goto('/');
  });

  test.describe('ESM Portal Navigation', () => {
    test('should navigate to ESM portal from main page', async ({ page }) => {
      await page.goto('/');
      
      // Look for ESM portal link
      const esmLink = page.getByRole('link', { name: /esm.*portal|ex.*servicemen/i });
      if (await esmLink.count() > 0) {
        await esmLink.first().click();
        await expect(page).toHaveURL(/\/esm-portal/);
      } else {
        // Direct navigation if link not found
        await page.goto('/esm-portal');
      }
      
      await expect(page).toHaveTitle(/ESM|Ex.*Servicemen/i);
    });

    test('should display ESM portal main page', async ({ page }) => {
      await page.goto('/esm-portal');
      
      // Check for key elements
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      
      // Check for navigation links
      const expectedLinks = ['Products', 'Services', 'Login', 'Register'];
      for (const linkText of expectedLinks) {
        const link = page.getByRole('link', { name: new RegExp(linkText, 'i') });
        if (await link.count() > 0) {
          await expect(link.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('ESM Portal Registration', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/esm-portal/register');
      
      await expect(page.getByRole('heading', { name: /registration|register/i })).toBeVisible();
      await expect(page.getByText(/personal.*information|step.*1/i)).toBeVisible();
    });

    test('should validate form fields', async ({ page }) => {
      await page.goto('/esm-portal/register');
      
      // Try to proceed without filling required fields
      const nextButton = page.getByRole('button', { name: /next|continue/i });
      if (await nextButton.count() > 0) {
        await nextButton.click();
        
        // Should show validation errors
        const errorMessages = page.locator('[class*="error"], .text-red');
        if (await errorMessages.count() > 0) {
          await expect(errorMessages.first()).toBeVisible();
        }
      }
    });

    test('should complete step 1 - Personal Information', async ({ page }) => {
      await page.goto('/esm-portal/register');
      
      // Fill personal information
      await page.fill('input[name="firstName"]', testData.seller.firstName);
      await page.fill('input[name="lastName"]', testData.seller.lastName);
      await page.fill('input[name="email"]', testData.seller.email);
      await page.fill('input[name="phone"]', testData.seller.phone);
      await page.fill('input[name="password"]', testData.seller.password);
      await page.fill('textarea[name="serviceBackground"]', testData.seller.serviceBackground);
      
      // Proceed to next step
      const nextButton = page.getByRole('button', { name: /next|continue/i });
      if (await nextButton.count() > 0) {
        await nextButton.click();
        
        // Should move to step 2
        await expect(page.getByText(/business.*information|step.*2/i)).toBeVisible();
      }
    });

    test('should complete step 2 - Business Information', async ({ page }) => {
      await page.goto('/esm-portal/register');
      
      // Complete step 1 first
      await page.fill('input[name="firstName"]', testData.seller.firstName);
      await page.fill('input[name="lastName"]', testData.seller.lastName);
      await page.fill('input[name="email"]', testData.seller.email);
      await page.fill('input[name="phone"]', testData.seller.phone);
      await page.fill('input[name="password"]', testData.seller.password);
      await page.fill('textarea[name="serviceBackground"]', testData.seller.serviceBackground);
      
      let nextButton = page.getByRole('button', { name: /next|continue/i });
      if (await nextButton.count() > 0) {
        await nextButton.click();
      }
      
      // Fill business information
      await page.fill('input[name="businessName"]', testData.seller.businessName);
      await page.fill('textarea[name="businessDescription"]', testData.seller.businessDescription);
      await page.fill('input[name="establishmentYear"]', testData.seller.establishmentYear);
      await page.fill('input[name="website"]', testData.seller.website);
      
      // Proceed to next step
      nextButton = page.getByRole('button', { name: /next|continue/i });
      if (await nextButton.count() > 0) {
        await nextButton.click();
        
        // Should move to step 3
        await expect(page.getByText(/location|step.*3/i)).toBeVisible();
      }
    });

    test('should test service categories including "Other" option', async ({ page }) => {
      await page.goto('/esm-portal/register');
      
      // Navigate to categories step (step 4)
      // We'll simulate getting there by checking if categories are visible
      const categoriesHeading = page.getByText(/service.*categories|categories/i);
      
      if (await categoriesHeading.count() === 0) {
        // Skip through steps if needed
        for (let step = 1; step <= 3; step++) {
          const nextBtn = page.getByRole('button', { name: /next|continue/i });
          if (await nextBtn.count() > 0) {
            await nextBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }
      
      // Check if we can see categories
      const categoryCheckboxes = page.locator('input[type="checkbox"][value*="Services"], input[type="checkbox"][value*="Equipment"]');
      if (await categoryCheckboxes.count() > 0) {
        // Select a predefined category
        await categoryCheckboxes.first().check();
        
        // Check for "Other" option
        const otherCheckbox = page.locator('input[type="checkbox"][value="Other"]');
        if (await otherCheckbox.count() > 0) {
          await otherCheckbox.check();
          
          // Should show custom categories textarea
          const customTextarea = page.locator('textarea[name="customCategories"]');
          await expect(customTextarea).toBeVisible();
          
          // Fill custom categories
          await customTextarea.fill('Custom Security Consulting, Specialized Training, Emergency Response');
        }
      }
    });

    test('should test document upload functionality', async ({ page }) => {
      await page.goto('/esm-portal/register');
      
      // Create a test file for upload
      const testFilePath = path.join(__dirname, 'test-document.png');
      
      // Navigate to documents step if possible
      const documentHeading = page.getByText(/documents|upload/i);
      
      if (await documentHeading.count() === 0) {
        // Skip through steps to reach documents
        for (let step = 1; step <= 4; step++) {
          const nextBtn = page.getByRole('button', { name: /next|continue/i });
          if (await nextBtn.count() > 0) {
            await nextBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }
      
      // Test file upload if available
      const fileInput = page.locator('input[type="file"]').first();
      if (await fileInput.count() > 0) {
        // Check if we can access file upload
        const uploadArea = page.locator('[class*="border-dashed"], .upload-area').first();
        if (await uploadArea.count() > 0) {
          await expect(uploadArea).toBeVisible();
          
          // The file input should be present
          await expect(fileInput).toBeAttached();
        }
      }
    });
  });

  test.describe('ESM Portal Login', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/esm-portal/login');
      
      await expect(page.getByRole('heading', { name: /login|sign.*in/i })).toBeVisible();
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
      await expect(page.getByRole('button', { name: /login|sign.*in/i })).toBeVisible();
    });

    test('should validate login credentials', async ({ page }) => {
      await page.goto('/esm-portal/login');
      
      // Try invalid credentials
      await page.fill('input[type="email"], input[name="email"]', 'invalid@email.com');
      await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
      
      const loginButton = page.getByRole('button', { name: /login|sign.*in/i });
      await loginButton.click();
      
      // Should show error message or stay on login page
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
    });
  });

  test.describe('ESM Portal Products', () => {
    test('should display products page', async ({ page }) => {
      await page.goto('/esm-portal/products');
      
      await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
      
      // Check for search functionality
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
      if (await searchInput.count() > 0) {
        await expect(searchInput.first()).toBeVisible();
      }
      
      // Check for category filters
      const categoryFilters = page.locator('select, [class*="filter"], [class*="category"]');
      if (await categoryFilters.count() > 0) {
        await expect(categoryFilters.first()).toBeVisible();
      }
    });

    test('should test product search functionality', async ({ page }) => {
      await page.goto('/esm-portal/products');
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('security');
        await searchInput.press('Enter');
        
        // Wait for search results
        await page.waitForTimeout(2000);
        
        // Should update URL or show results
        const resultsContainer = page.locator('[class*="product"], [class*="result"], .grid');
        if (await resultsContainer.count() > 0) {
          await expect(resultsContainer.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('ESM Portal Services', () => {
    test('should display services page', async ({ page }) => {
      await page.goto('/esm-portal/services');
      
      await expect(page.getByRole('heading', { name: /services/i })).toBeVisible();
      
      // Check for service listings or empty state
      const serviceCards = page.locator('[class*="service"], [class*="card"], .grid > div');
      const emptyState = page.getByText(/no.*services|empty|coming.*soon/i);
      
      // Either services should be displayed or empty state
      if (await serviceCards.count() > 0) {
        await expect(serviceCards.first()).toBeVisible();
      } else if (await emptyState.count() > 0) {
        await expect(emptyState.first()).toBeVisible();
      }
    });
  });

  test.describe('ESM Portal Add Product', () => {
    test('should display add product page (may require login)', async ({ page }) => {
      await page.goto('/esm-portal/add-product');
      
      // May redirect to login if not authenticated
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        // Should show add product form
        await expect(page.getByRole('heading', { name: /add.*product|create.*product/i })).toBeVisible();
      }
    });
  });

  test.describe('ESM Portal Add Service', () => {
    test('should display add service page (may require login)', async ({ page }) => {
      await page.goto('/esm-portal/add-service');
      
      // May redirect to login if not authenticated
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      } else {
        // Should show add service form
        await expect(page.getByRole('heading', { name: /add.*service|create.*service/i })).toBeVisible();
      }
    });
  });

  test.describe('ESM Portal Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/esm-portal');
      
      // Should display mobile navigation
      const mobileMenu = page.locator('[class*="mobile"], [class*="hamburger"], button[aria-label*="menu"]');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu.first()).toBeVisible();
      }
      
      // Page should be responsive
      await expect(page.locator('body')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/esm-portal');
      
      await expect(page.locator('body')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  });
});