import { expect, test } from '@playwright/test';

test('MyButton test-id workflow works instantly', async ({ page }) => {
  await page.goto('/dev/test-lab');

  const button = page.getByTestId('my-button');

  await expect(button).toBeVisible();
  await expect(button).toHaveText('Υποβολή');

  await button.click();

  // Headed/watch modes: keep browser open until you close Inspector.
  if (process.env.PW_WATCH) {
    await page.pause();
  }
});
