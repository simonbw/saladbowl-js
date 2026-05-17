'use strict';

import MathUtil from './MathUtil';


interface RandomType {
  uniform(min?: number, max?: number): number;
  integer(min?: number, max?: number): number;
  normal(mean?: number, deviation?: number): number;
  choose(...args: any[]): any;
  take<T>(options: T[]): T;
  shuffle<T>(a: T[]): T[];
  seededShuffle<T>(a: T[], seed: number): T[];
  bool(chance?: number): boolean;
}

/**
 * Utility for doing things based on random numbers.
 */
const Random = {} as RandomType;

// just for shorthand
const r = Math.random;

/**
 * Return a random number between min and max.
 *
 * @param min
 * @param max
 * @returns {*}
 */
Random.uniform = (min?: number, max?: number): number => {
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
Random.integer = (min?: number, max?: number): number => {
  return Math.floor(Random.uniform(min, max));
};

/**
 *
 * @param mean
 * @param deviation
 * @returns {*}
 */
Random.normal = (mean?: number, deviation?: number): number => {
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
Random.choose = function (...args: any[]): any {
  let options: any[];
  options = 1 <= args.length ? args.slice(0) : [];
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
Random.take = <T>(options: T[]): T => {
  return options.splice(Random.integer(options.length), 1)[0];
};

/**
 * Put an array into a random order and return the array.]
 *
 * @param a
 * @returns {*}
 */
Random.shuffle = <T>(a: T[]): T[] => {
  let i: number, j: number, temp: T;
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
Random.seededShuffle = <T>(a: T[], seed: number): T[] => {
  let i: number, j: number, temp: T;
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
Random.bool = (chance?: number): boolean => {
  if (chance == null) {
    chance = 0.5;
  }
  return Math.random() < chance;
};

export default Random;
