'use strict';

import type { Middleware } from 'redux';

/**
 * Logs all actions.
 */
const loggingMiddleware: Middleware = (store) => (next) => (action) => {
  console.log('dispatching', action);
  let result = next(action);
  const state: any = store.getState();
  console.log('next state', state.toJS(), state.get('game').hashCode());
  return result;
};

export default loggingMiddleware;
