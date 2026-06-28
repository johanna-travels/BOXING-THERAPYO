import { expect, test } from '@playwright/test';

test.describe('Site header', () => {
  test('is ready for hero video on first paint', async ({ page }) => {
    await page.goto('');

    const header = page.getByTestId('site-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveClass(/ready/);
    await expect(header).toHaveAttribute('data-header-ready', 'true');
    await expect(header).not.toHaveClass(/is-hidden/);
  });

  test('hero exposes local video player without eager src', async ({ page }) => {
    await page.goto('');

    const player = page.getByTestId('hero-video-player');
    await expect(player).toBeAttached();
    await expect(player).toHaveAttribute('preload', 'none');
    await expect(player).toHaveAttribute('poster', /hero-poster/);

    const eagerSrc = await player.evaluate((el) => (el as HTMLVideoElement).currentSrc);
    expect(eagerSrc).toBe('');
  });
});
