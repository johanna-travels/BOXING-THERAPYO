import { expect, test } from '@playwright/test';

test.describe('Footer CTAs', () => {
  test('phone and donate links are visible on test lab', async ({ page }) => {
    await page.goto('/dev/test-lab');

    const section = page.getByTestId('footer-ctas-wrapper');
    const phoneLink = page.getByTestId('footer-ctas-phone-link');
    const phoneText = page.getByTestId('footer-ctas-phone-text');
    const donateLink = page.getByTestId('footer-ctas-donate-link');

    await expect(section).toBeVisible();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', 'tel:01172338700');
    await expect(phoneLink).toHaveText('0117 233 8700');
    await expect(phoneText).toHaveText(
      'Call for all enquiries (Mon to Fri, 10am to 5pm)',
    );
    await expect(donateLink).toBeVisible();
    await expect(donateLink).toHaveText('Donate');
  });
});
