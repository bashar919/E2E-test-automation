// pages/LoggedInPage.js
// Page Object for the Sauce Demo inventory (post-login) page.

const { expect } = require('@playwright/test');

class LoggedInPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Locators ────────────────────────────────────────────────
    this.pageTitle          = page.locator('.title');
    this.inventoryItems     = page.locator('.inventory_item');
    this.shoppingCartIcon   = page.locator('#shopping_cart_container');
    this.cartBadge          = page.locator('.shopping_cart_badge');
    this.burgerMenuButton   = page.locator('#react-burger-menu-btn');
    this.logoutLink         = page.locator('#logout_sidebar_link');
  }

  // ── Assertions ──────────────────────────────────────────────

  async expectInventoryPageLoaded() {
    await expect(this.pageTitle).toHaveText('Products', { timeout: 10_000 });
  }

  async expectProductCardsVisible() {
    await expect(this.inventoryItems.first()).toBeVisible({ timeout: 10_000 });
  }

  async expectProductCount(count) {
    await expect(this.inventoryItems).toHaveCount(count);
  }

  async expectShoppingCartVisible() {
    await expect(this.shoppingCartIcon).toBeVisible();
  }

  async expectUrlIsInventory() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  // ── Actions ─────────────────────────────────────────────────

  /**
   * Open the side-bar menu and click Logout.
   * After logout we land back on the login page.
   */
  async logout() {
    await this.burgerMenuButton.click();
    await expect(this.logoutLink).toBeVisible({ timeout: 5_000 });
    await this.logoutLink.click();
    // Verify we are back on the login page.
    await expect(this.page).toHaveURL(/\//, { timeout: 10_000 });
  }

  /**
   * Click the shopping-cart icon (navigates to cart page).
   */
  async openCart() {
    await this.shoppingCartIcon.click();
  }
}

module.exports = { LoggedInPage };
