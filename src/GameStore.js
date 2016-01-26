/**
 * @file Manages storing, retrieving, and updating games.
 */

const shortId = require('shortid');

const DefaultGame = require('../shared/DefaultGame.js');

const GameStore = module.exports;

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
    const game = games[gameId];
    if (typeof game != 'string') {
      throw new Error('Game Not Found');
    }
    return JSON.parse(game);
  });
};

/**
 * Update a game.
 * @param game
 * @returns {Promise.<T>}
 */
GameStore.save = function (game) {
  games[game.id] = JSON.stringify(game);
  console.log('saving game', games[game.id]);
  return Promise.resolve(JSON.parse(games[game.id]));
};

/**
 * Create a new game.
 * @returns {Promise.<T>}
 */
GameStore.create = function () {
  var id = shortId.generate();
  var game = DefaultGame.get();
  game.id = id;
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