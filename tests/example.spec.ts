import { expect, test } from '@playwright/test';

test('MyButton test-id workflow works instantly', async ({ page }) => {
  await page.goto('/dev/test-lab');

  const button = page.getByTestId('my-button');

  await expect(button).toBeVisible();
  await expect(button).toHaveText('Υποβολή');

  // Uncomment to open Playwright Inspector with live DevTools:
  // await page.pause();

  await button.click();
});
