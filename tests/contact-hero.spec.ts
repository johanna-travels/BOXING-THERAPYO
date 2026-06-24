import { expect, test } from '@playwright/test';

test.describe('ContactHero mobile LCP', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hero is visible with eager high-priority LCP image', async ({ page }) => {
    await page.goto('/dev/contact-hero');

    const hero = page.getByTestId('contact-hero');
    const lcpImage = page.getByTestId('contact-hero-lcp');

    await expect(hero).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Where Places Become Stories' })).toBeVisible();

    await expect(lcpImage).toBeVisible();
    await expect(lcpImage).toHaveAttribute('loading', 'eager');
    await expect(lcpImage).toHaveAttribute('fetchpriority', 'high');
    await expect(lcpImage).not.toHaveAttribute('loading', 'lazy');

    const preload = page.locator('link[rel="preload"][as="image"][fetchpriority="high"]');
    await expect(preload).toHaveCount(1);
  });

  test('social links are reachable inside hero', async ({ page }) => {
    await page.goto('/dev/contact-hero');

    const hero = page.getByTestId('contact-hero');
    await expect(hero.getByRole('link', { name: 'Voyaflair on Instagram' })).toBeVisible();
  });
});
