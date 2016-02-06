var Immutable = require('immutable');
var defaultGame = require('../../shared/defaultGame.js');

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
  state = state || defaultGame;
  if (!action) {
    return state;
  }
  if (reducers.hasOwnProperty(action.type)) {
    return reducers[action.type](state, action);
  } else {
    throw new Error('Unknown action:' + action);
  }
};
