const ActionTypes = require('../../shared/ActionTypes.js');
const UIActions = require('./UIActions.js');

const GameActions = module.exports;

/**
 * Send a join game action.
 * @param name
 */
GameActions.joinGame = (name) => ({
  type: ActionTypes.SERVER.JOIN_GAME,
  name: name
});

/**
 * Send a bunch of save word actions.
 * @param words
 */
GameActions.saveWords = (words) => ({
  type: ActionTypes.SERVER.SAVE_WORDS,
  words: words
});

/**
 * Join a team.
 * @param team
 */
GameActions.joinTeam = (team) => ({
  type: ActionTypes.SERVER.JOIN_TEAM,
  team: team
});

/**
 * Start the game.
 */
GameActions.startGame = () => ({
  type: ActionTypes.SERVER.START_GAME
});

/**
 * Start the round.
 */
GameActions.startRound = () => ({
  type: ActionTypes.SERVER.START_ROUND
});

/**
 * Skip the current word.
 */
GameActions.skipWord = () => ({
  type: ActionTypes.SERVER.SKIP_WORD
});

/**
 * Correctly guessed the current word.
 */
GameActions.correctWord = () => ({
  type: ActionTypes.SERVER.CORRECT_WORD
});

/**
 * Ask to replace the current game.
 */
GameActions.outOfSync = () => (dispatch) => {
  dispatch(UIActions.updateField('synced', false));
  return {
    type: ActionTypes.SERVER.OUT_OF_SYNC
  }
};