'use strict';
// @flow

const MathUtil = require('./MathUtil');


/**
 * Utility for doing things based on random numbers.
 */
const Random = module.exports;

// just for shorthand
const r = Math.random;

/**
 * Return a random number between min and max.
 */
Random.uniform = (min:?number, max:?number):number => {
  if (min == undefined) {
    return r();
  }
  if (max == undefined) {
    max = min;
    min = 0;
  }
  return (max - min) * r() + min;
};

/**
 * Return a random integer between min and max.
 */
Random.integer = (min:?number, max:?number):number => {
  return Math.floor(Random.uniform(min, max));
};

/**
 * Return a random number from a normal distribution.
 */
Random.normal = (mean:number, deviation:number):number => {
  if (mean == null) {
    mean = 0;
  }
  if (deviation == null) {
    deviation = 1;
  }
  return deviation * (r() + r() + r() + r() + r() + r() - 3) / 3 + mean;
};

/**
 * Return a random element from an array.
 */
Random.choose = () => {
  let options;
  options = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
  if (options.length === 1) {
    options = options[0];
  }
  return options[Random.integer(options.length)];
};

/**
 * Remove and return a random element from an array.
 */
Random.take = function <T>(options:Array<T>):T {
  return options.splice(Random.integer(options.length), 1)[0];
};

/**
 * Put an array into a random order.
 */
Random.shuffle = function <T>(a:Array<T>):Array<T> {
  let i, j, temp;
  i = a.length;
  while (--i > 0) {
    j = Random.integer(0, i + 1);
    temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }
  return a;
};

/**
 * Put an array into a deterministically random order.
 */
Random.seededShuffle = function <T>(a:Array<T>, seed:number):Array<T> {
  let i, j, temp;
  i = a.length;
  while (--i > 0) {
    seed = (seed * 1103515245 + 12345) | 0;
    j = MathUtil.mod(seed, i + 1);
    temp = a[j];
    a[j] = a[i];
    a[i] = temp;
  }
  return a;
};

/**
 * Flip a coin.
 *
 * @param chance {number} - Between 0 (always false) and 1 (always true). Defaults to 0.5.
 */
Random.bool = (chance:number = 0.5):boolean => {
  return Math.random() < chance;
};
