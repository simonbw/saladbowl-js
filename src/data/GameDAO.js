var inherits = require('util').inherits;

var Game = require('../../shared/Game');
var Random = require('../../shared/Random');
var SimpleDAO = require('./SimpleDAO');

// TODO: More efficient queries.
// TODO: Remove race conditions.

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
  'instructions': 'No noises.',
  'duration': 60000
}, {
  'name': 'One Word Only',
  'instructions': 'Say only one word. No gestures.',
  'duration': 60000
}];

//
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
  game.gameEnded = game.gameEnded || false;
  game.gameStarted = game.gameStarted || false;
  game.lastUpdatedAt = game.lastUpdatedAt || game.createdAt;
  game.phases = game.phases || DEFAULT_PHASES;
  game.players = game.players || [];
  game.points = game.points || [];
  game.skips = game.skips || [];
  game.wordsInBowl = game.wordsInBowl || [];
  game.wordsPerPlayer = game.wordsPerPlayer || DEFAULT_WORDS_PER_PLAYER;

  return SimpleDAO.prototype.create.call(this, game);
};

/**
 * Return an array of recently started games to join.
 */
GameDAO.prototype.recent = function () {
  return this.find({"currentPhaseIndex": {'$eq': 0}})
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
          error = Error("ALREADY JOINED");
          error.name = 'JoinError';
          throw error;
        }
        // TODO: There is a race condition here
        if (player.name == name) {
          error = Error("NAME TAKEN");
          error.name = 'JoinError';
          throw error;
        }
      });
      var team = Random.integer(0, game.getTeams().length + 1);
      const player = {
        'id': userId,
        'name': name,
        'team': team,
        'words': []
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
 * @param userId
 * @returns {Promise}
 */
GameDAO.prototype.removePlayer = function (gameId, userId) {
  return this.update(gameId, {
    '$pull': {'players': {'id': userId}},
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
      'players.$.team': team,
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
  // TODO: Validation
  if (gameId instanceof Game) {
    gameId = gameId._id;
  }
  var query = {
    '_id': gameId,
    'players.id': playerId
  };
  var update = {
    '$push': {'players.$.words': word},
    '$set': {'lastUpdatedAt': Date.now()}
  };
  return this.update(query, update);
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
      var currentTeamIndex = (game.currentTeamIndex + 1) % (game.getTeams().length);
      var wordsInBowl = game.wordsInBowl;
      wordsInBowl.push(game.currentWord);
      var currentWord = Random.take(game.wordsInBowl);
      var currentPlayerIndex = game.currentPlayerIndex;
      if (currentTeamIndex == 0) {
        currentPlayerIndex = game.currentPlayerIndex + 1;
      }
      return this.update(game._id, {
        '$set': {
          'currentPlayerIndex': currentPlayerIndex,
          'currentTeamIndex': currentTeamIndex,
          'currentWord': currentWord,
          'lastCorrectWord': null,
          'lastUpdatedAt': Date.now(),
          'roundStarted': false,
          'roundStartedAt': null,
          'wordsInBowl': wordsInBowl
        }
      });
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
      if (game.currentPhaseIndex != 0) {
        return game;
      }
      var wordsInBowl = game.words;
      var currentWord = Random.take(wordsInBowl);
      var now = Date.now();
      var currentPhaseIndex = 1;
      var update = {
        '$set': {
          "currentPhaseIndex": currentPhaseIndex,
          'currentWord': currentWord,
          'gameStarted': true,
          'gameStartedAt': now,
          'lastUpdatedAt': now,
          'wordsInBowl': wordsInBowl
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
      var wordsInBowl = game.wordsInBowl;
      var shouldAdvancePhase = wordsInBowl.length == 0;
      if (shouldAdvancePhase) {
        wordsInBowl = game.words;
      }
      var currentWord = Random.take(wordsInBowl);
      var now = Date.now();
      var timeSpent = now - game.lastWordAt;
      var update = {
        '$set': {
          'currentWord': currentWord,
          'lastCorrectWord': game.currentWord,
          'lastUpdatedAt': now,
          'lastWordAt': now,
          'wordsInBowl': wordsInBowl
        }, '$push': {
          'points': {
            'guessedAt': now,
            'phase': game.currentPhaseIndex,
            'player': game.currentPlayer.id,
            'team': game.currentTeamIndex,
            'timeSpent': timeSpent,
            'word': game.currentWord
          }
        }
      };
      if (shouldAdvancePhase) {
        var currentPhaseIndex = update['$set']['currentPhaseIndex'] = game.currentPhaseIndex + 1;

        if (currentPhaseIndex >= game.phases.length) {
          update['$set']['gameEnded'] = true;
          update['$set']['gameEndedAt'] = Date.now();
          update['$set']['roundStarted'] = false;
        }
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
      var skippedWord = game.currentWord;
      var wordsInBowl = game.wordsInBowl;
      wordsInBowl.push(skippedWord);
      var currentWord = Random.take(wordsInBowl);
      var now = Date.now();
      var timeSpent = now - game.lastWordAt;
      return this.update(game._id, {
        '$set': {
          'currentWord': currentWord,
          'lastUpdatedAt': now,
          'lastWordAt': now,
          'wordsInBowl': wordsInBowl
        },
        '$push': {
          'skips': {
            'skippedAt': now,
            'phase': game.currentPhaseIndex,
            'player': game.currentPlayer.id,
            'team': game.currentTeamIndex,
            'timeSpent': timeSpent,
            'word': skippedWord
          }
        }
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