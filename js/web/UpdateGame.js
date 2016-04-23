'use strict';

const GameActions = require('../shared/ActionTypes');
const MessageTypes = require('../shared/MessageTypes');

const UpdateGame = module.exports;

/**
 * The socket.io socket.
 */
var socket;

/**
 * Call this to bind the socket to the class.
 * @param s
 */
UpdateGame.init = (s) => {
  socket = s;
};

/**
 * Send a join game action.
 * @param name
 */
UpdateGame.joinGame = (name) => {
  console.log('joining game');
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.JOIN_GAME,
    name: name
  });
};

/**
 * Send a bunch of save word actions.
 * @param words
 */
UpdateGame.saveWords = (words) => {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.SAVE_WORDS,
    words: words
  })
};

/**
 * Join a team.
 * @param team
 */
UpdateGame.joinTeam = (team) => {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.JOIN_TEAM,
    team: team
  });
};

/**
 * Start the game.
 */
UpdateGame.startGame = () => {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.START_GAME
  });
};

/**
 * Start the round.
 */
UpdateGame.startRound = () => {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.START_ROUND
  });
};

/**
 * Skip the current word.
 */
UpdateGame.skipWord = () => {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.SKIP_WORD
  });
};

/**
 * Correctly guessed the current word.
 */
UpdateGame.correctWord = () => {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.CORRECT_WORD
  });
};

/**
 * Ask to replace the current game.
 */
UpdateGame.outOfSync = () => {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.OUT_OF_SYNC
  });
};
