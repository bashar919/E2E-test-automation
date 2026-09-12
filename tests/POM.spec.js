// tests/POM.spec.js
// ─────────────────────────────────────────────────────────────────────────────
// End-to-End test suite for Sauce Demo (https://www.saucedemo.com/).
// Follows the Page Object Model (POM) pattern.
//
// Project layout:
//   pages/        → LoginPage, LoggedInPage  (locators + actions)
//   utilities/    → Custom test fixtures     (DI for page objects)
//   tests/        → This file                (scenarios only, no DOM access)
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('../utilities/fixtures');

// ── Shared credentials ──────────────────────────────────────────────────────
const VALID_USER     = 'standard_user';
const VALID_PASSWORD = 'secret_sauce';
const BAD_USER       = 'invalid_user';
const BAD_PASSWORD   = 'wrong_password';

// ═══════════════════════════════════════════════════════════════════════════
// 1. VALID LOGIN FLOW
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Valid Login', () => {

  test('should log in with standard_user and land on inventory page', async ({ loginPage, loggedInPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASSWORD);

    await loggedInPage.expectInventoryPageLoaded();
    await loggedInPage.expectProductCardsVisible();
    await loggedInPage.expectUrlIsInventory();
  });

  test('should display 6 product cards after login', async ({ loginPage, loggedInPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASSWORD);

    await loggedInPage.expectInventoryPageLoaded();
    await loggedInPage.expectProductCount(6);
  });

  test('should show the shopping cart icon on the inventory page', async ({ loginPage, loggedInPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASSWORD);

    await loggedInPage.expectInventoryPageLoaded();
    await loggedInPage.expectShoppingCartVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. INVALID LOGIN / ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Invalid Login', () => {

  test('should show error when both username and password are wrong', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(BAD_USER, BAD_PASSWORD);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(
      'Username and password do not match any user in this service'
    );
  });

  test('should show error when password is incorrect', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER, BAD_PASSWORD);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(
      'Username and password do not match any user in this service'
    );
  });

  test('should show error when username is incorrect with valid password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(BAD_USER, VALID_PASSWORD);

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain(
      'Username and password do not match any user in this service'
    );
  });

  test('should remain on the login page after a failed attempt', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(BAD_USER, BAD_PASSWORD);

    await expect(page).toHaveURL(/saucedemo\.com/);
    await loginPage.expectErrorVisible();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. EMPTY FIELD VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Empty Fields', () => {

  test('should show error when both fields are empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.submitEmpty();

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain('Username is required');
  });

  test('should show error when password is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER, '');

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain('Password is required');
  });

  test('should show error when username is empty', async ({ loginPage }) => {
    await loginPage.goto();
    // Fill only the password, leave username blank.
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();

    await loginPage.expectErrorVisible();
    await loginPage.expectErrorMessageToContain('Username is required');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. LOGOUT FLOW
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Logout', () => {

  test('should log out and return to the login page', async ({ loginPage, loggedInPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await loggedInPage.expectInventoryPageLoaded();

    await loggedInPage.logout();

    // Back on login page — verify the form is visible and fields are empty.
    await expect(loginPage.usernameInput).toBeVisible();
    await loginPage.expectUsernameFieldEmpty();
    await loginPage.expectPasswordFieldEmpty();
  });

  test('should allow logging back in after logout', async ({ loginPage, loggedInPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await loggedInPage.expectInventoryPageLoaded();

    await loggedInPage.logout();

    // Re-login with the same credentials.
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await loggedInPage.expectInventoryPageLoaded();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. RETRY & EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════

test.describe('Retry & Edge Cases', () => {

  test('should succeed on second attempt after initial failure', async ({ loginPage, loggedInPage }) => {
    await loginPage.goto();

    // First attempt — wrong credentials.
    await loginPage.login(BAD_USER, BAD_PASSWORD);
    await loginPage.expectErrorVisible();

    // Clear and retry with correct credentials.
    await loginPage.clearFields();
    await loginPage.login(VALID_USER, VALID_PASSWORD);
    await loggedInPage.expectInventoryPageLoaded();
  });

  test('should clear error message after successful retry', async ({ loginPage, loggedInPage }) => {
    await loginPage.goto();

    await loginPage.login(BAD_USER, BAD_PASSWORD);
    await loginPage.expectErrorVisible();

    await loginPage.clearFields();
    await loginPage.login(VALID_USER, VALID_PASSWORD);

    // On the inventory page the login error banner must not be present.
    await loggedInPage.expectInventoryPageLoaded();
  });
});
