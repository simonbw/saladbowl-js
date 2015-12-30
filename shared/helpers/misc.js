var marked = require('marked');


var helpers = {};
module.exports = helpers;

/**
 * Capitalize the first letter of a string.
 *
 * @param s
 * @returns {string}
 */
helpers.capitalize = function (s) {
  if (!s) {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Return the length of something.
 *
 * @param s
 * @returns {string}
 */
helpers.length = function (s) {
  return s.length;
};

/**
 * Lookup a key on an object.
 *
 * @param object
 * @param key
 * @param options
 * @param options.hash.default the default thing to get
 * @returns {*}
 */
helpers.get = function (object, key, options) {
  var def = (options && options.hash) ? options.hash.def : undefined;
  return object[key] || def;
};

/**
 * JSONify the argument.
 *
 * @param o
 */
helpers.json = function (o, pretty) {
  var spaces = pretty ? 2 : 0;
  return JSON.stringify(o, null, spaces);
};

/**
 * Add all the values together
 */
helpers.sum = function () {
  var total = 0;
  for (var i = 0; i < arguments.length - 1; i++) {
    total += arguments[i];
  }
  console.log('total:', total);
  return total;
};

/**
 * Convert markdown to HTML.
 *
 * @param s
 * @returns {*}
 */
helpers.markdown = function (s) {
  var result = marked(s);
  console.log('source:\n', s, '\n\ncompiled:\n', result);
  return result;
};

/**
 * Return whether or not debug stuff should be shown.
 * @returns {boolean}
 */
helpers.debug = function () {
  return false;
};