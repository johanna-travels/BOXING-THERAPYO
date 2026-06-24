import { expect, test } from '@playwright/test';
import path from 'node:path';

const screenshotDir = path.join('tests', 'screenshots');

test.describe('Site overview', () => {
  test('homepage loads with expected sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Boxing Game/);
    await expect(page.getByRole('heading', { level: 1, name: 'Boxing Game' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start fight' })).toBeVisible();
    await expect(page.locator('[data-page-mask]')).toBeVisible();
    await expect(page.getByTestId('scroll-page')).toBeVisible();
    await expect(page.getByTestId('bg-layer')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Round 1' })).toBeVisible();
    await expect(page.getByTestId('newsletter-slide')).toBeVisible();
    await expect(page.getByTestId('footer-newsletter-wrapper')).toBeVisible();
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

    const hero = page.getByRole('heading', { level: 1, name: 'Boxing Game' });
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

  test('slides are black with content inside mask', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('mask-section')).toHaveCount(7);
    await expect(page.getByTestId('snap-slide-content')).toHaveCount(7);

    const slideBg = await page.getByTestId('bg-layer').evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );
    expect(slideBg).toBe('rgb(0, 0, 0)');

    const contentInsideMask = await page.getByTestId('newsletter-slide').evaluate((slide) => {
      const mask = slide.querySelector('[data-testid="mask-section"]');
      const content = slide.querySelector('[data-testid="snap-slide-content"]');
      return mask?.contains(content) ?? false;
    });
    expect(contentInsideMask).toBe(true);
  });

  test('contact section stays on black background', async ({ page }) => {
    await page.goto('/');

    const contact = page.getByTestId('footer-contact-section');
    await expect(contact).toBeVisible();

    const bg = await contact.evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(bg).toBe('rgb(0, 0, 0)');
  });

  test('round slides: bg is sibling with gap before mask; newsletter has no bg', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByTestId('bg-layer-img')).toHaveCount(6);

    const roundSlide = page.getByTestId('bg-layer');
    const layout = await roundSlide.evaluate((slide) => {
      const media = slide.querySelector('[data-testid="bg-layer-img-parent"]') as HTMLElement | null;
      const mask = slide.querySelector('[data-testid="mask-section"]') as HTMLElement | null;
      const img = slide.querySelector('[data-testid="bg-layer-img"]') as HTMLElement | null;
      if (!media || !mask || !img) return null;
      const m = img.getBoundingClientRect();
      const k = mask.getBoundingClientRect();
      return {
        maskContainsMedia: mask.contains(media),
        mediaBeforeMask: media.nextElementSibling === mask,
        imgPosition: getComputedStyle(img).position,
        imgOpacity: getComputedStyle(img).opacity,
        gapPx: Math.min(
          k.left - m.left,
          k.top - m.top,
          m.right - k.right,
          m.bottom - k.bottom,
        ),
      };
    });

    expect(layout).not.toBeNull();
    expect(layout!.maskContainsMedia).toBe(false);
    expect(layout!.mediaBeforeMask).toBe(true);
    expect(layout!.imgPosition).toBe('fixed');
    expect(parseFloat(layout!.imgOpacity)).toBeGreaterThan(0);
    expect(layout!.gapPx).toBeGreaterThanOrEqual(16);

    await expect(page.getByTestId('newsletter-slide').locator('[data-testid="bg-layer-img"]')).toHaveCount(0);
  });

  test('newsletter lives inside mask only', async ({ page }) => {
    await page.goto('/');

    const slide = page.getByTestId('newsletter-slide');
    const mask = slide.getByTestId('mask-section');

    await expect(mask).toContainText('Sign up to our newsletter');
    await expect(slide.getByTestId('footer-newsletter-wrapper')).toBeVisible();
    await expect(slide.locator('[data-testid="bg-layer-img"]')).toHaveCount(0);
  });

  test('mobile mask is portrait with white border', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const mask = page.getByTestId('mask-section').first();
    const box = await mask.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const styles = getComputedStyle(node);
      return {
        ratio: rect.width / rect.height,
        borderTopWidth: styles.borderTopWidth,
        borderColor: styles.borderTopColor,
      };
    });

    expect(box.ratio).toBeGreaterThan(0.72);
    expect(box.ratio).toBeLessThan(0.78);
    expect(parseFloat(box.borderTopWidth)).toBeGreaterThanOrEqual(14);
    expect(box.borderColor).toBe('rgb(255, 255, 255)');
  });

  test('mobile viewport keeps full-height slides and vertical form', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const slide = page.getByTestId('bg-layer');
    const slideHeight = await slide.evaluate((node) => node.getBoundingClientRect().height);
    expect(slideHeight).toBeGreaterThanOrEqual(844 * 0.95);

    const form = page.locator('.newsletter__form');
    const formBox = await form.evaluate((node) => {
      const first = node.querySelector('.newsletter__input');
      const last = node.querySelector('.newsletter__submit');
      if (!first || !last) return null;
      const a = first.getBoundingClientRect();
      const b = last.getBoundingClientRect();
      return { firstTop: a.top, submitTop: b.top };
    });

    expect(formBox).not.toBeNull();
    expect(formBox!.submitTop).toBeGreaterThan(formBox!.firstTop);
  });

  test('footer is visible after scroll sections', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('[data-footer-bob]');
    await expect(footer).toBeVisible();
    await expect(page.locator('[data-site-footer]')).toBeVisible();

    const footerBg = await footer.evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(footerBg).toBe('rgba(0, 0, 0, 0)');
  });
});
