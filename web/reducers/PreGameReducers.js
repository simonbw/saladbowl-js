var ActionTypes = require('../../shared/ActionTypes');
var Immutable = require('immutable');
var defaultGame = require('../../shared/defaultGame.js');


/**
 * Add a new player to the game.
 * @param state
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.PLAYER_JOINED] = function (state, action) {
  return state.updateIn(['players'], function (players) {
    return players.push(Immutable.fromJS(action.player))
  });
};


/**
 * Add a word to the game.
 * @param state
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.WORD_ADDED] = function (state, action) {
  return state.updateIn(['words'], function (words) {
    return words.set(action.index, Immutable.fromJS({
      playerId: action.playerId,
      word: action.word,
      inBowl: true
    }));
  });
};


/**
 * Start the game.
 * @param state
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.GAME_STARTED] = function (state, action) {
  return state.set('started', true);
};