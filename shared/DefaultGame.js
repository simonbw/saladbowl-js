// TODO: Immutable?

/**
 * Returns a new default game object without an id.
 * @returns {{players: Array, started: boolean, words: Array, wordsPerPlayer: number}}
 */
exports.get = function () {
  return {
    phaseIndex: 0,
    playerIndex: 0,
    players: [],
    roundStarted: false,
    started: false,
    teamIndex: 0,
    wordIndex: 0,
    words: [],
    wordsPerPlayer: 5
  }
};