import { expect, test } from '@playwright/test';

test.describe('Site header', () => {
  test('is ready for hero on first paint', async ({ page }) => {
    await page.goto('');

    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveClass(/ready/);
    await expect(header).toHaveAttribute('data-header-ready', 'true');
    await expect(header).not.toHaveClass(/is-hidden/);
  });

  test('hero exposes a high-priority image', async ({ page }) => {
    await page.goto('');

    const image = page.getByTestId('hero-image');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('loading', 'eager');
    await expect(image).toHaveAttribute('fetchpriority', 'high');
  });
});
