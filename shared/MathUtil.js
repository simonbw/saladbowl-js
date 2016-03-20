/**
 * Math utility functions.
 */

/**
 * Proper modulo. Guranteed to between 0 and b.
 * @param a
 * @param b
 * @returns {number}
 */
exports.mod = function (a, b) {
  return ((a % b) + b) % b;
};