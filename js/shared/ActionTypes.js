'use strict';

/**
 * @file Defines all types of actions that modify games.
 */

const ActionTypes = {};

//////////////////////
// CLIENT TO SERVER //
//////////////////////
ActionTypes.SERVER = {};
ActionTypes.SERVER.SAVE_WORDS = 'SERVER.SAVE_WORDS';
ActionTypes.SERVER.CORRECT_WORD = 'SERVER.CORRECT_WORD';
ActionTypes.SERVER.END_ROUND = 'SERVER.END_ROUND';
ActionTypes.SERVER.JOIN_GAME = 'SERVER.JOIN_GAME';
ActionTypes.SERVER.JOIN_TEAM = 'SERVER.JOIN_TEAM';
ActionTypes.SERVER.SKIP_WORD = 'SERVER.SKIP_WORD';
ActionTypes.SERVER.START_GAME = 'SERVER.START_GAME';
ActionTypes.SERVER.START_ROUND = 'SERVER.START_ROUND';
ActionTypes.SERVER.OUT_OF_SYNC = 'SERVER.OUT_OF_SYNC';
ActionTypes.SERVER.SKIP_PLAYER = 'SERVER.SKIP_PLAYER';

//////////////////////
// SERVER TO CLIENT //
//////////////////////
ActionTypes.CLIENT = {};

// misc
ActionTypes.CLIENT.REPLACE_GAME = 'CLIENT.REPLACE_GAME';
ActionTypes.CLIENT.SET_USER_ID = 'CLIENT.SET_USER_ID';
ActionTypes.CLIENT.USER_CONNECTION = 'CLIENT.USER_CONNECTION';

// pre game
ActionTypes.CLIENT.GAME_STARTED = 'CLIENT.GAME_STARTED';
ActionTypes.CLIENT.PLAYER_JOINED = 'CLIENT.PLAYER_JOINED';
ActionTypes.CLIENT.TEAM_JOINED = 'CLIENT.TEAM_JOINED';
ActionTypes.CLIENT.WORDS_UPDATED = 'CLIENT.WORDS_UPDATED';

// mid game
ActionTypes.CLIENT.ROUND_ENDED = 'CLIENT.ROUND_ENDED';
ActionTypes.CLIENT.ROUND_STARTED = 'CLIENT.ROUND_STARTED';
ActionTypes.CLIENT.WORD_CORRECT = 'CLIENT.WORD_CORRECT';
ActionTypes.CLIENT.WORD_SKIPPED = 'CLIENT.WORD_SKIPPED';
ActionTypes.CLIENT.PLAYER_SKIPPED = 'CLIENT.PLAYER_SKIPPED';

// TODO: Pausing?


/////////////
// UI ONLY //
/////////////
ActionTypes.UI = {};
ActionTypes.UI.FIELD_CHANGED = 'UI.FIELD_CHANGED';

export default ActionTypes;
