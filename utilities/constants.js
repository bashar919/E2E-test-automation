// utilities/constants.js
// Centralised test data — credentials, product names, checkout info.
// Every spec file should import from here instead of hardcoding values.

const CREDENTIALS = {
  standardUser:     { username: 'standard_user',     password: 'secret_sauce' },
  lockedOutUser:    { username: 'locked_out_user',   password: 'secret_sauce' },
  problemUser:      { username: 'problem_user',      password: 'secret_sauce' },
  performanceUser:  { username: 'performance_glitch_user', password: 'secret_sauce' },
};

const INVALID = {
  username: 'invalid_user',
  password: 'wrong_password',
};

const PRODUCTS = {
  backpack:           'Sauce Labs Backpack',
  bikeLight:          'Sauce Labs Bike Light',
  boltTShirt:         'Sauce Labs Bolt T-Shirt',
  fleeceJacket:       'Sauce Labs Fleece Jacket',
  onesie:             'Sauce Labs Onesie',
  redTShirt:          'Test.allTheThings() T-Shirt (Red)',
};

const CHECKOUT_INFO = {
  firstName:  'Vladimir',
  lastName:   'Testov',
  postalCode: 'EC1A 1BB',
};

const ERROR_MESSAGES = {
  usernameRequired: 'Username is required',
  passwordRequired: 'Password is required',
  credentialsMismatch: 'Username and password do not match any user in this service',
  lockedOut: 'Sorry, this user has been locked out',
  firstNameRequired: 'First Name is required',
  lastNameRequired:  'Last Name is required',
  postalCodeRequired: 'Postal Code is required',
};

module.exports = {
  CREDENTIALS,
  INVALID,
  PRODUCTS,
  CHECKOUT_INFO,
  ERROR_MESSAGES,
};
