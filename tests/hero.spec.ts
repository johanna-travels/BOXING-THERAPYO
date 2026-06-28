import { expect, test } from '@playwright/test';

test.describe('Hero video', () => {
  test('shows the loader on first paint', async ({ page }) => {
    await page.goto('');

    await expect(page.getByTestId('hero-video-loader')).toBeVisible();
    await expect(page.getByTestId('hero-video-loader')).toContainText('LOADING STORY');
  });

  test('hides the mobile play gate on desktop', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'desktop viewport only');

    await page.goto('');
    await expect(page.getByTestId('hero-play-gate')).toBeHidden();
  });

  test('unlocks after tapping the mobile play gate', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile viewport only');

    await page.goto('');

    const hero = page.getByTestId('hero-section');
    const playGate = page.getByTestId('hero-play-gate');

    await expect(playGate).toBeVisible();
    await playGate.click();

    await expect(hero).toHaveClass(/is-unlocked/, { timeout: 3000 });
    await expect(page.getByTestId('hero-video-loader')).toBeHidden();
  });
});
