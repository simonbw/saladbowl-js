'use strict';

/**
 * @file Manages storing, retrieving, and updating games.
 */

const shortId = require('shortid');

const defaultGame = require('../shared/defaultGame');
const GameReducers = require('../shared/reducers/GameReducers');
const RequestError = require('./RequestError');

const GameStore = module.exports;

// Temporary in memory store for games
// TODO: Better storage option
const games = {};

/**
 * Get a game.
 * @param gameId
 * @returns {Promise.<T>}
 */
GameStore.get = (gameId) => {
  if (!gameId) {
    return Promise.reject(new RequestError('Bad gameId:' + gameId, 400));
  }
  const game = games[gameId];
  if (!game) {
    return Promise.reject(new RequestError('Game Not Found', 404));
  }
  return Promise.resolve(game);
};

/**
 * Update a game. Must have an id.
 * @param game
 * @returns {Promise.<T>}
 */
GameStore.save = (game) => {
  const gameId = game.get('id');
  if (!gameId) {
    return Promise.reject(error);
  }
  games[gameId] = game;
  return Promise.resolve(games[gameId]);
};

/**
 * Create a new game.
 * @returns {Promise.<T>}
 */
GameStore.create = (wordsPerPlayer, secondsPerRound) => {
  const id = shortId.generate();
  const game = defaultGame
    .set('id', id)
    .set('wordsPerPlayer', wordsPerPlayer)
    .set('secondsPerRound', secondsPerRound);
  return GameStore.save(game);
};

/**
 * Deletes a game.
 * @returns {Promise.<T>}
 */
GameStore.delete = (gameId) => {
  const game = games[gameId];
  delete games[gameId];
  return Promise.resolve(game);
};


/**
 * Update the game based on an action.
 * @param gameId
 * @param action
 */
GameStore.dispatch = (gameId, action) => {
  // TODO: It would be really good if this queued the actions
  return GameStore.get(gameId)
    .then((game) => {
      game = GameReducers(game, action);
      return GameStore.save(game);
    });
};
