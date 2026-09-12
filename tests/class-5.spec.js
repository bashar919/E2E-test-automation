const { test, expect } = require('@playwright/test');

test('login using getByRole', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  // Username field — it's a textbox, and its name comes from the label
  await page.getByRole('textbox', { name: 'Username' }).fill('student');

  // Password field — password inputs don't have a textbox role,
  // so we use getByLabel here instead
  await page.getByLabel('Password').fill('Password123');

  // Submit button — it's a button with the name "Submit"
  await page.getByRole('button', { name: 'Submit' }).click();

  // Check we logged in — heading is also a role
  await expect(page.getByRole('heading', { name: 'Logged In Successfully' })).toBeVisible();
});
