import { expect, test } from '@playwright/test';

test.describe('About page', () => {
  test('renders with shared header and page shell', async ({ page }) => {
    await page.goto('/about');

    await expect(page).toHaveTitle(/About/);
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('page-shell')).toBeVisible();
    await expect(page.getByTestId('page-title')).toHaveText('About');
    await expect(page.getByTestId('page-shell')).toContainText('About page content.');
  });
});
