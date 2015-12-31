var inherits = require('util').inherits;

var GameUtil = require('./GameUtil');
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


/**
 * Transforms the raw data to a model.
 *
 * @param game
 */
GameDAO.prototype.transform = function (game) {
  if (!game) {
    return game;
  }
  // TODO: set prototype
  game.getCurrentPlayer = GameUtil.getCurrentPlayer.bind(GameUtil, game);
  game.getPlayer = GameUtil.getPlayer.bind(GameUtil, game);
  game.getPoints = GameUtil.getPoints.bind(GameUtil, game);
  game.getTeams = GameUtil.getTeams.bind(GameUtil, game);
  game.getWords = GameUtil.getWords.bind(GameUtil, game);

  game.currentPhase = game.currentPhase || 0;
  game.currentPlayerIndex = game.currentPlayerIndex || 0;
  game.currentTeam = game.currentTeam || 0;
  game.phases = game.phases || DEFAULT_PHASES;
  game.players = game.players || [];
  game.points = game.points || [];
  game.wordsInBowl = game.wordsInBowl || [];
  game.wordsPerPlayer = game.wordsPerPlayer || DEFAULT_WORDS_PER_PLAYER;

  return game;
};

/**
 * Add a player to a game
 *
 * @param gameId
 * @param userId
 * @param name
 * @returns {Promise}
 */
GameDAO.prototype.addPlayer = function (gameId, userId, name) {
  var self = this;
  return this.fromId(gameId)
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
      var teams = game.getTeams();
      var team = teams.length;
      const player = {
        'id': userId,
        'name': name,
        'team': team,
        'words': []
      };
      return self.update(gameId, {'$push': {'players': player}});
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
  return this.collection.findAndModify({
    'query': {
      '_id': gameId,
      'players.id': playerId
    }, 'update': {
      '$set': {
        'players.$.team': team
      }
    },
    'new': true
  });
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
  return this.collection.findAndModify({
    'query': {
      '_id': gameId,
      'players.id': playerId
    },
    'update': {
      '$push': {
        'players.$.words': word
      }
    },
    'new': true
  });
};


/**
 * Go to the next team.
 *
 * @param gameId
 * @returns {Promise}
 */
GameDAO.prototype.nextTeam = function (gameId) {
  return this.fromId(gameId)
    .then(function (game) {
      var team = (game.currentTeam + 1) % (game.getTeams().length);
      var wordsInBowl = game.wordsInBowl;
      wordsInBowl.push(game.currentWord);
      var currentWord = Random.take(game.wordsInBowl);
      return this.update(gameId, {
        '$set': {
          'currentTeam': team,
          'currentWord': currentWord,
          'wordsInBowl': wordsInBowl,
          'started': false
        }
      });
    }.bind(this));
};

/**
 * Go to the next phase.
 *
 * @param gameId
 * @returns {Promise}
 */
GameDAO.prototype.nextPhase = function (gameId) {
  return this.fromId(gameId)
    .then(function (game) {
      var wordsInBowl = game.getWords();
      var currentWord = Random.take(wordsInBowl);
      var currentPhase = game.currentPhase + 1;
      var update = {
        '$set': {
          'currentPhase': currentPhase,
          'currentWord': currentWord,
          'wordsInBowl': wordsInBowl
        }
      };
      if (currentPhase > game.phases.length) {
        update['started'] = false;
      }
      return this.update(gameId, update);
    }.bind(this));
};

/**
 * Mark this word as correct.
 *
 * @param gameId
 * @returns {Promise}
 */
GameDAO.prototype.correctWord = function (gameId) {
  return this.fromId(gameId)
    .then(function (game) {
      var wordsInBowl = game.wordsInBowl;
      var currentPhase = game.currentPhase;
      if (wordsInBowl.length == 0) {
        wordsInBowl = game.getWords();
        currentPhase = game.currentPhase + 1;
      }
      var currentWord = Random.take(wordsInBowl);
      var update = {
        '$set': {
          'currentPhase': currentPhase,
          'currentWord': currentWord,
          'wordsInBowl': wordsInBowl
        }, '$push': {
          'points': {
            'word': game.currentWord,
            'team': game.currentTeam,
            'phase': game.currentPhase
          }
        }
      };
      return this.update(gameId, update);
    }.bind(this));
};

/**
 * Skip this word.
 *
 * @param gameId
 * @returns {Promise}
 */
GameDAO.prototype.skipWord = function (gameId) {
  return this.fromId(gameId)
    .then(function (game) {
      var wordsInBowl = game.wordsInBowl;
      wordsInBowl.push(game.currentWord);
      var currentWord = Random.take(wordsInBowl);
      return this.update(gameId, {
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
 * @param gameId
 * @returns {Promise}
 */
GameDAO.prototype.startRound = function (gameId) {
  return this.fromId(gameId)
    .then(function (game) {
      return this.update(gameId, {
        '$set': {
          'started': true,
          'startedAt': Date.now()
        }
      });
    }.bind(this));
};

/**
 * DEBUG ONLY
 * Go to the previous phase.
 *
 * @param gameId
 * @returns {Promise}
 */
GameDAO.prototype.previousPhase = function (gameId) {
  return this.update(gameId, {'$inc': {'phase': -1}});
};


module.exports = GameDAO;