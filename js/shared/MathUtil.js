'use strict';

/**
 * Math utility functions.
 */

/**
 * Proper modulo. Guranteed to between 0 and b.
 * @param a
 * @param b
 * @returns {number}
 */
exports.mod = (a, b) => {
  return ((a % b) + b) % b;
};

exports.sum = (a) => {
  var sum = 0;
  for (var i = 0; i < a.length; i++) {
    sum += a[i];
  }
  return sum;
};