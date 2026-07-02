import { expect, test } from '@playwright/test';

test.describe('Intro loader', () => {
  test('shows fake logo slot on first paint', async ({ page }) => {
    await page.goto('');

    await expect(page.getByTestId('intro-fake-logo')).toBeAttached();
    await expect(page.getByTestId('intro-fake-logo')).toHaveClass(/is-op-0/);
  });

  test('hands off to header logo and dismisses loader', async ({ page }) => {
    await page.goto('');

    await expect(page.getByTestId('intro-loader')).toBeHidden({ timeout: 8000 });
    await expect(page.getByTestId('site-logo')).toBeVisible();
    await expect(page.getByTestId('site-logo')).not.toHaveClass(/is-op-0/);
  });

  test('shows branded lines on first paint', async ({ page }) => {
    await page.goto('');

    const loader = page.getByTestId('intro-loader');
    await expect(loader).toBeVisible();
    await expect(page.getByTestId('intro-loader-progress')).toBeVisible();
    await expect(page.getByTestId('intro-loader-content')).toContainText('Focus');
    await expect(page.getByTestId('intro-loader-content')).toContainText('Box');
    await expect(page.getByTestId('intro-loader-content')).toContainText('Breath');
    await expect(page.getByTestId('intro-loader-content')).toContainText('Control');
    await expect(page.getByTestId('intro-loader-content')).toContainText('Pressure');
  });

  test('dismisses after the intro animation', async ({ page }) => {
    await page.goto('');

    await expect(page.getByTestId('intro-loader')).toBeVisible();
    await expect(page.getByTestId('intro-loader')).toBeHidden({ timeout: 8000 });
  });
});
