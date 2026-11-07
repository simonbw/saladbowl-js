'use strict';

import type { Middleware } from 'redux';

/**
 * Executes functions.
 */
const thunkMiddleware: Middleware = (store) => (next) => (action) => {
  if (typeof action == 'function') {
    return (action as (dispatch: unknown, getState: unknown) => unknown)(store.dispatch, store.getState); // NOTE: doesn't call next
  } else {
    return next(action);
  }
};

export default thunkMiddleware;
