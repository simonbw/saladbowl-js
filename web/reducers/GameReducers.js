const ActionTypes = require('../../shared/ActionTypes');
const Immutable = require('immutable');
const DefaultGame = require('../../shared/DefaultGame.js');

const DEFAULT_STATE = Immutable.fromJS(DefaultGame.get());

const reducers = {};

/**
 * Returns a new state with the player added.
 * @param state
 * @param action
 * @returns {*}
 */
reducers[ActionTypes.CLIENT.PLAYER_JOINED] = function (state, action) {
  return state.updateIn(['players'], function (players) {
    return players.push(Immutable.fromJS(action.player))
  });
};

/**
 * Returns a new state with the word added.
 * @param state
 * @param action
 * @returns {*}
 */
reducers[ActionTypes.CLIENT.WORD_ADDED] = function (state, action) {
  return state.updateIn(['words'], function (words) {
    return words.push(Immutable.fromJS(action.word))
  });
};

/**
 * Returns a new state based off a new game.
 * @param state
 * @param action
 * @returns {*}
 */
reducers[ActionTypes.CLIENT.REPLACE_GAME] = function (state, action) {
  if (!action.game) {
    throw Error('Replacement game action:' + JSON.stringify(action));
  }
  return Immutable.fromJS(action.game);
};

/**
 *
 * @param state {Immutable.Map}
 * @param action {string}
 * @returns {Immutable.Map}
 */
module.exports = function (state, action) {
  state = state || DEFAULT_STATE;
  if (reducers.hasOwnProperty(action.type)) {
    try {
      return reducers[action.type](state, action);
    } catch (e) {
      console.error(e);
      return state;
    }
  }
  return state;
};