'use strict';

/**
 * Return true if username is valid, else false.
 * @param userName
 */
exports.validateUserName = (userName) => {
  if (typeof userName != 'string') {
    return false;
  }
  return !!((userName || '').trim());
};

/**
 * Return true if a word is valid, else false.
 * @param word
 * @returns {boolean}
 */
exports.validateWord = (word) => {
  if (typeof word != 'string') {
    return false;
  }
  return !!(word.trim());
};