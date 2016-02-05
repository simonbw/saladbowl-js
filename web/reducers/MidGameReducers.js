var ActionTypes = require('../../shared/ActionTypes');
var MathUtil = require('../../shared/MathUtil');
var GameHelpers = require('../GameHelpers.js');

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
    // TODO: Update word's stats
    state.set('words', state.get('words').withMutations(function (words) {
      words.setIn([state.get('wordIndex'), 'inBowl'], false);

      var bowlIsEmpty = words.every(function (word) {
        return !word.get('inBowl')
      });
      if (bowlIsEmpty) {
        words.map(function (word) {
          return word.set('inBowl', true);
        });
        state.set();
      }
    }));
    state.set('wordIndex', GameHelpers.getNextWord(state));
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
  return state.withMutations(function (state) {
    // TODO: Update word's stats
    state.set('wordIndex', GameHelpers.getNextWord(state));
  });
};