import { expect, test } from '@playwright/test';

test.describe('Hero', () => {
  test('shows background and loader content on first paint', async ({ page }) => {
    await page.goto('');

    const hero = page.getByTestId('hero-section');
    const image = page.getByTestId('hero-image');

    await expect(hero).toBeVisible();
    await expect(page.getByTestId('hero-background')).toBeAttached();
    await expect(page.getByTestId('hero-video-overlay')).toBeAttached();
    await expect(page.getByTestId('hero-video')).toBeAttached();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('alt', 'Unlock Your Creative Potential');
    await expect(page.locator('[data-loader-contain]')).toBeVisible();
    await expect(page.locator('.h1-display')).toContainText("LET'S GO VIRAL");
  });

  test('switches header to dark mode after scrolling past the hero', async ({ page }) => {
    await page.goto('');

    await expect(page.getByTestId('site-header')).toBeVisible();
    await page.getByTestId('landing-section-work').scrollIntoViewIfNeeded();

    await expect(page.locator('body')).toHaveClass(/video-ended/, { timeout: 5000 });
  });
});
