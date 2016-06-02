'use strict';
// @flow

/**
 * Return true if username is valid, else false.
 */
exports.validateUserName = (userName:string):boolean => {
  if (typeof userName != 'string') {
    return false;
  }
  return !!((userName || '').trim());
};

/**
 * Return true if a word is valid, else false.
 */
exports.validateWord = (word:string):boolean => {
  if (typeof word != 'string') {
    return false;
  }
  return !!(word.trim());
};