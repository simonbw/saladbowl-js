/**
 * @file Defines all types of actions that modify games.
 */

// CLIENT TO SERVER
exports.SERVER = {};
exports.SERVER.ADD_WORD = 'ADD_WORD';
exports.SERVER.JOIN_GAME = 'JOIN_GAME';

// SERVER TO CLIENT
exports.CLIENT = {};
exports.CLIENT.REPLACE_GAME = 'REPLACE_GAME';
exports.CLIENT.PLAYER_JOINED = 'PLAYER_JOINED';
exports.CLIENT.WORD_ADDED = 'WORD_ADDED';
