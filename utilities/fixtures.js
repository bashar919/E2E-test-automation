// utilities/fixtures.js
// Custom Playwright test fixtures that inject Page Object instances.
// Tests import `test` from here instead of '@playwright/test' to get
// ready-to-use page objects without boilerplate.

const basePlaywright   = require('@playwright/test');
const base             = basePlaywright.test;

const { LoginPage }       = require('../pages/LoginPage');
const { InventoryPage }   = require('../pages/InventoryPage');
const { ProductDetailPage } = require('../pages/ProductDetailPage');
const { CartPage }        = require('../pages/CartPage');
const { CheckoutPage }    = require('../pages/CheckoutPage');

/**
 * Extend the built-in test fixtures with every page object.
 *
 * Usage inside a test:
 *   test('example', async ({ loginPage, inventoryPage }) => { ... });
 */
const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

// Re-export expect so tests only need one import source.
const { expect } = base;

module.exports = { test, expect };
