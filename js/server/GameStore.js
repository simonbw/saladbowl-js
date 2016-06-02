'use strict';
// @flow


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
 */
GameStore.get = (gameId:string) => {
  if (!gameId) {
    return Promise.reject(new RequestError('Bad gameId:' + gameId, 400));
  }
  const game = games[gameId];
  if (!game) {
    return Promise.reject(new RequestError('Game Not Found', 404));
  }
  return Promise.resolve(game);
};

GameStore.get('5', 10);

/**
 * Update a game. Must have an id.
 */
GameStore.save = (game:Game) => {
  const gameId = game.get('id');
  if (!gameId) {
    return Promise.reject(new Error('Game must have an id'));
  }
  games[gameId] = game;
  return Promise.resolve(games[gameId]);
};

/**
 * Create a new game.
 */
GameStore.create = (wordsPerPlayer:number) => {
  const id = shortId.generate();
  const game = defaultGame
    .set('id', id)
    .set('wordsPerPlayer', wordsPerPlayer);
  return GameStore.save(game);
};

/**
 * Deletes a game.
 */
GameStore.delete = (gameId:string) => {
  const game = games[gameId];
  delete games[gameId];
  return Promise.resolve(game);
};


/**
 * Update the game based on an action.
 */
GameStore.dispatch = (gameId:string, action:Object) => {
  // TODO: It would be really good if this queued the actions
  return GameStore.get(gameId)
    .then((game) => {
      game = GameReducers(game, action);
      return GameStore.save(game);
    });
};
