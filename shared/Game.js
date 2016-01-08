/**
 * Utility functions for dealing with games.
 */

var TeamNames = require('./TeamNames');


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

  for (var j = 0; j <= max; j++) {
    teams[j] = teams[j] || {players: []};
    teams[j].index = j;
    teams[j].name = TeamNames.get(this, j);
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
 * List of all words in the game.
 */
Object.defineProperty(Game.prototype, 'words', {
  'get': function () {
    var words = [];
    this.players.forEach(function (player) {
      words.push.apply(words, player.words);
    });
    return words;
  }
});

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
 * Easy access to current player.
 */
Object.defineProperty(Game.prototype, 'currentPlayer', {
  'get': function () {
    var team = this.getTeams()[this.currentTeamIndex];
    return team.players[this.currentPlayerIndex % team.players.length];
  }
});

/**
 * Easy access to current team.
 */
Object.defineProperty(Game.prototype, 'currentTeam', {
  'get': function () {
    return this.getTeams()[this.currentTeamIndex];
  }
});

/**
 * Easy access to current phase.
 */
Object.defineProperty(Game.prototype, 'currentPhase', {
  'get': function () {
    return this.phases[this.currentPhaseIndex];
  }
});

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