// tests/checkout.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Checkout E2E tests for Sauce Demo.
// Covers the full purchase flow: add → cart → checkout → confirmation.
// All DOM interactions go through Page Objects — no raw selectors here.
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('../utilities/fixtures');
const { CREDENTIALS, PRODUCTS, CHECKOUT_INFO, ERROR_MESSAGES } = require('../utilities/constants');

// ── Shared setup: log in and add items to cart ──────────────────────────────
test.beforeEach(async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);
  await inventoryPage.expectPageLoaded();
});

// ═══════════════════════════════════════════════════════════════════════════
// FULL CHECKOUT FLOW
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Full Checkout Flow', () => {

  test('should complete checkout with a single item', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();

    await cartPage.expectPageLoaded();
    await cartPage.expectItemCount(1);
    await cartPage.proceedToCheckout();

    // Step 1: Your Information
    await checkoutPage.expectStepOneLoaded();
    await checkoutPage.submitInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode,
    );

    // Step 2: Overview
    await checkoutPage.expectStepTwoLoaded();
    await checkoutPage.expectItemCount(1);
    await checkoutPage.expectTotalPriceVisible();
    await checkoutPage.finishCheckout();

    // Complete
    await checkoutPage.expectCheckoutComplete();
    await checkoutPage.expectCompleteTextVisible();
  });

  test('should complete checkout with multiple items', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await inventoryPage.addToCart(PRODUCTS.fleeceJacket);
    await inventoryPage.openCart();

    await cartPage.expectItemCount(3);
    await cartPage.proceedToCheckout();

    await checkoutPage.submitInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode,
    );

    await checkoutPage.expectStepTwoLoaded();
    await checkoutPage.expectItemCount(3);
    await checkoutPage.finishCheckout();

    await checkoutPage.expectCheckoutComplete();
  });

  test('should return to inventory from the completion page', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.onesie);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.submitInformation(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode,
    );
    await checkoutPage.finishCheckout();
    await checkoutPage.expectCheckoutComplete();

    await checkoutPage.goBackHome();
    await inventoryPage.expectPageLoaded();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CHECKOUT VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Checkout Validation', () => {

  test('should show error when first name is empty', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation('', CHECKOUT_INFO.lastName, CHECKOUT_INFO.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(ERROR_MESSAGES.firstNameRequired);
  });

  test('should show error when last name is empty', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(CHECKOUT_INFO.firstName, '', CHECKOUT_INFO.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(ERROR_MESSAGES.lastNameRequired);
  });

  test('should show error when postal code is empty', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(CHECKOUT_INFO.firstName, CHECKOUT_INFO.lastName, '');
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(ERROR_MESSAGES.postalCodeRequired);
  });

  test('should cancel checkout and return to cart', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.expectStepOneLoaded();
    await checkoutPage.cancel();

    await cartPage.expectPageLoaded();
  });
});
