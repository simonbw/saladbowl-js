/**
 * Utility functions for dealing with games.
 */

var Player = require('./Player');
var Word = require('./Word');
var TeamNames = require('./TeamNames');

// TODO: Cache some of these values maybe?


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
  if (!this.players) {
    console.log('game has no players', this);
  }
  this.players = this.players.map(function (player) {
    return new Player(this, player);
  }.bind(this));
  this.words = this.words.map(function (word) {
    return new Word(this, word);
  }.bind(this))
}

/**
 * List of all words in the game.
 */
Object.defineProperty(Game.prototype, 'currentWord', {
  'get': function () {
    return this.words[this.currentWordIndex];
  }
});

/**
 * List of all words in the game.
 */
Object.defineProperty(Game.prototype, 'lastCorrectWord', {
  'get': function () {
    if (this.lastCorrectWordIndex == null) {
      return undefined;
    }
    return this.words[this.lastCorrectWordIndex];
  }
});

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
 * List of all words in the game.
 */
Object.defineProperty(Game.prototype, 'wordsInBowl', {
  'get': function () {
    return this.words.filter(function (word) {
      return word.inBowl;
    });
  }
});

/**
 * Get the most skipped word.
 */
Object.defineProperty(Game.prototype, 'mostSkippedWord', {
  'get': function () {
    if (!(this.words.length && this.gameStarted)) {
      return undefined;
    }
    var mostSkips = 0;
    var mostSkipsIndex = 0;
    this.words.forEach(function (word) {
      if (word.skips >= mostSkips) {
        mostSkips = word.skips;
        mostSkipsIndex = word.index;
      }
    });
    return this.words[mostSkipsIndex];
  }
});

/**
 * Get the word that had the most time spent on it.
 */
Object.defineProperty(Game.prototype, 'mostTimeSpentWord', {
  'get': function () {
    if (!(this.words.length && this.gameStarted)) {
      return undefined;
    }
    var mostTimeSpent = 0;
    var wordIndex = 0;
    this.words.forEach(function (word) {
      if (word.timeSpent >= mostTimeSpent) {
        mostTimeSpent = word.timeSpent;
        wordIndex = word.index;
      }
    });
    return this.words[wordIndex];
  }
});

/**
 * Get the word that had the most time spent on it.
 */
Object.defineProperty(Game.prototype, 'leastTimeSpentWord', {
  'get': function () {
    if (!(this.words.length && this.gameStarted)) {
      return undefined;
    }
    var leastTimeSpent = Infinity;
    var wordIndex = 0;
    this.words.forEach(function (word) {
      if (word.timeSpent < leastTimeSpent) {
        leastTimeSpent = word.timeSpent;
        wordIndex = word.index;
      }
    });
    return this.words[wordIndex];
  }
});

/**
 * Get a list of lists of players.
 *
 * @returns {*}
 */
Game.prototype.getTeams = function () {
  var teams = [];

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
    teams[j].points = [];
  }
  this.points.forEach(function (point) {
    teams[point.team].points.push(point);
  });

  return teams;
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
  return new Game(game);
};

module.exports = Game;