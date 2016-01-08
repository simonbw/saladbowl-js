var Random = module.exports;

// just for shorthand
var r = Math.random;

/**
 * Return a random number between min and max.
 *
 * @param min
 * @param max
 * @returns {*}
 */
Random.uniform = function (min, max) {
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
Random.integer = function (min, max) {
  return Math.floor(Random.uniform(min, max));
};

/**
 *
 * @param mean
 * @param deviation
 * @returns {*}
 */
Random.normal = function (mean, deviation) {
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
Random.choose = function () {
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
Random.take = function (options) {
  return options.splice(Random.integer(options.length), 1)[0];
};

/**
 *
 * @param a
 * @returns {*}
 */
Random.shuffle = function (a) {
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
 *
 * @param chance
 * @returns {boolean}
 */
Random.bool = function (chance) {
  if (chance == null) {
    chance = 0.5;
  }
  return Math.random() < chance;
};
