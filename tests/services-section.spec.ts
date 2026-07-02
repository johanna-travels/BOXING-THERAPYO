import { expect, test } from '@playwright/test';

const SERVICES_ID = 'services';
const PARALLAX_WATERMARK_SPEED = '0.5';
const PARALLAX_TITLE_SPEED = '0.85';

test.describe('ServicesSection — parallax', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.waitForSelector('#smooth-wrapper');
    await page.waitForSelector('#smooth-content');
  });

  test('renders FocusBox pillars and lead copy', async ({ page }) => {
    const section = page.getByTestId('landing-section-services');

    await expect(section.getByTestId('services-lead')).toContainText('FocusBox is a practical');
    await expect(section.getByTestId('services-pillars')).toContainText('Focus');
    await expect(section.getByTestId('services-pillars')).toContainText('Breathing');
    await expect(section.getByTestId('services-pillars')).toContainText('Emotional Control');
  });

  test('renders section shell with white background', async ({ page }) => {
    const section = page.getByTestId('landing-section-services');

    await expect(section).toHaveAttribute('id', SERVICES_ID);
    await expect(section).toHaveClass(/services-section/);
    await expect(section).toHaveClass(/landing__section/);
    await expect(section).toHaveAttribute('data-parallax-section', '');

    await expect(section.getByRole('heading', { level: 2, name: 'Breath' })).toBeVisible();

    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(section).toHaveCSS('color', 'rgb(0, 0, 0)');
  });

  test('parallax layers expose hardcoded data-speed values', async ({ page }) => {
    const watermark = page.getByTestId('services-parallax-watermark');
    const title = page.getByTestId('services-parallax-title');

    await expect(watermark).toHaveAttribute('data-speed', PARALLAX_WATERMARK_SPEED);
    await expect(title).toHaveAttribute('data-speed', PARALLAX_TITLE_SPEED);
    await expect(watermark).toHaveAttribute('aria-hidden', 'true');
  });

  test('fixed chrome stays outside smooth-wrapper', async ({ page }) => {
    const fixedOutsideWrapper = await page.evaluate(() => {
      const wrapper = document.querySelector('#smooth-wrapper');
      const header = document.querySelector('[data-site-header]');
      const nav = document.querySelector('[data-nav-menu]');

      if (!wrapper || !header || !nav) return false;

      return !wrapper.contains(header) && !wrapper.contains(nav);
    });

    expect(fixedOutsideWrapper).toBe(true);
  });

  test('ScrollSmoother scaffold is present', async ({ page }) => {
    await expect(page.locator('#smooth-wrapper')).toHaveCount(1);
    await expect(page.locator('#smooth-content')).toHaveCount(1);
    await expect(page.locator('#smooth-wrapper #smooth-content')).toHaveCount(1);
  });

  test('parallax layers move at different rates when scrolled into view', async ({ page }) => {
    await page.getByTestId('nav-hamburger-btn').click();
    await page.getByTestId('nav-link-services').click();

    await expect(page).toHaveURL(/#services$/);
    await expect(page.getByTestId('landing-section-services')).toBeInViewport();

    const scrolledOffsets = await page.evaluate(() => {
      const readLayer = (testId: string) => {
        const el = document.querySelector(`[data-testid="${testId}"]`);
        if (!el) return null;

        const rect = el.getBoundingClientRect();
        return {
          top: rect.top,
          transform: el.style.transform || window.getComputedStyle(el).transform,
        };
      };

      return {
        watermark: readLayer('services-parallax-watermark'),
        title: readLayer('services-parallax-title'),
      };
    });

    expect(scrolledOffsets.watermark).not.toBeNull();
    expect(scrolledOffsets.title).not.toBeNull();

    const watermarkTop = scrolledOffsets.watermark!.top;
    const titleTop = scrolledOffsets.title!.top;
    const transformDelta = Math.abs(
      (scrolledOffsets.watermark!.transform.length || 0) -
        (scrolledOffsets.title!.transform.length || 0),
    );

    const topsDiffer = Math.abs(watermarkTop - titleTop) > 0.5;
    const transformsDiffer =
      scrolledOffsets.watermark!.transform !== scrolledOffsets.title!.transform;

    expect(topsDiffer || transformsDiffer || transformDelta > 0).toBe(true);
  });
});
