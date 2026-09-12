// pages/InventoryPage.js
// Page Object for the Sauce Demo product-inventory page (/inventory.html).

const { expect } = require('@playwright/test');

class InventoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // ── Locators ────────────────────────────────────────────────
    this.pageTitle        = page.locator('.title');
    this.inventoryItems   = page.locator('.inventory_item');
    this.shoppingCartIcon = page.locator('#shopping_cart_container');
    this.cartBadge        = page.locator('.shopping_cart_badge');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink       = page.locator('#logout_sidebar_link');
    this.sortDropdown     = page.locator('[data-test="product_sort_container"]');
  }

  // ── Assertions ──────────────────────────────────────────────

  async expectPageLoaded() {
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

  async expectCartBadgeShows(count) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeHidden() {
    await expect(this.cartBadge).toBeHidden();
  }

  async expectUrlIsInventory() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  // ── Actions ─────────────────────────────────────────────────

  /**
   * Click the "Add to cart" button for a product by its exact name.
   */
  async addToCart(productName) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button.btn_inventory').click();
  }

  /**
   * Remove a previously-added product from the cart (from the inventory page).
   */
  async removeFromCartOnInventory(productName) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button.btn_inventory').click();
  }

  /**
   * Click the product name link to navigate to the detail page.
   */
  async openProductDetail(productName) {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('.inventory_item_name').click();
  }

  /**
   * Navigate to the shopping cart.
   */
  async openCart() {
    await this.shoppingCartIcon.click();
  }

  /**
   * Select a sort option from the dropdown (e.g. 'lohi', 'hilo', 'az', 'za').
   */
  async sortBy(value) {
    await this.sortDropdown.selectOption(value);
  }

  /**
   * Open the side-bar menu and click Logout.
   */
  async logout() {
    await this.burgerMenuButton.click();
    await expect(this.logoutLink).toBeVisible({ timeout: 5_000 });
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\//, { timeout: 10_000 });
  }
}

module.exports = { InventoryPage };
