'use strict';

/**
 * @file Defines all types of actions that modify games.
 */

const ActionTypes = {
  //////////////////////
  // CLIENT TO SERVER //
  //////////////////////
  SERVER: {
    SAVE_WORDS: 'SERVER.SAVE_WORDS',
    CORRECT_WORD: 'SERVER.CORRECT_WORD',
    END_ROUND: 'SERVER.END_ROUND',
    JOIN_GAME: 'SERVER.JOIN_GAME',
    JOIN_TEAM: 'SERVER.JOIN_TEAM',
    SKIP_WORD: 'SERVER.SKIP_WORD',
    START_GAME: 'SERVER.START_GAME',
    START_ROUND: 'SERVER.START_ROUND',
    OUT_OF_SYNC: 'SERVER.OUT_OF_SYNC',
    SKIP_PLAYER: 'SERVER.SKIP_PLAYER',
  },

  //////////////////////
  // SERVER TO CLIENT //
  //////////////////////
  CLIENT: {
    // misc
    REPLACE_GAME: 'CLIENT.REPLACE_GAME',
    SET_USER_ID: 'CLIENT.SET_USER_ID',
    USER_CONNECTION: 'CLIENT.USER_CONNECTION',

    // pre game
    GAME_STARTED: 'CLIENT.GAME_STARTED',
    PLAYER_JOINED: 'CLIENT.PLAYER_JOINED',
    TEAM_JOINED: 'CLIENT.TEAM_JOINED',
    WORDS_UPDATED: 'CLIENT.WORDS_UPDATED',

    // mid game
    ROUND_ENDED: 'CLIENT.ROUND_ENDED',
    ROUND_STARTED: 'CLIENT.ROUND_STARTED',
    WORD_CORRECT: 'CLIENT.WORD_CORRECT',
    WORD_SKIPPED: 'CLIENT.WORD_SKIPPED',
    PLAYER_SKIPPED: 'CLIENT.PLAYER_SKIPPED',

    // TODO: Pausing?
  },

  /////////////
  // UI ONLY //
  /////////////
  UI: {
    FIELD_CHANGED: 'UI.FIELD_CHANGED',
  },
};

export default ActionTypes;
