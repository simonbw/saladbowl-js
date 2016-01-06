var inherits = require('util').inherits;

var Game = require('../../shared/Game');
var Random = require('../../shared/Random');
var SimpleDAO = require('./SimpleDAO');

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
  game.currentPhase = game.currentPhase || 0;
  game.currentPlayerIndex = game.currentPlayerIndex || 0;
  game.currentTeam = game.currentTeam || 0;
  game.gameEnded = game.gameEnded || false;
  game.gameStarted = game.gameStarted || false;
  game.phases = game.phases || DEFAULT_PHASES;
  game.players = game.players || [];
  game.points = game.points || [];
  game.wordsInBowl = game.wordsInBowl || [];
  game.wordsPerPlayer = game.wordsPerPlayer || DEFAULT_WORDS_PER_PLAYER;

  return SimpleDAO.prototype.create.call(this, game);
};

/**
 * Return an array of recently started games to join.
 */
GameDAO.prototype.recent = function () {
  return this.find({'currentPhase': {'$eq': 0}})
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
      return self.update(game._id, {'$push': {'players': player}});
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
    '$pull': {
      'players': {'id': userId}
    }
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
    '$set': {'players.$.team': team}
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
    '$push': {'players.$.words': word}
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
      var team = (game.currentTeam + 1) % (game.getTeams().length);
      var wordsInBowl = game.wordsInBowl;
      wordsInBowl.push(game.currentWord);
      var currentWord = Random.take(game.wordsInBowl);
      var currentPlayerIndex = game.currentPlayerIndex;
      if (team == 0) {
        currentPlayerIndex = game.currentPlayerIndex + 1;
      }
      return this.update(game._id, {
        '$set': {
          'currentTeam': team,
          'currentWord': currentWord,
          'currentPlayerIndex': currentPlayerIndex,
          'wordsInBowl': wordsInBowl,
          'roundStarted': false,
          'roundStartedAt': null
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
      if (game.currentPhase != 0) {
        return game;
      }
      var wordsInBowl = game.getWords();
      var currentWord = Random.take(wordsInBowl);
      var currentPhase = 1;
      var update = {
        '$set': {
          'gameStarted': true,
          'currentPhase': currentPhase,
          'currentWord': currentWord,
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
      var currentPhase = game.currentPhase;
      if (wordsInBowl.length == 0) {
        wordsInBowl = game.getWords();
        currentPhase = game.currentPhase + 1;
      }
      var currentWord = Random.take(wordsInBowl);
      var gameEnded = currentPhase >= game.phases.length;
      var roundStarted = game.roundStarted && !gameEnded;
      var update = {
        '$set': {
          'currentPhase': currentPhase,
          'currentWord': currentWord,
          'wordsInBowl': wordsInBowl,
          'gameEnded': gameEnded,
          'roundStarted': roundStarted
        }, '$push': {
          'points': {
            'word': game.currentWord,
            'team': game.currentTeam,
            'phase': game.currentPhase
          }
        }
      };
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
      var wordsInBowl = game.wordsInBowl;
      wordsInBowl.push(game.currentWord);
      var currentWord = Random.take(wordsInBowl);
      return this.update(game._id, {
        '$set': {
          'currentWord': currentWord,
          'wordsInBowl': wordsInBowl
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
          'roundStarted': true,
          'roundStartedAt': Date.now()
        }
      });
    }.bind(this));
};

module.exports = GameDAO;