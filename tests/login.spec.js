// tests/login.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// Login & Logout E2E tests for Sauce Demo.
// All DOM interactions go through Page Objects — no raw selectors here.
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('../utilities/fixtures');
const { CREDENTIALS, INVALID, ERROR_MESSAGES } = require('../utilities/constants');

// ═══════════════════════════════════════════════════════════════════════════
// VALID LOGIN
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Valid Login', () => {

  test('should log in with standard_user and land on inventory page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);

    await inventoryPage.expectPageLoaded();
    await inventoryPage.expectProductCardsVisible();
    await inventoryPage.expectUrlIsInventory();
  });

  test('should display 6 product cards after login', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);

    await inventoryPage.expectPageLoaded();
    await inventoryPage.expectProductCount(6);
  });

  test('should show the shopping cart icon on the inventory page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);

    await inventoryPage.expectPageLoaded();
    await inventoryPage.expectShoppingCartVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// INVALID LOGIN
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Invalid Login', () => {

  test('should show error when both username and password are wrong', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(INVALID.username, INVALID.password);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(ERROR_MESSAGES.credentialsMismatch);
  });

  test('should show error when password is incorrect', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.standardUser.username, INVALID.password);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(ERROR_MESSAGES.credentialsMismatch);
  });

  test('should show error when username is incorrect with valid password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(INVALID.username, CREDENTIALS.standardUser.password);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(ERROR_MESSAGES.credentialsMismatch);
  });

  test('should show error for locked-out user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.lockedOutUser.username, CREDENTIALS.lockedOutUser.password);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(ERROR_MESSAGES.lockedOut);
  });

  test('should remain on the login page after a failed attempt', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(INVALID.username, INVALID.password);

    await expect(page).toHaveURL(/saucedemo\.com/);
    await loginPage.expectErrorVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY FIELD VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Empty Fields', () => {

  test('should show error when both fields are empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.submitEmpty();

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(ERROR_MESSAGES.usernameRequired);
  });

  test('should show error when password is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.standardUser.username, '');

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(ERROR_MESSAGES.passwordRequired);
  });

  test('should show error when username is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginWithPasswordOnly(CREDENTIALS.standardUser.password);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(ERROR_MESSAGES.usernameRequired);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LOGOUT
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Logout', () => {

  test('should log out and return to the login page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);
    await inventoryPage.expectPageLoaded();

    await inventoryPage.logout();

    await loginPage.expectLoginFormVisible();
    await loginPage.expectUsernameFieldEmpty();
    await loginPage.expectPasswordFieldEmpty();
  });

  test('should allow logging back in after logout', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);
    await inventoryPage.expectPageLoaded();

    await inventoryPage.logout();

    await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);
    await inventoryPage.expectPageLoaded();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RETRY & EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Retry & Edge Cases', () => {

  test('should succeed on second attempt after initial failure', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();

    await loginPage.login(INVALID.username, INVALID.password);
    await loginPage.expectErrorVisible();

    await loginPage.clearFields();
    await loginPage.login(CREDENTIALS.standardUser.username, CREDENTIALS.standardUser.password);
    await inventoryPage.expectPageLoaded();
  });
});
