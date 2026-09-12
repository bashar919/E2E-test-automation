// pages/CheckoutPage.js
// Page Object covering all three Sauce Demo checkout steps plus the
// completion page.  One class keeps the flow cohesive; each step's
// methods are grouped under labelled sections.

const { expect } = require('@playwright/test');

class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // ── Step 1: Your Information ────────────────────────────────
    this.firstNameInput  = page.locator('#first-name');
    this.lastNameInput   = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.cancelBtn       = page.locator('#cancel');
    this.continueBtn     = page.locator('#continue');
    this.errorBanner     = page.locator('[data-test="error"]');

    // ── Step 2: Overview ────────────────────────────────────────
    this.checkoutItems      = page.locator('.cart_item');
    this.paymentInfo        = page.locator('[data-test="payment-info-label"]');
    this.shippingInfo       = page.locator('[data-test="shipping-info-label"]');
    this.totalPriceLabel    = page.locator('[data-test="total-label"]');
    this.subtotalLabel      = page.locator('[data-test="subtotal-label"]');

    // ── Complete ────────────────────────────────────────────────
    this.completeHeader     = page.locator('[data-test="complete-header"]');
    this.completeText       = page.locator('[data-test="complete-text"]');
    this.backHomeButton     = page.locator('#back-to-products');
  }

  // ══════════════════════════════════════════════════════════════
  // Step 1 — Your Information
  // ══════════════════════════════════════════════════════════════

  async expectStepOneLoaded() {
    await expect(this.firstNameInput).toBeVisible({ timeout: 10_000 });
  }

  async fillInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueBtn.click();
  }

  /**
   * Fill and proceed in one call.
   */
  async submitInformation(firstName, lastName, postalCode) {
    await this.fillInformation(firstName, lastName, postalCode);
    await this.continueToOverview();
  }

  async expectError(text) {
    await expect(this.errorBanner).toBeVisible();
    await expect(this.errorBanner).toContainText(text);
  }

  async cancel() {
    await this.cancelBtn.click();
  }

  // ══════════════════════════════════════════════════════════════
  // Step 2 — Overview
  // ══════════════════════════════════════════════════════════════

  async expectStepTwoLoaded() {
    await expect(this.page.locator('.title')).toHaveText('Checkout: Overview');
  }

  async expectItemCount(count) {
    await expect(this.checkoutItems).toHaveCount(count);
  }

  async expectTotalPriceVisible() {
    await expect(this.totalPriceLabel).toBeVisible();
  }

  async finishCheckout() {
    await this.page.locator('#finish').click();
  }

  // ══════════════════════════════════════════════════════════════
  // Complete
  // ══════════════════════════════════════════════════════════════

  async expectCheckoutComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!', { timeout: 10_000 });
  }

  async expectCompleteTextVisible() {
    await expect(this.completeText).toBeVisible();
  }

  async goBackHome() {
    await this.backHomeButton.click();
  }
}

module.exports = { CheckoutPage };
