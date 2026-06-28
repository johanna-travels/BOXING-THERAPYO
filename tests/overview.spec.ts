import { expect, test } from '@playwright/test';

const landingSections = ['services', 'work', 'about', 'journal', 'contact', 'jobs'] as const;

test.describe('Homepage overview', () => {
  test('loads with header, hero, and landing sections', async ({ page }) => {
    await page.goto('');

    await expect(page).toHaveTitle(/B\.TH/);
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('site-header')).toHaveClass(/ready/);
    await expect(page.getByTestId('site-logo')).toBeVisible();
    await expect(page.getByTestId('nav-toggle')).toBeAttached();
    await expect(page.getByTestId('landing-main')).toBeVisible();
    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('hero-video-player')).toBeAttached();
    await expect(page.getByTestId('hero-video-media')).toBeAttached();

    for (const id of landingSections) {
      await expect(page.getByTestId(`landing-section-${id}`)).toBeAttached();
      await expect(page.getByTestId(`landing-section-${id}`)).toContainText(
        id.charAt(0).toUpperCase() + id.slice(1),
      );
    }
  });

  test('nav menu starts closed', async ({ page }) => {
    await page.goto('');

    await expect(page.getByTestId('nav-menu')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByTestId('nav-toggle')).not.toBeChecked();
  });
});
