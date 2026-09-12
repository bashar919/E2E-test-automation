// pages/CartPage.js
// Page Object for the Sauce Demo shopping-cart page (/cart.html).

const { expect } = require('@playwright/test');

class CartPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // ── Locators ────────────────────────────────────────────────
    this.pageTitle          = page.locator('.title');
    this.cartItems          = page.locator('.cart_item');
    this.continueShoppingBtn = page.locator('#continue-shopping');
    this.checkoutButton     = page.locator('#checkout');
  }

  // ── Scoped item helpers ─────────────────────────────────────

  /** Return a locator scoped to the cart item containing `productName`. */
  _item(productName) {
    return this.cartItems.filter({ hasText: productName });
  }

  /** "Remove" button scoped to a specific item. */
  _removeButton(productName) {
    return this._item(productName).locator('button.cart_button');
  }

  // ── Assertions ──────────────────────────────────────────────

  async expectPageLoaded() {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async expectItemCount(count) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectProductInCart(productName) {
    await expect(this._item(productName)).toBeVisible();
  }

  async expectProductNotInCart(productName) {
    await expect(this._item(productName)).toHaveCount(0);
  }

  async expectCheckoutButtonVisible() {
    await expect(this.checkoutButton).toBeVisible();
  }

  // ── Actions ─────────────────────────────────────────────────

  async removeProduct(productName) {
    await this._removeButton(productName).click();
  }

  async continueShopping() {
    await this.continueShoppingBtn.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
