'use strict';

import * as Immutable from 'immutable';

import GameReducers from '../../shared/reducers/GameReducers';
import UIReducers from './UIReducers';
import type { AppState, Action } from '../types';

const DEFAULT_STATE: AppState = Immutable.Map();

/**
 * Return a new state that is the result of completing an action.
 */
export default (state: AppState | undefined, action: Action): AppState => {
  state = state || DEFAULT_STATE;
  return state
    .set('game', GameReducers(state.get('game'), action))
    .set('ui', UIReducers(state.get('ui'), action));
};
