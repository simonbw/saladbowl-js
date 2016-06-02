'use strict';

const Immutable = require('immutable');

const ActionTypes = require('../../shared/ActionTypes');

const DEFAULT_STATE = Immutable.fromJS({});

const reducers = {};

/**
 * Set a field on the state.
 * @param state
 * @param action
 * @returns {*}
 */
reducers[ActionTypes.UI.FIELD_CHANGED] = (state, action) => {
  return state.set(action.field, action.value);
};

reducers[ActionTypes.SERVER.SKIP_WORD] = (state) => {
  return state.set('waitingForServer', true);
};

reducers[ActionTypes.CLIENT.WORD_SKIPPED] = (state) => {
  return state.set('waitingForServer', false);
};

reducers[ActionTypes.SERVER.CORRECT_WORD] = (state) => {
  return state.set('waitingForServer', true);
};

reducers[ActionTypes.CLIENT.WORD_CORRECT] = (state) => {
  return state.set('waitingForServer', false);
};


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
