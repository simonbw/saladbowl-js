/**
 * @file Manages storing, retrieving, and updating games.
 */

var shortId = require('shortid');

var defaultGame = require('../shared/defaultGame.js');
var GameReducers = require('../web/reducers/GameReducers');

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
      throw new Error('Bad gameId:' + gameId);
    }
    var game = games[gameId];
    if (!game) {
      throw new Error('Game Not Found');
    }
    return game;
  });
};

/**
 * Update a game. Must have an id.
 * @param game
 * @returns {Promise.<T>}
 */
GameStore.save = function (game) {
  if (!game.get('id')) {
    throw error;
  }
  games[game.get('id')] = game;
  console.log('saving game', games[game.get('id')]);
  return Promise.resolve(games[game.id]);
};

/**
 * Create a new game.
 * @returns {Promise.<T>}
 */
GameStore.create = function () {
  var id = shortId.generate();
  var game = defaultGame
    .set('id', id);
  return GameStore.save(game);
};

/**
 * Create a new game.
 * @returns {Promise.<T>}
 */
GameStore.delete = function (gameId) {
  var game = games[gameId];
  delete games[gameId];
  return Promise.resolve(game);
};

/**
 * @param gameId
 * @param word
 */
GameStore.addWord = function (gameId, word) {
  GameStore.get(gameId)
    .then(function (game) {
      game.words.push(word);
      return GameStore.save(game);
    });
};

/**
 * Update the game based on an action.
 * @param gameId
 * @param action
 */
GameStore.dispatch = function (gameId, action) {
  GameStore.get(gameId)
    .then(function (game) {
      game = GameReducers(game, action);
      return GameStore.save(game);
    });
};