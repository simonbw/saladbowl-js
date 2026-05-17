'use strict';

import DEFAULT_GAME from '../defaultGame';
import PreGameReducers from './PreGameReducers';
import MidGameReducers from './MidGameReducers';
import MiscGameReducers from './MiscGameReducers';

const reducers = Object.assign({},
  PreGameReducers,
  MidGameReducers,
  MiscGameReducers);


/**
 * Return a new game that is the result of completing an action.
 * @param game {Immutable.Map}
 * @param action {Object}
 * @returns {Immutable.Map} new game
 */
export default (game, action) => {
  game = game || DEFAULT_GAME;
  if (action && action.type && reducers.hasOwnProperty(action.type)) {
    return reducers[action.type](game, action);
  }
  return game;
};
