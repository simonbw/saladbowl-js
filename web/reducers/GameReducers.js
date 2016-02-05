var Immutable = require('immutable');
var DefaultGame = require('../../shared/DefaultGame.js');

var DEFAULT_STATE = Immutable.fromJS(DefaultGame.get());

var reducers = Object.assign({},
  require('./PreGameReducers'),
  require('./MidGameReducers'),
  require('./MiscGameReducers'));


/**
 * Return a new state that is the result of completing an action.
 * @param state {Immutable.Map}
 * @param action {Object}
 * @returns {Immutable.Map} new state
 */
module.exports = function (state, action) {
  state = state || DEFAULT_STATE;
  if (!action) {
    return state;
  }
  if (reducers.hasOwnProperty(action.type)) {
    return reducers[action.type](state, action);
  } else {
    throw new Error('Unknown action:' + action);
  }
};
