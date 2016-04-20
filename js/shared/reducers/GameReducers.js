'use strict';

const DEFAULT_STATE = require('../defaultGame');

const reducers = Object.assign({},
  require('./game/PreGameReducers'),
  require('./game/MidGameReducers'),
  require('./game/MiscGameReducers'));


/**
 * Return a new state that is the result of completing an action.
 * @param state {Immutable.Map}
 * @param action {Object}
 * @returns {Immutable.Map} new state
 */
module.exports = (state, action) => {
  state = state || DEFAULT_STATE;
  if (action && action.type && reducers.hasOwnProperty(action.type)) {
    return reducers[action.type](state, action);
  }
  return state;
};
