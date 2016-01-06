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
 * @param options.hash.def - the default thing to get
 * @returns {*}
 */
helpers.get = function (object, key, options) {
  var def = (options && options.hash) ? options.hash.def : undefined;
  return object[key] || def;
};

/**
 * Call a function
 *
 * @param func
 * @returns {*}
 */
helpers.call = function (func, t) {
  var args = [];
  for (var i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return func.apply(t, args);
};

/**
 * JSONify the argument.
 *
 * @param o
 * @param pretty {boolean} - whether or not to pretty print the json
 * @returns {string}
 */
helpers.json = function (o, pretty) {
  var spaces = pretty ? 2 : 0;
  return JSON.stringify(o, null, spaces);
};

/**
 * Format object for inserting into javascript.
 *
 * @param o
 * @returns {string}
 */
helpers.jsObject = function (o) {
  return JSON.stringify(o) || 'undefined';
};

/**
 * Convert markdown to HTML.
 *
 * @param s
 * @returns {string}
 */
helpers.markdown = function (s) {
  var result = marked(s);
  return result;
};

/**
 * Return whether or not debug stuff should be shown.
 * @returns {boolean}
 */
helpers.debug = function () {
  return false;
};

/**
 * Format milliseconds to look good.
 *
 * @param milliseconds {number}
 */
helpers.formatClock = function (milliseconds) {
  if (milliseconds == null) {
    return '';
  }
  var seconds = milliseconds / 1000;
  var whole = Math.floor(seconds);
  var part = seconds - whole;
  part = Math.floor(part * 100);
  return whole + ':' + part;
};