const { test, expect } = require('@playwright/test');

test('take a screenshot of the page', async ({ page }) => {
  // Go to the practice login page
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  // Take a full-page screenshot and save it to the project folder
  await page.screenshot({
    path: 'practice-login-page.png',
    fullPage: true // This is the key part for a full-page shot
  });
});