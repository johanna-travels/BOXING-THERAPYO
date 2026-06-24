import { expect, test } from '@playwright/test';

test.describe('Contact / Sign-up Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/test-lab');
  });

  test('renders with accessible metadata and required stars', async ({
    page,
  }) => {
    const form = page.getByTestId('contact-form');
    await expect(form).toBeVisible();

    const firstName = page.getByTestId('contact-form-firstname');
    const lastName = page.getByTestId('contact-form-lastname');
    const email = page.getByTestId('contact-form-email');

    // Required stars in placeholders
    await expect(firstName).toHaveAttribute('placeholder', /\*/);
    await expect(lastName).toHaveAttribute('placeholder', /\*/);
    await expect(email).toHaveAttribute('placeholder', /\*/);

    // ARIA metadata
    for (const field of [firstName, lastName, email]) {
      await expect(field).toHaveAttribute('aria-required', 'true');
      await expect(field).toHaveAttribute('aria-label', /required/i);
      await expect(field).toHaveAttribute('aria-invalid', 'false');
    }
  });

  test('shows invalid errors when submitting empty', async ({ page }) => {
    await page.getByTestId('contact-form-submit').click();

    await expect(page.getByTestId('contact-form-firstname-error')).toBeVisible();
    await expect(page.getByTestId('contact-form-lastname-error')).toBeVisible();
    await expect(page.getByTestId('contact-form-email-error')).toBeVisible();

    await expect(page.getByTestId('contact-form-firstname')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(page.getByTestId('contact-form-status')).toBeHidden();
  });

  test('flags an invalid email', async ({ page }) => {
    await page.getByTestId('contact-form-email').fill('not-an-email');
    await page.getByTestId('contact-form-submit').click();

    await expect(page.getByTestId('contact-form-email-error')).toBeVisible();
    await expect(page.getByTestId('contact-form-email-valid')).toBeHidden();
  });

  test('shows the valid message only for a valid email', async ({ page }) => {
    const email = page.getByTestId('contact-form-email');
    await email.fill('hello@example.com');

    await expect(page.getByTestId('contact-form-email-valid')).toBeVisible();
    await expect(page.getByTestId('contact-form-email-error')).toBeHidden();
    await expect(email).toHaveAttribute('aria-invalid', 'false');
  });

  test('submits successfully when everything is valid', async ({ page }) => {
    await page.getByTestId('contact-form-firstname').fill('Ada');
    await page.getByTestId('contact-form-lastname').fill('Lovelace');
    await page.getByTestId('contact-form-email').fill('ada@example.com');
    await page.getByTestId('contact-form-submit').click();

    await expect(page.getByTestId('contact-form-status')).toBeVisible();
    await expect(page.getByTestId('contact-form-status')).toContainText(
      'Thanks for signing up',
    );
  });
});
