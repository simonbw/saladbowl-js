'use strict';

import DEFAULT_GAME from '../defaultGame';
import PreGameReducers from './PreGameReducers';
import MidGameReducers from './MidGameReducers';
import MiscGameReducers from './MiscGameReducers';
import type { Game, Action } from '../types';

const reducers: Record<string, (game: Game, action: Action) => Game> = Object.assign({},
  PreGameReducers,
  MidGameReducers,
  MiscGameReducers);


/**
 * Return a new game that is the result of completing an action.
 * @param game {Immutable.Map}
 * @param action {Object}
 * @returns {Immutable.Map} new game
 */
export default (game: Game | null | undefined, action: Action | null | undefined): Game => {
  game = game || DEFAULT_GAME;
  if (action && action.type && Object.hasOwn(reducers, action.type)) {
    return reducers[action.type](game, action);
  }
  return game;
};
