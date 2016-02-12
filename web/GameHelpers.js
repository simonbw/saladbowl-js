var Immutable = require('immutable');

var MathUtil = require('../shared/MathUtil');
var Validation = require('../shared/Validation.js');

var GameHelpers = module.exports;

// TODO: Memoization

/**
 * Calculate the next word index.
 * @param game
 * @returns {number}
 */
GameHelpers.getNextWordIndex = function (game) {
  var words = game.get('words');
  var h = game.hashCode();
  for (var i = 0; i < words.size; i++) {
    var index = MathUtil.mod(i + h, words.size);
    var word = words.get(index);
    if (!word) {
      throw new Error('Word should exist:' + index + '(' + i + '+' + String(h) + '%' + words.size + ')');
    }
    if (word.get('inBowl')) {
      return index;
    }
  }
  throw new Error('No next word available');
};

/**
 * Return true if the user has joined the game.
 * @param game
 * @returns {boolean}
 */
GameHelpers.userIsJoined = function (game) {
  var userId = game.get('userId');
  if (!userId) {
    return false;
  }
  return game.get('players').some(function (player) {
    return player.get('id') == userId;
  });
};

/**
 * Return a list of teams.
 * @param game
 * @returns {Immutable.List}
 */
GameHelpers.getTeams = function (game) {
  var teams = [];
  game.get('players').forEach(function (player) {
    var team = player.get('team');
    teams[team] = teams[team] || {players: [], index: team};
    teams[team].players.push(player);
  });
  return Immutable.fromJS(teams);
};

/**
 * Return the player whose turn it is.
 * @param game
 * @returns {Immutable.Map}
 */
GameHelpers.getCurrentPlayer = function (game) {
  var team = GameHelpers.getTeams(game).get(game.get('teamIndex'));
  return team.get(MathUtil.mod(game.get('playerIndex'), team.size));
};

/**
 * Return true if the user is the current player.
 * @param game
 * @returns {boolean}
 */
GameHelpers.userIsCurrentPlayer = function (game) {
  var userId = game.get('userId');
  if (!userId) {
    return false;
  }
  return GameHelpers.getCurrentPlayer(game).get('id') == userId;
};

/**
 * Return true if the user is on the guessing team.
 * @param game
 * @returns {boolean}
 */
GameHelpers.userIsGuessing = function (game) {
  var userId = game.get('userId');
  if (!userId) {
    return false;
  }
  var team = GameHelpers.getTeams(game).get('teamIndex');
  return team.some(function (player) {
    return player.get('id') == userId;
  });
};

/**
 * Return all of a player's words.
 * @param game
 * @param playerId
 * @returns {*}
 */
GameHelpers.getPlayerWords = function (game, playerId) {
  return game.get('words').filter(function (word) {
    return word.get('playerId') == playerId;
  });
};

/**
 * Return all of the user's words.
 * @param game
 * @returns {*}
 */
GameHelpers.getUserWords = function (game) {
  return GameHelpers.getPlayerWords(game, game.get('userId'));
};

/**
 * Return true if a player has saved all their words.
 * @param game
 * @param playerId
 * @returns {boolean}
 */
GameHelpers.playerWordsAreValid = function (game, playerId) {
  var words = GameHelpers.getPlayerWords(game, playerId);
  return words.every(function (word) {
    return Validation.validateWord(word.get('word'));
  });
};

/**
 * Return true if the user has saved all their words.
 * @param game
 * @returns {boolean}
 */
GameHelpers.userWordsAreValid = function (game) {
  return GameHelpers.playerWordsAreValid(game, game.get('userId'));
};

/**
 * Return the index in the player list of a player.
 * @param game
 * @param playerId
 * @returns {number}
 */
GameHelpers.getPlayerIndex = function (game, playerId) {
  return game.get('players').findEntry(function (player) {
    return player.get('id') == playerId;
  })[0];
};

/**
 * Return the index in the player list of the user.
 * @param game
 * @returns {number}
 */
GameHelpers.getUserPlayerIndex = function (game) {
  return GameHelpers.getPlayerIndex(game, game.get('userId'));
};