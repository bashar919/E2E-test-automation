// pages/ProductDetailPage.js
// Page Object for the Sauce Demo single-product page (/inventory-item.html).

const { expect } = require('@playwright/test');

class ProductDetailPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // ── Locators ────────────────────────────────────────────────
    this.productImage       = page.locator('.inventory_details_img');
    this.productName        = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice       = page.locator('.inventory_details_price');
    this.addToCartButton    = page.locator('#add-to-cart');
    this.removeFromCartBtn  = page.locator('#remove');
    this.backToProductsBtn  = page.locator('#back-to-products');
    this.shoppingCartIcon   = page.locator('#shopping_cart_container');
  }

  // ── Assertions ──────────────────────────────────────────────

  async expectProductNameIs(name) {
    await expect(this.productName).toHaveText(name);
  }

  async expectPriceVisible() {
    await expect(this.productPrice).toBeVisible();
  }

  async expectAddToCartButtonVisible() {
    await expect(this.addToCartButton).toBeVisible();
  }

  async expectRemoveButtonVisible() {
    await expect(this.removeFromCartBtn).toBeVisible();
  }

  // ── Actions ─────────────────────────────────────────────────

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeFromCartBtn.click();
  }

  async goBackToProducts() {
    await this.backToProductsBtn.click();
  }

  async openCart() {
    await this.shoppingCartIcon.click();
  }
}

module.exports = { ProductDetailPage };
