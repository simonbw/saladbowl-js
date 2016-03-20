/**
 * @file Defines all types of actions that modify games.
 */

//////////////////////
// CLIENT TO SERVER //
//////////////////////
exports.SERVER = {};
exports.SERVER.SAVE_WORD = 'SERVER.SAVE_WORD';
exports.SERVER.CORRECT_WORD = 'SERVER.CORRECT_WORD';
exports.SERVER.END_ROUND = 'SERVER.END_ROUND';
exports.SERVER.JOIN_GAME = 'SERVER.JOIN_GAME';
exports.SERVER.JOIN_TEAM = 'SERVER.JOIN_TEAM';
exports.SERVER.SKIP_WORD = 'SERVER.SKIP_WORD';
exports.SERVER.START_GAME = 'SERVER.START_GAME';
exports.SERVER.START_ROUND = 'SERVER.START_ROUND';

//////////////////////
// SERVER TO CLIENT //
//////////////////////
exports.CLIENT = {};

// misc
exports.CLIENT.REPLACE_GAME = 'CLIENT.REPLACE_GAME';
exports.CLIENT.SET_USER_ID = 'CLIENT.SET_USER_ID';

// pre game
exports.CLIENT.GAME_STARTED = 'CLIENT.GAME_STARTED';
exports.CLIENT.PLAYER_JOINED = 'CLIENT.PLAYER_JOINED';
exports.CLIENT.TEAM_JOINED = 'CLIENT.TEAM_JOINED';
exports.CLIENT.WORD_UPDATED = 'CLIENT.WORD_UPDATED';

// mid game
exports.CLIENT.ROUND_ENDED = 'CLIENT.ROUND_ENDED';
exports.CLIENT.ROUND_STARTED = 'CLIENT.ROUND_STARTED';
exports.CLIENT.WORD_CORRECT = 'CLIENT.WORD_CORRECT';
exports.CLIENT.WORD_SKIPPED = 'CLIENT.WORD_SKIPPED';

// TODO: Pausing?


/////////////
// UI ONLY //
/////////////
exports.UI = {};
exports.UI.FIELD_CHANGED = 'UI.FIELD_CHANGED';