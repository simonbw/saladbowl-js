var Immutable = require('immutable');

var MathUtil = require('../shared/MathUtil');
var Validation = require('../shared/Validation.js');
var TeamNames = require('../shared/TeamNames');

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
GameHelpers.playerIsJoined = function (game, playerId) {
  if (!playerId) {
    return false;
  }
  return game.get('players').some(function (player) {
    return player.get('id') == playerId;
  });
};

/**
 * Return a list of teams.
 * @param game
 * @returns {Immutable.List}
 */
GameHelpers.getTeams = function (game) {
  var teams = [];

  var lastTeam = game.get('players').reduce(function (largest, player) {
    return Math.max(largest, player.get('team'));
  }, 0);
  for (var i = 0; i <= lastTeam; i++) {
    teams[i] = {
      index: i,
      name: TeamNames.get(game.get('id'), i),
      players: [],
      points: []
    };
  }

  game.get('players').forEach(function (player) {
    player = player.set('ready', GameHelpers.playerWordsAreValid(game, player.get('id')));
    teams[player.get('team')].players.push(player);
  });

  game.get('points').forEach(function (point) {
    teams[point.get('team')].points.push(point);
  });

  if (game.get('started') && !game.get('ended')) {
    var team = teams[game.get('teamIndex') % teams.length];
    team.current = true;
    team.players[game.get('playerIndex') % teams.length] = team.players[game.get('playerIndex') % teams.length].set('current', true);
  }

  return Immutable.fromJS(teams);
};

/**
 * Return the player object with the given id.
 * @param game
 * @param playerId
 * @returns {*}
 */
GameHelpers.getPlayer = function (game, playerId) {
  return game.get('players').find(function (player) {
    return player.get('id') == playerId;
  });
};

/**
 * Return the player whose turn it is.
 * @param game
 * @returns {Immutable.Map}
 */
GameHelpers.getCurrentPlayer = function (game) {
  var team = GameHelpers.getCurrentTeam(game);
  return team.get('players').get(MathUtil.mod(game.get('playerIndex'), team.get('players').size));
};

/**
 * Return the current team.
 * @param game
 * @returns {*}
 */
GameHelpers.getCurrentTeam = function (game) {
  var teams = GameHelpers.getTeams(game);
  return teams.get(MathUtil.mod(game.get('teamIndex'), teams.size));
};

/**
 * Return true if the user is on the guessing team.
 * @param game
 * @returns {boolean}
 */
GameHelpers.playerIsGuessing = function (game, playerId) {
  if (!playerId) {
    return false;
  }
  var team = GameHelpers.getCurrentTeam(game);
  return team.get('players').some(function (player) {
    return player.get('id') == playerId;
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
 * Return only the words that are in the bowl.
 * @param game
 */
GameHelpers.getWordsInBowl = function (game) {
  return game.get('words').filter(function (word) {
    return word.get('inBowl');
  });
};

/**
 * Return the word that was skipped the most times.
 * @param game
 * @returns {*}
 */
GameHelpers.getMostSkippedWord = function (game) {
  return game.get('words').reduce(function (last, current) {
    if (!last) {
      return current;
    }
    if (current.get('skips') > last.get('skips')) {
      return current;
    } else {
      return last;
    }
  });
};

/**
 * Return true if the game is ready to be started.
 * @param game
 */
GameHelpers.readyToStart = function (game) {
  // Not Enough Players
  if (game.get('players').size < 4) {
    return false;
  }
  // Not all words are done
  if (!game.get('words').every(function (word) {
      return Validation.validateWord(word.get('word')) && word.get('inBowl');
    })) {
    return false;
  }
  var teams = GameHelpers.getTeams(game);
  // Not enough teams
  if (teams.size < 2) {
    return false;
  }
  // Not enough players on each team
  if (!teams.every(function (team) {
      return team.get('players').size >= 2;
    })) {
    return false;
  }

  // Everything is good
  return true;
};