var helpers = module.exports;

/**
 * Returns a == b.
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
helpers.equal = function (a, b) {
  return a == b;
};

/**
 * @param a
 * @param b
 * @returns {boolean}
 */
helpers.lessThan = function (a, b) {
  return a < b;
};

/**
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
helpers.lessThanEqual = function (a, b) {
  return a <= b;
};

/**
 * @param a
 * @param b
 * @returns {boolean}
 */
helpers.greaterThan = function (a, b) {
  return a > b;
};

/**
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
helpers.greaterThanEqual = function (a, b) {
  return a >= b;
};