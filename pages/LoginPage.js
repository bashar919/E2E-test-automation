// pages/LoginPage.js
// Page Object for Sauce Demo — https://www.saucedemo.com/

const { expect } = require('@playwright/test');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Locators ────────────────────────────────────────────────
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('#login-button');
    this.errorBanner   = page.locator('[data-test="error"]');
  }

  // ── Navigation ──────────────────────────────────────────────

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.usernameInput).toBeVisible({ timeout: 15_000 });
  }

  // ── Actions ─────────────────────────────────────────────────

  /**
   * Fill credentials and click Login.
   * The caller decides what to assert afterwards.
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Click the Login button without filling any fields.
   */
  async submitEmpty() {
    await this.loginButton.click();
  }

  /**
   * Clear both input fields (useful for retry scenarios).
   */
  async clearFields() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  // ── Assertions ──────────────────────────────────────────────

  async expectErrorVisible() {
    await expect(this.errorBanner).toBeVisible();
  }

  async expectErrorMessageToContain(text) {
    await expect(this.errorBanner).toContainText(text);
  }

  async expectErrorHidden() {
    await expect(this.errorBanner).toBeHidden();
  }

  async expectPasswordFieldEmpty() {
    await expect(this.passwordInput).toHaveValue('');
  }

  async expectUsernameFieldEmpty() {
    await expect(this.usernameInput).toHaveValue('');
  }
}

module.exports = { LoginPage };
