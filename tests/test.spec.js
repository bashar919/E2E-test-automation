test('login test', async ({ page }) => {
  await page.goto('https://thinkexam.com/login');
  await page.fill('#username', 'admin');
  await page.fill('#password', '1234');
  await page.click('#login');

  await expect(page).toHaveURL(/dashboard/);  // ✅ now we're actually testing
});