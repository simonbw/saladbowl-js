/**
 * Math utility functions.
 */

exports.mod = function (a, b) {
  return ((a % b) + b) % b;
};