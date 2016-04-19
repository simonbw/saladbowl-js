'use strict';

/**
 * Hash a string to an integer.
 * @returns {number}
 */
exports.hash = (s) => {
  if (typeof s != "string") {
    throw Error('Cannot hash: ' + (typeof s));
  }
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};