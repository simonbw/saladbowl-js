/**
 * Utility functions for dealing with games.
 */


/**
 *
 * @param game
 * @constructor
 */
function Game(game) {
  for (var key in game) {
    if (game.hasOwnProperty(key)) {
      this[key] = game[key];
    }
  }
}

/**
 * Get a list of lists of players.
 *
 * @param includePoints
 * @returns {*}
 */
Game.prototype.getTeams = function (includePoints) {
  var teams = [];

  if (includePoints) {
    var points = this.getPoints();
    for (var i = 0; i < points.length; i++) {
      teams[i] = teams[i] || {players: []};
      teams[i].points = points[i];
    }
  }

  var max = 0;
  this.players.forEach(function (player) {
    max = Math.max(max, player.team);
    teams[player.team] = teams[player.team] || {players: []};
    teams[player.team].players.push(player);
  });

  // guarantees stuff
  for (var j = 0; j < max; j++) {
    teams[j] = teams[j] || {players: []};
  }

  return teams;
};


/**
 * Get a list of points.
 *
 * @returns {*}
 */
Game.prototype.getPoints = function () {
  var points = this.getTeams().map(function () {
    return 0;
  });

  this.points.forEach(function (point) {
    points[point.team] += 1;
  });

  return points;
};

/**
 * Get a list of all words in a game.
 *
 * @returns {*}
 */
Game.prototype.getWords = function () {
  var words = [];
  this.players.forEach(function (player) {
    words.push.apply(words, player.words);
  });
  return words;
};

/**
 * Get a player from a game and an id.
 *
 * @param playerId
 * @returns {undefined}
 */
Game.prototype.getPlayer = function (playerId) {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].id == playerId) {
      return this.players[i];
    }
  }
  return undefined;
};

/**
 * Returns the current player.
 *
 * @returns {*}
 */
Game.prototype.getCurrentPlayer = function () {
  var team = this.getTeams()[this.currentTeam];
  return team.players[this.currentPlayerIndex % team.players.length];
};

/**
 * Returns a url for the game.
 *
 * @param action {=String}
 * @returns {*}
 */
Game.prototype.getUrl = function (action) {
  if (action) {
    return '/' + this._id + '/' + action;
  }
  return '/' + this._id;
};

/**
 * Creates a nicer object than a game.
 *
 * @param game
 */
Game.transformGame = function (game) {
  if (!game) {
    return game;
  }
  var result = new Game(game);
  return result;
};

module.exports = Game;