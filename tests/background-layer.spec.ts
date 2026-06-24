import { expect, test } from '@playwright/test';

test.describe('Background Layer', () => {
  test('renders the contained background layer on test lab', async ({
    page,
  }) => {
    await page.goto('/dev/test-lab');

    const layer = page.getByTestId('bg-layer');
    const images = page.getByTestId('bg-layer-img');

    await expect(layer).toBeVisible();
    await expect(images).toHaveCount(6);

    // First image carries a background-image url
    const firstBg = await images
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(firstBg).toContain('url(');
  });
});
