'use strict';

interface MathUtilType {
  mod(a: number, b: number): number;
  sum(a: number[]): number;
  clamp(value: number, min: number, max: number): number;
  mean(a: number[]): number;
  median(a: number[]): number;
}

const MathUtil = {} as MathUtilType;

/**
 * Math utility functions.
 */

/**
 * Proper modulo. Guaranteed to between 0 and b.
 * @param a {number}
 * @param b {number}
 * @returns {number}
 */
MathUtil.mod = (a: number, b: number): number => {
  return ((a % b) + b) % b;
};

/**
 * Return the sum of an array of numbers.
 * @param a {Array.<number>}
 * @returns {number}
 */
MathUtil.sum = (a: number[]): number => {
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
MathUtil.clamp = function (value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
};

/**
 * Return the mean value of an array of numbers.
 * @param a {Array.<number>}
 * @returns {number}
 */
MathUtil.mean = (a: number[]): number => {
  return MathUtil.sum(a) / a.length;
};

/**
 * Return the median value of an array of numbers.
 * @param a {Array.<number>}
 * @returns {number}
 */
MathUtil.median = (a: number[]): number => {
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

export default MathUtil;
