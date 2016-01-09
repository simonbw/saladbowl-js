/**
 *
 * @param game
 * @param word
 * @constructor
 */
function Word(game, word) {
  for (var key in word) {
    if (word.hasOwnProperty(key)) {
      this[key] = word[key];
    }
  }
  // Invisible property
  Object.defineProperty(this, 'game', {
    'get': function () {
      return game;
    }
  });
}

/**
 *
 */
Object.defineProperty(Word.prototype, 'player', {
  'get': function () {
    return this.game.getPlayer(this.playerId);
  }
});

module.exports = Word;