'use strict';
// @flow


const ActionTypes = require('../../shared/ActionTypes.js');

const GameActions = module.exports;
/**
 * Send a join game action.
 */
GameActions.joinGame = (name:string) => {
  return {
    type: ActionTypes.SERVER.JOIN_GAME,
    name: name
  };
};

/**
 * Send a bunch of save word actions.
 */
GameActions.saveWords = (words:Array<Object>) => {
  return {
    type: ActionTypes.SERVER.SAVE_WORDS,
    words: words
  };
};

/**
 * Join a team.
 */
GameActions.joinTeam = (team:number) => {
  return {
    type: ActionTypes.SERVER.JOIN_TEAM,
    team: team
  };
};

/**
 * Start the game.
 */
GameActions.startGame = () => {
  return {
    type: ActionTypes.SERVER.START_GAME
  };
};

/**
 * Start the round.
 */
GameActions.startRound = () => {
  return {
    type: ActionTypes.SERVER.START_ROUND
  };
};

/**
 * Skip the current word.
 */
GameActions.skipWord = () => {
  return {
    type: ActionTypes.SERVER.SKIP_WORD
  };
};

/**
 * Correctly guessed the current word.
 */
GameActions.correctWord = () => {
  return {
    type: ActionTypes.SERVER.CORRECT_WORD
  };
};

/**
 * Ask to replace the current game.
 */
GameActions.outOfSync = () => {
  return {
    type: ActionTypes.SERVER.OUT_OF_SYNC
  };
};