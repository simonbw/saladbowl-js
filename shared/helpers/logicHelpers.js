var helpers = module.exports;

/**
 *
 * @param a
 * @returns {boolean}
 */
helpers.not = function (a) {
  return !a;
};

/**
 * @returns {*}
 */
helpers.and = function () {
  if (arguments.length < 3) {
    throw new Error('and takes at least 2 arguments:' + arguments.length + ' provided');
  }
  for (var i = 0; i < arguments.length - 1; i++) {
    if (!arguments[i]) {
      return arguments[i];
    }
  }
  return arguments[i - 1];
};

/**
 * @param a
 * @param b
 * @returns {*}
 */
helpers.or = function (a, b) {
  if (arguments.length < 3) {
    throw new Error('or takes at least 2 arguments');
  }
  for (var i = 0; i < arguments.length - 1; i++) {
    if (arguments[i]) {
      return arguments[i];
    }
  }
  return arguments[i - 1];
};