import { expect, test } from '@playwright/test';

test.describe('Navigation menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('exposes hamburger structure with test ids', async ({ page }) => {
    await expect(page.getByTestId('nav-toggle-wrap')).toBeVisible();
    await expect(page.getByTestId('nav-hamburger-btn')).toBeVisible();
    await expect(page.getByTestId('nav-hamburger-line-top')).toBeVisible();
    await expect(page.getByTestId('nav-hamburger-line-middle')).toBeVisible();
    await expect(page.getByTestId('nav-hamburger-line-bottom')).toBeVisible();
  });

  test('opens and closes via the toggle', async ({ page }) => {
    const toggle = page.getByTestId('nav-toggle');
    const menu = page.getByTestId('nav-menu');

    await page.getByTestId('nav-hamburger-btn').click();
    await expect(toggle).toBeChecked();
    await expect(page.locator('body')).toHaveClass(/w--open/);
    await expect(menu).toHaveClass(/w--open/);
    await expect(menu).toHaveAttribute('aria-hidden', 'false');
    await expect(page.getByTestId('nav-link-services')).toBeVisible();
    await expect(page.getByTestId('nav-cta')).toBeVisible();

    await page.getByTestId('nav-hamburger-btn').click();
    await expect(toggle).not.toBeChecked();
    await expect(page.locator('body')).not.toHaveClass(/w--open/);
    await expect(menu).not.toHaveClass(/w--open/);
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  test('hamburger meets circle spec', async ({ page }) => {
    const btn = page.getByTestId('nav-hamburger-btn');
    await expect(btn).toBeVisible();

    const box = await btn.boundingBox();
    expect(box?.width).toBe(48);
    expect(box?.height).toBe(48);

    await expect(btn).toHaveCSS('background-color', 'rgb(223, 5, 103)');
    await expect(btn).toHaveCSS('border-radius', /50%/);
    await expect(btn).toHaveCSS('border-color', 'rgb(223, 5, 103)');

    const line = page.getByTestId('nav-hamburger-line-top');
    await expect(line).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    const lineBox = await line.boundingBox();
    expect(lineBox?.width).toBeGreaterThan(10);
    expect(lineBox?.height).toBeGreaterThan(1);

    await page.getByTestId('nav-hamburger-btn').click();
    await expect(btn).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    const activeLine = page.getByTestId('nav-hamburger-line-top');
    await expect(activeLine).toHaveCSS('background-color', 'rgb(223, 5, 103)');
  });

  test('closes with Escape', async ({ page }) => {
    await page.getByTestId('nav-hamburger-btn').click();
    await expect(page.getByTestId('nav-menu')).toHaveAttribute('aria-hidden', 'false');

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('nav-toggle')).not.toBeChecked();
    await expect(page.getByTestId('nav-menu')).toHaveAttribute('aria-hidden', 'true');
  });

  test('primary link scrolls to a landing section', async ({ page }) => {
    await page.getByTestId('nav-hamburger-btn').click();
    await page.getByTestId('nav-link-about').click();

    await expect(page).toHaveURL(/#about$/);
    await expect(page.getByTestId('nav-menu')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByTestId('landing-section-about')).toBeInViewport();
  });

  test('logo returns to hero', async ({ page }) => {
    await page.goto('');
    await page.getByTestId('landing-section-contact').scrollIntoViewIfNeeded();

    await page.evaluate(async () => {
      const start = window.scrollY;
      for (let i = 0; i < 8; i += 1) {
        window.scrollBy(0, -120);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      return start - window.scrollY;
    });

    await expect(page.getByTestId('site-header')).not.toHaveClass(/is-hidden/);
    await page.getByTestId('site-logo').click();

    await expect(page).toHaveURL(/#hero$/);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(120);
  });

  test('social links open externally', async ({ page }) => {
    await page.getByTestId('nav-hamburger-btn').click();

    const ig = page.getByTestId('nav-social-ig');
    await expect(ig).toHaveAttribute('href', /instagram\.com/);
    await expect(ig).toHaveAttribute('target', '_blank');
  });
});
