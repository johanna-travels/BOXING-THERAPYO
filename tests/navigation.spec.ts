import { expect, test } from '@playwright/test';

test.describe('Navigation menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens and closes via the toggle', async ({ page }) => {
    const toggle = page.getByTestId('nav-toggle');
    const menu = page.getByTestId('nav-menu');

    await page.getByTestId('nav-toggle-label').click();
    await expect(toggle).toBeChecked();
    await expect(menu).toHaveAttribute('aria-hidden', 'false');
    await expect(page.getByTestId('nav-link-services')).toBeVisible();
    await expect(page.getByTestId('nav-cta')).toBeVisible();

    await page.getByTestId('nav-toggle-label').click();
    await expect(toggle).not.toBeChecked();
    await expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  test('closes with Escape', async ({ page }) => {
    await page.getByTestId('nav-toggle-label').click();
    await expect(page.getByTestId('nav-menu')).toHaveAttribute('aria-hidden', 'false');

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('nav-toggle')).not.toBeChecked();
    await expect(page.getByTestId('nav-menu')).toHaveAttribute('aria-hidden', 'true');
  });

  test('primary link scrolls to a landing section', async ({ page }) => {
    await page.getByTestId('nav-toggle-label').click();
    await page.getByTestId('nav-link-about').click();

    await expect(page).toHaveURL(/#about$/);
    await expect(page.getByTestId('nav-menu')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByTestId('landing-section-about')).toBeInViewport();
  });

  test('logo returns to hero', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByTestId('site-logo').click();

    await expect(page).toHaveURL(/#hero$/);
    await expect(page.getByTestId('hero-section')).toBeInViewport();
  });

  test('social links open externally', async ({ page }) => {
    await page.getByTestId('nav-toggle-label').click();

    const ig = page.getByTestId('nav-social-ig');
    await expect(ig).toHaveAttribute('href', /instagram\.com/);
    await expect(ig).toHaveAttribute('target', '_blank');
  });
});
