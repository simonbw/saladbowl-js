var inherits = require('util').inherits;

var Game = require('../../shared/Game');
var Random = require('../../shared/Random');
var SimpleDAO = require('./SimpleDAO');

// TODO: More efficient queries.
// TODO: Remove race conditions.
// TODO: Shorten keys

//
var DEFAULT_PHASES = [{
  'name': 'Join Teams',
  'instructions': 'Join the team you want to be on. When everyone is ready, start the game.'
}, {
  'name': 'Describe It',
  'instructions': 'Say anything but the word.',
  'duration': 60000
}, {
  'name': 'Act It Out',
  'instructions': 'Do anything but make a noise.',
  'duration': 60000
}, {
  'name': 'One Word Only',
  'instructions': 'Say only one word. Say it as many times as you like. No gestures.',
  'duration': 60000
}];

var DEFAULT_WORDS_PER_PLAYER = 5;


/**
 * @constructor
 */
function GameDAO() {
  return SimpleDAO.call(this, 'games', true);
}
inherits(GameDAO, SimpleDAO);

GameDAO.instance = new GameDAO();

GameDAO.prototype.transform = Game.transformGame;

/**
 * Create a new game. Add default parameters.
 *
 * @param game
 * @returns {Promise}
 */
GameDAO.prototype.create = function (game) {
  game = game || {};

  game.createdAt = game.createdAt || Date.now();
  game.currentPhaseIndex = game.currentPhaseIndex || 0;
  game.currentPlayerIndex = game.currentPlayerIndex || 0;
  game.currentTeamIndex = game.currentTeamIndex || 0;
  game.currentWordIndex = game.currentWordIndex || 0;
  game.gameEnded = game.gameEnded || false;
  game.gameStarted = game.gameStarted || false;
  game.lastUpdatedAt = game.lastUpdatedAt || game.createdAt;
  game.lastWordAt = game.lastWordAt || game.createdAt;
  game.phases = game.phases || DEFAULT_PHASES;
  game.players = game.players || [];
  game.points = game.points || [];
  game.words = game.words || [];
  game.wordsPerPlayer = game.wordsPerPlayer || DEFAULT_WORDS_PER_PLAYER;

  return SimpleDAO.prototype.create.call(this, game);
};

/**
 * Return an array of recently started games to join.
 */
GameDAO.prototype.recent = function () {
  return this.find({'gameStarted': {'$eq': false}})
};

/**
 * Returns a promise that resolves to the game.
 *
 * @param game {string|Game}
 * @returns {*}
 */
GameDAO.prototype.fromIdOrGame = function (game) {
  if (game instanceof Game) {
    return Promise.resolve(game);
  } else {
    return this.fromId(game);
  }
};

/**
 * Add a player to a game
 *
 * @param game {string|Game}
 * @param userId
 * @param name
 * @returns {Promise}
 */
GameDAO.prototype.addPlayer = function (game, userId, name) {
  var self = this;
  return this.fromIdOrGame(game)
    .then(function (game) {
      game.players.forEach(function (player) {
        var error;
        if (player.id == userId) {
          error = Error('ALREADY JOINED');
          error.name = 'JoinError';
          throw error;
        }
        // TODO: There is a race condition here
        if (player.name == name) {
          error = Error('NAME TAKEN');
          error.name = 'JoinError';
          throw error;
        }
      });
      var team = Random.integer(0, game.getTeams().length + 1);
      const player = {
        'id': userId,
        'name': name,
        'team': team
      };
      return self.update(game._id, {
        '$push': {'players': player},
        '$set': {'lastUpdatedAt': Date.now()}
      });
    });
};

/**
 * Remove a player from a game.
 *
 * @param gameId
 * @param playerId
 * @returns {Promise}
 */
GameDAO.prototype.removePlayer = function (gameId, playerId) {
  return this.update(gameId, {
    '$pull': {'players': {'id': playerId}},
    '$set': {'lastUpdatedAt': Date.now()}
  });
};

/**
 * Set the team of a player.
 *
 * @param gameId
 * @param playerId
 * @param team
 * @returns {Promise}
 */
GameDAO.prototype.setTeam = function (gameId, playerId, team) {
  // TODO: Validation
  if (gameId instanceof Game) {
    gameId = gameId._id;
  }
  var query = {
    '_id': gameId,
    'players.id': playerId
  };
  var update = {
    '$set': {
      'players.$.team': parseInt(team),
      'lastUpdatedAt': Date.now()
    }

  };
  return this.update(query, update);
};

/**
 * Add a word.
 *
 * @param gameId
 * @param playerId
 * @param word
 * @returns {Promise}
 */
GameDAO.prototype.addWord = function (gameId, playerId, word) {
  if (gameId instanceof Game) {
    gameId = gameId._id;
  }
  var update = {
    '$push': {
      'words': {
        'inBowl': true,
        'playerId': playerId,
        'skips': 0,
        'timeSpent': 0,
        'word': word
      }
    },
    '$set': {'lastUpdatedAt': Date.now()}
  };
  return this.update(gameId, update);
};


/**
 * Go to the next team.
 *
 * @param gameId {string|Game}
 * @returns {Promise}
 */
GameDAO.prototype.nextTeam = function (gameId) {
  return this.fromIdOrGame(gameId)
    .then(function (game) {
      // Next team
      var currentTeamIndex = (game.currentTeamIndex + 1) % (game.getTeams().length);

      // Choose a new word
      var currentWordIndex = Random.choose(game.wordsInBowl).index;

      // Advance player count if necessary
      var currentPlayerIndex = game.currentPlayerIndex;
      if (currentTeamIndex == 0) {
        currentPlayerIndex = game.currentPlayerIndex + 1;
      }

      var now = Date.now();
      var update = {
        '$set': {
          'currentPlayerIndex': currentPlayerIndex,
          'currentTeamIndex': currentTeamIndex,
          'currentWordIndex': currentWordIndex,
          'lastCorrectWordIndex': null,
          'lastUpdatedAt': now,
          'roundStarted': false,
          'roundStartedAt': null
        },
        '$inc': {}
      };
      var timeSpent = now - Math.max(game.lastWordAt, game.roundStartedAt);
      update['$inc'][('words.' + game.currentWordIndex + '.timeSpent')] = timeSpent;
      return this.update(game._id, update);
    }.bind(this));
};

/**
 * Go to the first phase.
 *
 * @param gameId {string|Game}
 * @returns {Promise}
 */
GameDAO.prototype.startGame = function (gameId) {
  return this.fromIdOrGame(gameId)
    .then(function (game) {
      // Only work if game hasn't started
      if (game.currentPhaseIndex != 0 || game.gameStarted) {
        return game;
      }

      // Give each word an index
      game.words.forEach(function (word, index) {
        word.index = index;
      });

      var currentWordIndex = Random.integer(game.words.length);
      var currentPhaseIndex = 1;
      var now = Date.now();
      var update = {
        '$set': {
          'currentPhaseIndex': currentPhaseIndex,
          'currentWordIndex': currentWordIndex,
          'gameStarted': true,
          'gameStartedAt': now,
          'lastUpdatedAt': now,
          'words': game.words
        }
      };
      return this.update(game._id, update);
    }.bind(this));
};

/**
 * Mark this word as correct.
 *
 * @param gameId {string|Game}
 * @returns {Promise}
 */
GameDAO.prototype.correctWord = function (gameId) {
  return this.fromIdOrGame(gameId)
    .then(function (game) {
      var correctWordIndex = game.currentWordIndex;
      game.currentWord.inBowl = false;

      var now = Date.now();
      var timeSpent = now - Math.max(game.lastWordAt, game.roundStartedAt);

      var update = {
        '$set': {
          'lastCorrectWordIndex': correctWordIndex,
          'lastUpdatedAt': now,
          'lastWordAt': now
        }, '$push': {
          'points': {
            'guessedAt': now,
            'phase': game.currentPhaseIndex,
            'player': game.currentPlayer.id,
            'team': game.currentTeamIndex,
            'timeSpent': timeSpent,
            'wordIndex': correctWordIndex
          }
        }
      };
      if (game.wordsInBowl.length == 0) {
        var currentPhaseIndex = update['$set']['currentPhaseIndex'] = game.currentPhaseIndex + 1;

        // Put all words back in bowl
        game.words.forEach(function (word) {
          word.inBowl = true;
        });
        game.words[correctWordIndex].timeSpent += timeSpent;
        update['$set']['words'] = game.words;
        update['$set']['currentWordIndex'] = Random.integer(game.words.length);

        // Game is over
        if (currentPhaseIndex >= game.phases.length) {
          update['$set']['gameEnded'] = true;
          update['$set']['gameEndedAt'] = Date.now();
          update['$set']['roundStarted'] = false;
        }
      } else {
        update['$set']['words.' + correctWordIndex + '.inBowl'] = false;
        update['$set']['words.' + correctWordIndex + '.timeSpent'] = game.words[correctWordIndex].timeSpent + timeSpent;
        // Choose a new word
        update['$set']['currentWordIndex'] = Random.choose(game.wordsInBowl).index;
      }
      return this.update(game._id, update);
    }.bind(this));
};

/**
 * Skip this word.
 *
 * @param gameId {string|Game}
 * @returns {Promise}
 */
GameDAO.prototype.skipWord = function (gameId) {
  return this.fromIdOrGame(gameId)
    .then(function (game) {
      var skippedWordIndex = game.currentWordIndex;
      var currentWordIndex = Random.choose(game.wordsInBowl).index;

      var now = Date.now();
      var timeSpent = now - Math.max(game.lastWordAt, game.roundStartedAt);

      var increment = {};
      increment['words.' + skippedWordIndex + '.skips'] = 1;
      increment['words.' + skippedWordIndex + '.timeSpend'] = timeSpent;

      return this.update(game._id, {
        '$set': {
          'currentWordIndex': currentWordIndex,
          'lastUpdatedAt': now,
          'lastWordAt': now
        },
        '$inc': increment
      });
    }.bind(this));
};

/**
 * Start the round.
 *
 * @param gameId {string|Game}
 * @returns {Promise}
 */
GameDAO.prototype.startRound = function (gameId) {
  return this.fromIdOrGame(gameId)
    .then(function (game) {
      return this.update(game._id, {
        '$set': {
          'lastUpdatedAt': Date.now(),
          'roundStarted': true,
          'roundStartedAt': Date.now()
        }
      });
    }.bind(this));
};

module.exports = GameDAO;