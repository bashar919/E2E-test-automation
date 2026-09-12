// tests/checkout.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Checkout E2E tests for Sauce Demo.
// Covers the full purchase flow: add → cart → checkout → confirmation.
// All DOM interactions go through Page Objects — no raw selectors here.
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('../utilities/fixtures');
const { credentials, products, checkoutInfo, errorMessages } = require('../utilities/test-data.json');

// ── Shared setup: log in and add items to cart ──────────────────────────────
test.beforeEach(async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(credentials.standardUser.username, credentials.standardUser.password);
  await inventoryPage.expectPageLoaded();
});

// ═══════════════════════════════════════════════════════════════════════════
// FULL CHECKOUT FLOW
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Full Checkout Flow', () => {

  test('should complete checkout with a single item', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();

    await cartPage.expectPageLoaded();
    await cartPage.expectItemCount(1);
    await cartPage.proceedToCheckout();

    // Step 1: Your Information
    await checkoutPage.expectStepOneLoaded();
    await checkoutPage.submitInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode,
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
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.addToCart(products.fleeceJacket);
    await inventoryPage.openCart();

    await cartPage.expectItemCount(3);
    await cartPage.proceedToCheckout();

    await checkoutPage.submitInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode,
    );

    await checkoutPage.expectStepTwoLoaded();
    await checkoutPage.expectItemCount(3);
    await checkoutPage.finishCheckout();

    await checkoutPage.expectCheckoutComplete();
  });

  test('should return to inventory from the completion page', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.onesie);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.submitInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode,
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
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation('', checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(errorMessages.firstNameRequired);
  });

  test('should show error when last name is empty', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(checkoutInfo.firstName, '', checkoutInfo.postalCode);
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(errorMessages.lastNameRequired);
  });

  test('should show error when postal code is empty', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation(checkoutInfo.firstName, checkoutInfo.lastName, '');
    await checkoutPage.continueToOverview();

    await checkoutPage.expectError(errorMessages.postalCodeRequired);
  });

  test('should cancel checkout and return to cart', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.expectStepOneLoaded();
    await checkoutPage.cancel();

    await cartPage.expectPageLoaded();
  });
});
