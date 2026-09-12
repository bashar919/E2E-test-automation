// tests/cart.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Shopping Cart E2E tests for Sauce Demo.
// All DOM interactions go through Page Objects — no raw selectors here.
// ─────────────────────────────────────────────────────────────────────────────

const { test } = require('../utilities/fixtures');
const { CREDENTIALS, PRODUCTS } = require('../utilities/constants');

// ── Shared setup: log in before every test ──────────────────────────────────
test.beforeEach(async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);
  await inventoryPage.expectPageLoaded();
});

// ═══════════════════════════════════════════════════════════════════════════
// ADD TO CART
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Add to Cart', () => {

  test('should add a single item and show cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.expectCartBadgeShows(1);
  });

  test('should add multiple items and badge reflects count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.bikeLight);

    await inventoryPage.expectCartBadgeShows(2);
  });

  test('should show items in the cart page after adding from inventory', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.fleeceJacket);
    await inventoryPage.openCart();

    await cartPage.expectPageLoaded();
    await cartPage.expectItemCount(2);
    await cartPage.expectProductInCart(PRODUCTS.backpack);
    await cartPage.expectProductInCart(PRODUCTS.fleeceJacket);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// REMOVE FROM CART
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Remove from Cart', () => {

  test('should remove an item from the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await inventoryPage.openCart();

    await cartPage.removeProduct(PRODUCTS.backpack);

    await cartPage.expectItemCount(1);
    await cartPage.expectProductNotInCart(PRODUCTS.backpack);
    await cartPage.expectProductInCart(PRODUCTS.bikeLight);
  });

  test('should remove item from inventory page after adding', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.expectCartBadgeShows(1);

    await inventoryPage.removeFromCartOnInventory(PRODUCTS.backpack);

    // Badge disappears entirely when cart is empty.
    await inventoryPage.expectCartBadgeHidden();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Cart Navigation', () => {

  test('should navigate from cart back to inventory via Continue Shopping', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.expectPageLoaded();

    await cartPage.continueShopping();
    await inventoryPage.expectPageLoaded();
  });

  test('should navigate to cart and see checkout button', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();

    await cartPage.expectPageLoaded();
    await cartPage.expectCheckoutButtonVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT DETAIL → CART
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Product Detail Page', () => {

  test('should open product detail, add to cart, and verify in cart', async ({ inventoryPage, productDetailPage, cartPage }) => {
    await inventoryPage.openProductDetail(PRODUCTS.fleeceJacket);

    await productDetailPage.expectProductNameIs(PRODUCTS.fleeceJacket);
    await productDetailPage.expectPriceVisible();
    await productDetailPage.addToCart();
    await productDetailPage.expectRemoveButtonVisible();

    await productDetailPage.openCart();
    await cartPage.expectProductInCart(PRODUCTS.fleeceJacket);
  });

  test('should go back to products from detail page', async ({ inventoryPage, productDetailPage }) => {
    await inventoryPage.openProductDetail(PRODUCTS.backpack);
    await productDetailPage.expectProductNameIs(PRODUCTS.backpack);

    await productDetailPage.goBackToProducts();
    await inventoryPage.expectPageLoaded();
  });
});
