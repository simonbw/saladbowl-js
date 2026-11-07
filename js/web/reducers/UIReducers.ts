'use strict';

import * as Immutable from 'immutable';

import ActionTypes from '../../shared/ActionTypes';
import type { Action } from '../types';

type UIState = Immutable.Map<string, any>;

const DEFAULT_STATE: UIState = Immutable.fromJS({});

const reducers: Record<string, (state: UIState, action: Action) => UIState> =
  {};

/**
 * Set a field on the state.
 */
reducers[ActionTypes.UI.FIELD_CHANGED] = (state, action) => {
  return state.set(action.field, action.value);
};

reducers[ActionTypes.SERVER.SKIP_WORD] = (state) => {
  return state.set('waitingForServer', true);
};

reducers[ActionTypes.SERVER.CORRECT_WORD] = (state) => {
  return state.set('waitingForServer', true);
};

reducers[ActionTypes.UI.SERVER_ACTION_SETTLED] = (state, action) => {
  const type = action.action?.type;
  if (type == ActionTypes.SERVER.SKIP_WORD || type == ActionTypes.SERVER.CORRECT_WORD) {
    return state.set('waitingForServer', false);
  }
  return state;
};

/**
 * Return a new state that is the result of completing an action.
 */
export default (
  state: UIState | null | undefined,
  action: Action | null | undefined,
): UIState => {
  state = state || DEFAULT_STATE;
  if (action && action.type && Object.hasOwn(reducers, action.type)) {
    return reducers[action.type](state, action);
  }
  return state;
};
