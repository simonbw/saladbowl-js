var Immutable = require('immutable');

var GameReducers = require('./GameReducers');
var UIReducers = require('./UIReducers');

/**
 * @type {Immutable.Map}
 */
var DEFAULT_STATE = Immutable.Map();

/**
 * Return a new state that is the result of completing an action.
 * @param state {Immutable.Map}
 * @param action {Object}
 * @returns {Immutable.Map} new state
 */
module.exports = function (state, action) {
  state = state || DEFAULT_STATE;

  return state.set('game', GameReducers(state.get('game'), action)).set('ui', UIReducers(state.get('ui'), action));
};
