'use strict';

/**
 * Executes functions.
 */
export default (store) => (next) => (action) => {
  if (typeof action == 'function') {
    return action(store.dispatch, store.getState); // NOTE: doesn't call next
  } else {
    return next(action);
  }
};
