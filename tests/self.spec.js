import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://client.getklarity.io/self-onboarding/form');
  await page.getByRole('textbox', { name: 'e.g. Sarah', exact: true }).click();
  await page.getByRole('textbox', { name: 'e.g. Sarah', exact: true }).fill('vladimir');
  await page.getByRole('textbox', { name: 'e.g. Sarah', exact: true }).press('Tab');
  await page.getByRole('textbox', { name: 'e.g. Johnson' }).fill('test');
  await page.getByRole('textbox', { name: 'e.g. Johnson' }).press('Tab');
  await page.getByRole('textbox', { name: 'e.g. sarah@acme.com' }).fill('vladtest121@yopmail.com');
  await page.getByRole('textbox', { name: 'Enter phone number' }).click();
  await page.getByRole('textbox', { name: 'Enter phone number' }).fill('+44 7748 5559451');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'No, Outside UK' }).click();
  await page.getByRole('textbox', { name: 'e.g. Acme Corporation' }).click();
  await page.getByRole('textbox', { name: 'e.g. Acme Corporation' }).fill('Aon');
  await page.getByRole('textbox', { name: 'e.g. United States, Canada' }).click();
  await page.getByRole('textbox', { name: 'e.g. United States, Canada' }).fill('Saudia arabia ');
  await page.getByRole('spinbutton', { name: 'e.g.' }).click();
  await page.getByRole('spinbutton', { name: 'e.g.' }).fill('70');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Return to Home' }).click();
});