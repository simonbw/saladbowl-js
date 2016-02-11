var Immutable = require('immutable');

var ActionTypes = require('../../shared/ActionTypes');

var DEFAULT_STATE = Immutable.fromJS({});

var reducers = {};

/**
 * Set a field on the state.
 * @param state
 * @param action
 * @returns {*}
 */
reducers[ActionTypes.UI.FIELD_CHANGED] = function (state, action) {
  return state.set(action.field, action.value);
};


/**
 * Return a new state that is the result of completing an action.
 * @param state {Immutable.Map}
 * @param action {Object}
 * @returns {Immutable.Map} new state
 */
module.exports = function (state, action) {
  state = state || DEFAULT_STATE;
  if (action && action.type && reducers.hasOwnProperty(action.type)) {
    return reducers[action.type](state, action);
  }
  return state;
};
