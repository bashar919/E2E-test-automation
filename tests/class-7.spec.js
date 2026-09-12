const { test, expect } = require('@playwright/test');

test('open login page @smoke @sanity', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');
  await expect(page).toHaveTitle(/Practice Test Automation/);
});

test('valid login @smoke @regression', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  await page.locator('#username').fill('student');
  await page.locator('#password').fill('Password123');
  await page.locator('#submit').click();

  await expect(page.locator('h1')).toContainText('Logged In Successfully');
});

test('wrong password error @sanity @regression', async ({ page }) => {
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  await page.locator('#username').fill('student');
  await page.locator('#password').fill('wrongPassword');
  await page.locator('#submit').click();

  await expect(page.locator('#error')).toContainText(
    'Your password is invalid!'
  );
});