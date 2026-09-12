// tests/cart.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Shopping Cart E2E tests for Sauce Demo.
// All DOM interactions go through Page Objects — no raw selectors here.
// ─────────────────────────────────────────────────────────────────────────────

const { test } = require('../utilities/fixtures');
const { credentials, products } = require('../utilities/test-data.json');

// ── Shared setup: log in before every test ──────────────────────────────────
test.beforeEach(async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(credentials.standardUser.username, credentials.standardUser.password);
  await inventoryPage.expectPageLoaded();
});

// ═══════════════════════════════════════════════════════════════════════════
// ADD TO CART
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Add to Cart', () => {

  test('should add a single item and show cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartBadgeShows(1);
  });

  test('should add multiple items and badge reflects count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);

    await inventoryPage.expectCartBadgeShows(2);
  });

  test('should show items in the cart page after adding from inventory', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.fleeceJacket);
    await inventoryPage.openCart();

    await cartPage.expectPageLoaded();
    await cartPage.expectItemCount(2);
    await cartPage.expectProductInCart(products.backpack);
    await cartPage.expectProductInCart(products.fleeceJacket);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// REMOVE FROM CART
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Remove from Cart', () => {

  test('should remove an item from the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.openCart();

    await cartPage.removeProduct(products.backpack);

    await cartPage.expectItemCount(1);
    await cartPage.expectProductNotInCart(products.backpack);
    await cartPage.expectProductInCart(products.bikeLight);
  });

  test('should remove item from inventory page after adding', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.expectCartBadgeShows(1);

    await inventoryPage.removeFromCartOnInventory(products.backpack);

    // Badge disappears entirely when cart is empty.
    await inventoryPage.expectCartBadgeHidden();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Cart Navigation', () => {

  test('should navigate from cart back to inventory via Continue Shopping', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.openCart();
    await cartPage.expectPageLoaded();

    await cartPage.continueShopping();
    await inventoryPage.expectPageLoaded();
  });

  test('should navigate to cart and see checkout button', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
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
    await inventoryPage.openProductDetail(products.fleeceJacket);

    await productDetailPage.expectProductNameIs(products.fleeceJacket);
    await productDetailPage.expectPriceVisible();
    await productDetailPage.addToCart();
    await productDetailPage.expectRemoveButtonVisible();

    await productDetailPage.openCart();
    await cartPage.expectProductInCart(products.fleeceJacket);
  });

  test('should go back to products from detail page', async ({ inventoryPage, productDetailPage }) => {
    await inventoryPage.openProductDetail(products.backpack);
    await productDetailPage.expectProductNameIs(products.backpack);

    await productDetailPage.goBackToProducts();
    await inventoryPage.expectPageLoaded();
  });
});
