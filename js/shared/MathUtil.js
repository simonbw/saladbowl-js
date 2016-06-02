'use strict';
// @flow

const MathUtil = module.exports;

/**
 * Math utility functions.
 */

/**
 * Proper modulo. Guaranteed to between 0 and b.
 */
MathUtil.mod = (a:number, b:number):number => {
  return ((a % b) + b) % b;
};

/**
 * Return the sum of an array of numbers.
 */
MathUtil.sum = (a:Array<number>):number => {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i];
  }
  return sum;
};

/**
 * Clamp the value to the bounds min and max
 */
MathUtil.clamp = function (value:number, min:number, max:number):number {
  return Math.min(Math.max(value, min), max);
};

/**
 * Return the mean value of an array of numbers.
 */
MathUtil.mean = (a:Array<number>):number => {
  return MathUtil.sum(a) / a.length;
};

/**
 * Return the median value of an array of numbers.
 */
MathUtil.median = (a:Array<number>):number => {
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
