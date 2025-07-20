import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully and has expected content', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads with correct title
    await expect(page).toHaveTitle(/Dragos Victor/);

    // Check for main content structure
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.locator('footer')).toContainText('© 2025 Dragos Victor');
    
    // Check hero section
    await expect(page.getByTestId('hero-title')).toBeVisible();
    await expect(page.getByTestId('hero-description')).toBeVisible();
    
    // Check CTA buttons
    await expect(page.getByTestId('cta-about')).toBeVisible();
    await expect(page.getByTestId('cta-contact')).toBeVisible();
  });

  test('has working navigation and sections', async ({ page }) => {
    await page.goto('/');

    // Test temporary navigation
    const tempNav = page.getByTestId('temp-navigation');
    await expect(tempNav).toBeVisible();
    
    // Test navigation links
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.getByTestId('nav-about')).toBeVisible();
    
    // Test sections
    await expect(page.getByTestId('about-section')).toBeVisible();
    await expect(page.getByTestId('contact-section')).toBeVisible();
  });

  test('is responsive across different viewports', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByTestId('hero-title')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('main')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('has proper SEO and accessibility elements', async ({ page }) => {
    await page.goto('/');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /cybersecurity/i);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /dragosvictor\.tech/);
    
    // Check skip link for accessibility - it should be present but visually hidden
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeAttached(); // Present in DOM
    
    // Test that skip link becomes visible when focused
    await skipLink.focus();
    await expect(skipLink).toBeVisible(); // Visible when focused
  });
});
