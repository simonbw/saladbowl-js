'use strict';

const DEFAULT_GAME = require('../defaultGame');

const reducers = Object.assign({},
  require('./PreGameReducers'),
  require('./MidGameReducers'),
  require('./MiscGameReducers'));


/**
 * Return a new game that is the result of completing an action.
 * @param game {Immutable.Map}
 * @param action {Object}
 * @returns {Immutable.Map} new game
 */
module.exports = (game, action) => {
  game = game || DEFAULT_GAME;
  if (action && action.type && reducers.hasOwnProperty(action.type)) {
    return reducers[action.type](game, action);
  }
  return game;
};
