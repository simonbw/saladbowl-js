const ActionTypes = require('../../shared/ActionTypes');
const Immutable = require('immutable');

/**
 *
 * @param state {Immutable.Map}
 * @param action {string}
 * @returns {Immutable.Map}
 */
module.exports = function (state, action) {
  state = state || Immutable.Map({title: 'Default Title'});
  switch (action.type) {
    case ActionTypes.SET_TITLE:
      return state.set('title', action.title);
    default:
      return state;
  }
};