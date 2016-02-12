/**
 * @file Manages storing, retrieving, and updating games.
 */

var shortId = require('shortid');

var defaultGame = require('../shared/defaultGame');
var GameReducers = require('../web/reducers/GameReducers');
var RequestError = require('./RequestError');

var GameStore = module.exports;

// Temporary in memory store for games
games = {};

/**
 * Get a game.
 * @param gameId
 * @returns {Promise.<T>}
 */
GameStore.get = function (gameId) {
  return new Promise(function (resolve, reject) {
    if (!gameId) {
      return reject(new RequestError('Bad gameId:' + gameId, 400));
    }
    var game = games[gameId];
    if (!game) {
      return reject(new RequestError('Game Not Found', 404));
    }
    resolve(game);
  });
};

/**
 * Update a game. Must have an id.
 * @param game
 * @returns {Promise.<T>}
 */
GameStore.save = function (game) {
  return new Promise(function (resolve, reject) {
    var gameId = game.get('id');
    if (!gameId) {
      throw error;
    }
    games[gameId] = game;
    resolve(games[gameId]);
  });
};

/**
 * Create a new game.
 * @returns {Promise.<T>}
 */
GameStore.create = function () {
  var id = shortId.generate();
  var game = defaultGame.set('id', id);
  return GameStore.save(game);
};

/**
 * Deletes a game.
 * @returns {Promise.<T>}
 */
GameStore.delete = function (gameId) {
  var game = games[gameId];
  delete games[gameId];
  return Promise.resolve(game);
};


/**
 * Update the game based on an action.
 * @param gameId
 * @param action
 */
GameStore.dispatch = function (gameId, action) {
  return GameStore.get(gameId)
    .then(function (game) {
      game = GameReducers(game, action);
      return GameStore.save(game);
    });
};
