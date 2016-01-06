var helpers = {};
module.exports = helpers;

/**
 *
 * @param a
 * @returns {boolean}
 */
helpers.not = function (a) {
  return !a;
};

/**
 * @param a
 * @param b
 * @returns {*}
 */
helpers.and = function (a, b) {
  return a && b;
};

/**
 * @param a
 * @param b
 * @returns {*}
 */
helpers.or = function (a, b) {
  return a || b;
};