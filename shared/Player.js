/**
 *
 * @param game
 * @param player
 * @constructor
 */
function Player(game, player) {
  for (var key in player) {
    if (player.hasOwnProperty(key)) {
      this[key] = player[key];
    }
  }
  this.game = game;
}

/**
 *
 */
Object.defineProperty(Player.prototype, 'words', {
  'get': function () {
    return this.game.words.filter(function (word) {
      return word.playerId == this.id;
    }.bind(this));
  }
});

module.exports = Player;