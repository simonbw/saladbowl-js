'use strict';

const ActionTypes = require('../ActionTypes');
const GameHelpers = require('../GameHelpers');
const Immutable = require('immutable');


/**
 * Replace the entire game.
 * @param game
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.REPLACE_GAME] = (game, action) => {
  if (!action.game) {
    throw Error('Replacement game action:' + JSON.stringify(action));
  }
  return Immutable.fromJS(action.game);
};

/**
 * Set a user's connection state.
 * @param game
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.USER_CONNECTION] = (game, action) => {
  game = game.setIn(['connections', action.userId], action.connected);
  const playerIndex = GameHelpers.getPlayerIndex(game, action.userId);
  if (action.connected && playerIndex >= 0) {
    game = game.setIn(['players', playerIndex, 'active'], true); // No longer skip players if they reconnect
  }
  return game;
};

/**
 * Set the user id.
 * @param game
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.SET_USER_ID] = (game, action) => {
  if (!action.userId) {
    throw Error('Cannot set null userId');
  }
  return game.set('userId', action.userId);
};
