'use strict';

/**
 * Hash a string to an integer.
 * @returns {number}
 */
export const hash = (s: string): number => {
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

/**
 * "1 word", "2 words". Pass `plural` for irregular nouns.
 */
export const pluralize = (count: number, singular: string, plural: string = singular + 's'): string => {
  return `${count} ${count === 1 ? singular : plural}`;
};
