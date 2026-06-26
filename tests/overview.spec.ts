import { expect, test } from '@playwright/test';
import path from 'node:path';

const screenshotDir = path.join('tests', 'screenshots');

test.describe('Site overview', () => {
  // The homepage feed is a mobile-only vertical image feed (hidden >=768px)
  test.use({ viewport: { width: 390, height: 844 } });

  test('homepage renders the vertical image feed on mobile', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('bg-layer')).toBeVisible();
    await expect(page.getByTestId('bg-layer-img')).toHaveCount(6);
  });

  test('feed images each carry a real src', async ({ page }) => {
    await page.goto('/');

    const images = page.getByTestId('bg-layer-img');
    await expect(images).toHaveCount(6);
    await expect(images.first()).toHaveAttribute('src', /picsum\.photos/);
  });

  test('feed is hidden on desktop (>=768px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(page.getByTestId('bg-layer')).toBeHidden();
  });

  test('capture full-page overview', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const screenshotPath = path.join(
      screenshotDir,
      `overview-${testInfo.project.name}.png`,
    );

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    await test.info().attach('overview', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
});
