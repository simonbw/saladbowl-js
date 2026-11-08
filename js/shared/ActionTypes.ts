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
    SHUFFLE_TEAMS: 'SERVER.SHUFFLE_TEAMS',
    SKIP_WORD: 'SERVER.SKIP_WORD',
    START_GAME: 'SERVER.START_GAME',
    START_ROUND: 'SERVER.START_ROUND',
    SKIP_PLAYER: 'SERVER.SKIP_PLAYER',
    UNDO_CORRECT: 'SERVER.UNDO_CORRECT',
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
    TEAMS_SHUFFLED: 'CLIENT.TEAMS_SHUFFLED',
    WORDS_UPDATED: 'CLIENT.WORDS_UPDATED',

    // mid game
    ROUND_ENDED: 'CLIENT.ROUND_ENDED',
    ROUND_STARTED: 'CLIENT.ROUND_STARTED',
    WORD_CORRECT: 'CLIENT.WORD_CORRECT',
    WORD_SKIPPED: 'CLIENT.WORD_SKIPPED',
    PLAYER_SKIPPED: 'CLIENT.PLAYER_SKIPPED',
    CORRECT_UNDONE: 'CLIENT.CORRECT_UNDONE',

    // post game
    NEXT_GAME_CREATED: 'CLIENT.NEXT_GAME_CREATED',
  },

  /////////////
  // UI ONLY //
  /////////////
  UI: {
    FIELD_CHANGED: 'UI.FIELD_CHANGED',
    // A SERVER.* action's mutation finished (or failed).
    SERVER_ACTION_SETTLED: 'UI.SERVER_ACTION_SETTLED',
    // Show a message in the error banner.
    SHOW_ERROR: 'UI.SHOW_ERROR',
    DISMISS_ERROR: 'UI.DISMISS_ERROR',
    // A short full-screen announcement ("Time's up!", "Round 2: Charades").
    SHOW_ANNOUNCEMENT: 'UI.SHOW_ANNOUNCEMENT',
    DISMISS_ANNOUNCEMENT: 'UI.DISMISS_ANNOUNCEMENT',
  },
};

export default ActionTypes;
