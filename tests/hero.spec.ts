import { expect, test } from '@playwright/test';

test.describe('Hero image', () => {
  test('shows the hero image on first paint', async ({ page }) => {
    await page.goto('');

    const hero = page.getByTestId('hero-section');
    const image = page.getByTestId('hero-image');

    await expect(hero).toBeVisible();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('alt', 'Unlock Your Creative Potential');
    await expect(page.getByTestId('hero-title')).toHaveText('Unlock Your Creative Potential');
    await expect(page.getByTestId('hero-lead')).toContainText('Dive into innovative designs');
    await expect(page.getByTestId('hero-cta-primary')).toHaveText('Get Started');
    await expect(page.getByTestId('hero-cta-secondary')).toHaveText('Explore More');
  });

  test('switches header to dark mode after scrolling past the hero', async ({ page }) => {
    await page.goto('');

    await expect(page.getByTestId('site-header')).toBeVisible();
    await page.getByTestId('landing-section-work').scrollIntoViewIfNeeded();

    await expect(page.locator('body')).toHaveClass(/video-ended/, { timeout: 5000 });
  });
});
