'use strict';

const MathUtil = module.exports;

/**
 * Math utility functions.
 */

/**
 * Proper modulo. Guaranteed to between 0 and b.
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
MathUtil.mod = (a, b) => {
  return ((a % b) + b) % b;
};

/**
 * Return the sum of an array of numbers.
 * @param a {Array.<number>}
 * @returns {number}
 */
MathUtil.sum = (a) => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
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
MathUtil.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};

/**
 * Return the mean value of an array of numbers.
 * @param a {Array.<number>}
 * @returns {number}
 */
MathUtil.mean = (a) => {
  return MathUtil.sum(a) / a.length;
};

/**
 * Return the median value of an array of numbers.
 * @param a {Array.<number>}
 * @returns {number}
 */
MathUtil.median = (a) => {
  if (a.length == 0) {
    return NaN;
  }
  a = a.slice(0);
  a.sort((a, b) => a - b);
  if (a.length % 2 === 0) { // even
    return (a[a.length / 2 - 1] + a[a.length / 2]) / 2;
  } else {
    return a[Math.floor(a.length / 2)];
  }
};
