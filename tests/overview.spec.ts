import { expect, test } from '@playwright/test';
import path from 'node:path';

const screenshotDir = path.join('tests', 'screenshots');

test.describe('Site overview', () => {
  test('homepage loads with expected sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Boxing Game/);
    await expect(page.getByRole('heading', { level: 1, name: 'Boxing Game' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start fight' })).toBeVisible();
    await expect(page.locator('[data-slider-section]')).toBeVisible();
    await expect(page.locator('[data-page-mask]')).toBeVisible();
    await expect(page.locator('[data-contact-section]')).toHaveCount(0);
    await expect(page.locator('[data-site-footer]')).toContainText('Round 1');
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

  test('capture hero section', async ({ page }, testInfo) => {
    await page.goto('/');

    const hero = page.getByRole('main');
    const screenshotPath = path.join(
      screenshotDir,
      `hero-${testInfo.project.name}.png`,
    );

    await hero.screenshot({ path: screenshotPath });

    await test.info().attach('hero', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });

  test('capture slider section', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const slider = page.locator('[data-slider-section]');
    await slider.scrollIntoViewIfNeeded();

    const screenshotPath = path.join(
      screenshotDir,
      `slider-${testInfo.project.name}.png`,
    );

    await slider.screenshot({ path: screenshotPath });

    await test.info().attach('slider', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });

  test('slider uses one shared image source', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const slider = page.locator('[data-slider-section]');
    const images = slider.locator('.slider__slide-img');

    await expect(slider.locator('.slider__slide')).toHaveCount(8);
    await expect(images).toHaveCount(8);

    const sources = await images.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLImageElement).currentSrc || (node as HTMLImageElement).src),
    );

    expect(new Set(sources).size).toBe(1);
    expect(sources[0]).toContain('picsum.photos/seed/boxing-game');

    const slideOpacity = await images
      .first()
      .evaluate((node) => getComputedStyle(node).opacity);
    expect(slideOpacity).toBe('0.72');
  });

  test('page mask is white with footer inside mask', async ({ page }) => {
    await page.goto('/');

    const maskSurface = page.locator('[data-page-mask] .page-mask__surface');
    const footer = page.locator('[data-footer-bob]');

    const maskBg = await maskSurface.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );
    expect(maskBg).toBe('rgb(255, 255, 255)');

    await expect(footer).toBeVisible();
    await expect(page.locator('[data-page-mask] [data-site-footer]')).toBeVisible();

    const footerBg = await footer.evaluate((node) => getComputedStyle(node).backgroundImage);
    expect(footerBg).toContain('linear-gradient');
  });
});
