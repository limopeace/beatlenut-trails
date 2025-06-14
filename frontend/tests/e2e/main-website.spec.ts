import { test, expect } from '@playwright/test';

test.describe('Main Website Tests', () => {
  
  test.describe('Homepage', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto('/');
      
      await expect(page).toHaveTitle(/Beatlenuts|Northeast|Travel/i);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should display navigation menu', async ({ page }) => {
      await page.goto('/');
      
      // Check for main navigation links
      const navLinks = ['Home', 'About', 'Services', 'Contact'];
      for (const linkText of navLinks) {
        const link = page.getByRole('link', { name: new RegExp(linkText, 'i') });
        if (await link.count() > 0) {
          await expect(link.first()).toBeVisible();
        }
      }
    });

    test('should have working ESM portal link', async ({ page }) => {
      await page.goto('/');
      
      const esmLink = page.getByRole('link', { name: /esm.*portal|ex.*servicemen/i });
      if (await esmLink.count() > 0) {
        await esmLink.first().click();
        await expect(page).toHaveURL(/esm-portal/);
      }
    });
  });

  test.describe('About Page', () => {
    test('should display about page', async ({ page }) => {
      await page.goto('/about');
      
      await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
    });
  });

  test.describe('Services Page', () => {
    test('should display services page', async ({ page }) => {
      await page.goto('/services');
      
      await expect(page.getByRole('heading', { name: /services/i })).toBeVisible();
    });
  });

  test.describe('Contact Page', () => {
    test('should display contact page', async ({ page }) => {
      await page.goto('/contact');
      
      await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
      
      // Should have contact form
      const contactForm = page.locator('form');
      if (await contactForm.count() > 0) {
        await expect(contactForm.first()).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      await expect(page.locator('body')).toBeVisible();
      
      // Check for mobile menu
      const mobileMenu = page.locator('[class*="mobile"], button[aria-label*="menu"]');
      if (await mobileMenu.count() > 0) {
        await expect(mobileMenu.first()).toBeVisible();
      }
    });
  });
});