// utilities/constants.js
// Backward-compatibility shim — re-exports test-data.json with
// UPPER_CASE aliases.  New code should import test-data.json directly.

const data = require('./test-data.json');

module.exports = {
  CREDENTIALS:    data.credentials,
  INVALID:        data.invalid,
  PRODUCTS:       data.products,
  CHECKOUT_INFO:  data.checkoutInfo,
  ERROR_MESSAGES: data.errorMessages,
};
