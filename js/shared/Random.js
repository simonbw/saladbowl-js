'use strict';

const MathUtil = require('./MathUtil');


/**
 * Utility for doing things based on random numbers.
 */
const Random = module.exports;

// just for shorthand
const r = Math.random;

/**
 * Return a random number between min and max.
 *
 * @param min
 * @param max
 * @returns {*}
 */
Random.uniform = (min, max) => {
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
 *
 * @param min
 * @param max
 * @returns {number}
 */
Random.integer = (min, max) => {
  return Math.floor(Random.uniform(min, max));
};

/**
 *
 * @param mean
 * @param deviation
 * @returns {*}
 */
Random.normal = (mean, deviation) => {
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
 *
 * @returns {*}
 */
Random.choose = () => {
  var options;
  options = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
  if (options.length === 1) {
    options = options[0];
  }
  return options[Random.integer(options.length)];
};

/**
 * Remove and return a random element from an array.
 *
 * @returns {*}
 */
Random.take = (options) => {
  return options.splice(Random.integer(options.length), 1)[0];
};

/**
 * Put an array into a random order and return the array.]
 *
 * @param a
 * @returns {*}
 */
Random.shuffle = (a) => {
  var i, j, temp;
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
 * Put an array into a deterministically random order and return the array.
 *
 * @param a
 * @param seed {number} - A random
 * @returns {*}
 */
Random.seededShuffle = (a, seed) => {
  var i, j, temp;
  i = a.length;
  while (--i > 0) {
    seed = (seed * 1103515245 + 12345)| 0;
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
 * @returns {boolean}
 */
Random.bool = (chance) => {
  if (chance == null) {
    chance = 0.5;
  }
  return Math.random() < chance;
};
