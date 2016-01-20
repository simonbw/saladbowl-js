/**
 * Returns a new default game object without an id.
 * @returns {{players: Array, started: boolean, words: Array, wordsPerPlayer: number}}
 */
exports.get = function () {
  return {
    players: [],
    started: false,
    words: [],
    wordsPerPlayer: 5
  }
};