/**
 * @file Short, shareable game codes like "K7QP".
 */

// No 0/O, 1/I/L — codes get read aloud and typed on phones.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const GAME_CODE_LENGTH = 4;

/** Generate a random game code. */
export const randomGameCode = (length: number = GAME_CODE_LENGTH): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
};

/** Canonical form of a user-typed code: trimmed and upper-cased. */
export const normalizeGameCode = (code: string): string => code.trim().toUpperCase();
