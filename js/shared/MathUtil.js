'use strict';

/**
 * Math utility functions.
 */

/**
 * Proper modulo. Guaranteed to between 0 and b.
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
exports.mod = (a, b) => {
  return ((a % b) + b) % b;
};

/**
 * Return the sum of an array of numbers.
 * @param a {Array.<number>}
 * @returns {number}
 */
exports.sum = (a) => {
  var sum = 0;
  for (var i = 0; i < a.length; i++) {
    sum += a[i];
  }
  return sum;
};

/**
 * Clamp the value to the bounds min and max
 * @param value {number}
 * @param min {number}
 * @param max {number}
 * @returns {number}
 */
exports.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};