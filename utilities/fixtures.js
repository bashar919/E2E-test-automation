// utilities/fixtures.js
// Custom Playwright test fixtures that inject Page Object instances.
// Tests import `test` from here instead of '@playwright/test' to get
// ready-to-use page objects without boilerplate.

const basePlaywright = require('@playwright/test');
const base = basePlaywright.test;
const { LoginPage }    = require('../pages/LoginPage');
const { LoggedInPage } = require('../pages/LoggedInPage');

/**
 * Extend the built-in test fixtures with our page objects.
 *
 * Usage inside a test:
 *   test('example', async ({ loginPage, loggedInPage }) => { ... });
 */
const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  loggedInPage: async ({ page }, use) => {
    const loggedInPage = new LoggedInPage(page);
    await use(loggedInPage);
  },
});

// Re-export expect so tests only need one import source.
const { expect } = base;

module.exports = { test, expect };
