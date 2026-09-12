import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.leonardo.ai/');
  await page.getByRole('button', { name: 'Designers' }).click();
  await page.getByRole('button', { name: 'Animators' }).click();
  await page.getByRole('button', { name: 'Photographers' }).click();
  await page.getByRole('button', { name: 'Marketers' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Tutorial', exact: true }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Start now' }).click();
  await page1.getByRole('link', { name: 'Image', exact: true }).click();
  await page1.goto('https://app.leonardo.ai/');
  await page1.getByRole('link', { name: 'GPT Image 2.5 Sunburst' }).click();
  await page1.getByRole('button', { name: 'Google' }).click();
  await page1.getByRole('textbox', { name: 'Email or phone' }).fill('badarurrehman6@gmail.com');
  await page1.getByRole('button', { name: 'Next' }).click();
  await page1.getByRole('link', { name: 'Try again' }).click();
  await page1.getByRole('textbox', { name: 'Email or phone' }).click();
  await page1.getByRole('textbox', { name: 'Email or phone' }).fill('badarurrehman6@gmail.com');
  await page1.getByRole('button', { name: 'Next' }).click();
});