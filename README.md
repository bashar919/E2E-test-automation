# Sauce Demo — E2E Test Suite

Playwright end-to-end tests for [Sauce Demo](https://www.saucedemo.com/), structured with the **Page Object Model** pattern.

## Project Structure

```
AUTo_TEST/
├── pages/                     Page Object classes (locators + actions)
│   ├── LoginPage.js           Login form (/)
│   ├── InventoryPage.js       Product listing (/inventory.html)
│   ├── ProductDetailPage.js   Single product (/inventory-item.html)
│   ├── CartPage.js            Shopping cart (/cart.html)
│   └── CheckoutPage.js        Checkout steps 1–3 + confirmation
├── tests/                     Test scenarios (POM only — no raw selectors)
│   ├── login.spec.js          Login, logout, validation, retry
│   ├── cart.spec.js           Add/remove items, cart badge, navigation
│   └── checkout.spec.js       Full purchase flow, form validation
├── utilities/
│   ├── fixtures.js            Custom Playwright fixtures (DI for page objects)
│   └── constants.js           Shared credentials, product names, messages
├── playwright.config.js       Playwright configuration
├── package.json               NPM scripts and dependencies
└── README.md                  This file
```

## Prerequisites

- **Node.js** ≥ 20
- **Playwright browsers** installed:

```bash
npm install
npx playwright install
```

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests across all configured browsers |
| `npm run test:login` | Login & logout tests only |
| `npm run test:cart` | Shopping cart tests only |
| `npm run test:checkout` | Checkout flow tests only |
| `npm run test:headed` | All tests in headed browser mode |
| `npm run test:ui` | All tests in Playwright UI mode |
| `npm run report` | Open the HTML test report |

### Run on a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Credentials

Defined in `utilities/constants.js`:

| User | Username | Password |
|---|---|---|
| Standard | `standard_user` | `secret_sauce` |
| Locked Out | `locked_out_user` | `secret_sauce` |
| Problem | `problem_user` | `secret_sauce` |
| Performance | `performance_glitch_user` | `secret_sauce` |

## Architecture Principles

1. **No raw selectors in tests.** All `page.locator()`, `page.getByRole()`, etc. live inside `pages/` classes.
2. **Fixtures for injection.** Tests receive page objects via destructured parameters (`{ loginPage, inventoryPage }`).
3. **Centralised data.** Credentials, product names, and error messages are in `utilities/constants.js`.
4. **Explicit waits.** Page objects use `expect().toBeVisible()` with timeouts before acting on elements.
5. **Semantic assertions.** Each page class exposes `expect*()` methods that read like specifications.
