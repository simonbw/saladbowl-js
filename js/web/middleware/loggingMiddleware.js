'use strict';

/**
 * Logs all actions.
 */
module.exports = (store) => (next) => (action) => {
  console.log('dispatching', action);
  let result = next(action);
  const state = store.getState();
  console.log('next state', state.toJS(), state.get('game').hashCode());
  return result;
};