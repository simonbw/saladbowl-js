'use strict';

/** Longest player name the server accepts. */
export const MAX_USER_NAME_LENGTH = 30;

/** Longest noun the server accepts. */
export const MAX_WORD_LENGTH = 80;

/**
 * Return true if username is valid, else false.
 * @param userName
 */
export const validateUserName = (userName: unknown): boolean => {
  if (typeof userName != 'string') {
    return false;
  }
  const trimmed = userName.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_USER_NAME_LENGTH;
};

/**
 * Return true if a word is valid, else false.
 * @param word
 * @returns {boolean}
 */
export const validateWord = (word: unknown): boolean => {
  if (typeof word != 'string') {
    return false;
  }
  const trimmed = word.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_WORD_LENGTH;
};
