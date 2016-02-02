var ActionTypes = require('../../shared/ActionTypes');
var Immutable = require('immutable');
var DefaultGame = require('../../shared/DefaultGame.js');
var MathUtil = require('../../shared/MathUtil');

/**
 * Start the round.
 * @param state {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.ROUND_STARTED] = function (state, action) {
  return state.withMutations(function (state) {
    state.set('roundStarted', true);
  });
};


/**
 * End the round.
 * @param state {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.ROUND_ENDED] = function (state, action) {
  return state.withMutations(function (state) {
    state.set('roundStarted', false);
    // Next team and player
    state.set('teamIndex', state.get('teamIndex') + 1);
    if (state.get('teamIndex') == 0) {
      state.set('playerIndex', state.get('playerIndex') + 1);
    }
  });
};


/**
 *
 * @param state {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.WORD_CORRECT] = function (state, action) {
  // TODO: Verify word
  return state.withMutations(function (state) {
    state.set('wordIndex', getNextWord(state));
  });
};


/**
 *
 * @param state {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.WORD_SKIPPED] = function (state, action) {
  // TODO: Verify word
  // TODO: Update word's stats
  return state.withMutations(function (state) {
    state.set('wordIndex', getNextWord(state))
  });
};


function getNextWord(state) {
  var words = state.get('words');
  var h = state.hashCode();
  for (var i = 0; i < words.length; i++) {
    var index = MathUtil.mod(i + h, i);
    if (words.get(index).get('inBowl')) {
      return index;
    }
  }
  return (state.get('wordIndex') + 1) % words.length;
}