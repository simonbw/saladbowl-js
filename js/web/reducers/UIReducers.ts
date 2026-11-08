'use strict';

import * as Immutable from 'immutable';

import ActionTypes from '../../shared/ActionTypes';
import type { Action } from '../types';

type UIState = Immutable.Map<string, any>;

const DEFAULT_STATE: UIState = Immutable.fromJS({ pending: {} });

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

reducers[ActionTypes.SERVER.UNDO_CORRECT] = (state) => {
  return state.set('waitingForServer', true);
};

reducers[ActionTypes.UI.SERVER_ACTION_SETTLED] = (state, action) => {
  const type = action.action?.type;
  if (
    type == ActionTypes.SERVER.SKIP_WORD ||
    type == ActionTypes.SERVER.CORRECT_WORD ||
    type == ActionTypes.SERVER.UNDO_CORRECT
  ) {
    return state.set('waitingForServer', false);
  }
  return state;
};

reducers[ActionTypes.UI.SHOW_ERROR] = (state, action) => {
  return state.set('error', Immutable.fromJS(action.error));
};

reducers[ActionTypes.UI.DISMISS_ERROR] = (state, action) => {
  return state.getIn(['error', 'id']) === action.id ? state.delete('error') : state;
};

reducers[ActionTypes.UI.SHOW_ANNOUNCEMENT] = (state, action) => {
  return state.set('announcement', Immutable.fromJS(action.announcement));
};

reducers[ActionTypes.UI.DISMISS_ANNOUNCEMENT] = (state, action) => {
  return state.getIn(['announcement', 'id']) === action.id ? state.delete('announcement') : state;
};

/**
 * Count in-flight `SERVER.*` mutations by type, so forms and buttons can
 * disable themselves while their request is on its way.
 */
function trackPending(state: UIState, action: Action): UIState {
  if (action.type.startsWith('SERVER.')) {
    return state.updateIn(['pending', action.type], (n: any) => (n ?? 0) + 1);
  }
  if (action.type === ActionTypes.UI.SERVER_ACTION_SETTLED && action.action?.type) {
    return state.updateIn(['pending', action.action.type], (n: any) => Math.max((n ?? 1) - 1, 0));
  }
  return state;
}

/**
 * Return a new state that is the result of completing an action.
 */
export default (
  state: UIState | null | undefined,
  action: Action | null | undefined,
): UIState => {
  state = state || DEFAULT_STATE;
  if (!action || !action.type) {
    return state;
  }
  state = trackPending(state, action);
  if (Object.hasOwn(reducers, action.type)) {
    return reducers[action.type](state, action);
  }
  return state;
};

/** True while a `SERVER.*` action of this type is waiting on the backend. */
export function isPending(ui: UIState, type: string): boolean {
  return ((ui.getIn(['pending', type]) as number | undefined) ?? 0) > 0;
}
