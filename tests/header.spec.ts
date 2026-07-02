import { expect, test } from '@playwright/test';

test.describe('Site header', () => {
  test('uses nav_1_contain layout', async ({ page }) => {
    await page.goto('');

    const contain = page.getByTestId('site-header-contain');
    await expect(contain).toBeVisible();
    await expect(contain).toHaveClass(/nav_1_contain/);

    const metrics = await contain.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        display: styles.display,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
        width: styles.width,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
      };
    });

    expect(metrics.display).toBe('flex');
    expect(metrics.justifyContent).toBe('space-between');
    expect(metrics.alignItems).toBe('flex-start');
    expect(metrics.paddingLeft).toBe('16px');
    expect(metrics.paddingRight).toBe('16px');
    expect(parseFloat(metrics.width)).toBeGreaterThan(0);
    expect(metrics.marginLeft).toBe(metrics.marginRight);
  });

  test('logo wrap uses Oswald at responsive size', async ({ page }) => {
    await page.goto('');
    await expect(page.getByTestId('intro-loader')).toBeHidden({ timeout: 8000 });

    const logo = page.getByTestId('site-logo');
    await expect(logo).toHaveClass(/nav_1_logo_wrap/);

    const wordmark = logo.locator('[data-logo-text]');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toHaveText('FOCUSBOX');

    const metrics = await wordmark.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
      };
    });

    expect(metrics.fontSize).toBe('32px');
    expect(metrics.fontFamily.toLowerCase()).toContain('oswald');
  });

  test('is ready for hero on first paint', async ({ page }) => {
    await page.goto('');

    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveClass(/ready/);
    await expect(header).toHaveAttribute('data-header-ready', 'true');
    await expect(header).not.toHaveClass(/is-hidden/);

    await expect(page.getByTestId('intro-loader')).toBeHidden({ timeout: 8000 });
    await expect(page.getByTestId('site-logo')).toBeVisible();
  });

  test('hero exposes a high-priority image', async ({ page }) => {
    await page.goto('');

    const image = page.getByTestId('hero-image');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('loading', 'eager');
    await expect(image).toHaveAttribute('fetchpriority', 'high');
  });
});
