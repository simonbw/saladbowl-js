/**
 * Hash a string to an integer.
 * @returns {number}
 */
exports.hash = function (s) {
  if (typeof s != "string") {
    throw Error('Cannot hash: ' + (typeof s));
  }
  var hash = 0;
  for (var i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};