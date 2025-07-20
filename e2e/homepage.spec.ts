import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/Portfolio/);

    // Check for basic page structure using specific selectors
    await expect(page.locator('body > header')).toBeVisible();
    await expect(page.locator('body > main')).toBeVisible();
    await expect(page.locator('body > footer')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Test navigation links (when they exist)
    const nav = page.locator('body > nav');
    await expect(nav).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });
});
