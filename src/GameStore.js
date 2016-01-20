/**
 * @file Manages storing and retrieving games.
 */

const shortId = require('shortid');

const db = require('./db');
var DefaultGame = require('../shared/DefaultGame.js');

games = {};

/**
 * Get a game.
 * @param gameId
 * @returns {Promise.<*>}
 */
exports.get = function (gameId) {
  return Promise.resolve(games[gameId]);
};

/**
 * Create a new game.
 * @returns {Promise.<*>}
 */
exports.create = function () {
  var id = shortId.generate();
  var game = DefaultGame.get();
  game.id = id;
  games[id] = game;
  return Promise.resolve(games[id]);
};

