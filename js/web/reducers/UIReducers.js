'use strict';
// @flow

const Immutable = require('immutable');
const ActionTypes = require('../../shared/ActionTypes');

const DEFAULT_STATE = Immutable.fromJS({});

const reducers = {};

/**
 * Set a field on the state.
 */
reducers[ActionTypes.UI.FIELD_CHANGED] = (state:Map<string, any>, action:Object) => {
  return state.set(action.field, action.value);
};


/**
 * Return a new state that is the result of completing an action.
 */
module.exports = (state:UI, action:Object) => {
  state = state || DEFAULT_STATE;
  if (action && action.type && reducers.hasOwnProperty(action.type)) {
    return reducers[action.type](state, action);
  }
  return state;
};
