var GameActions = require('../shared/ActionTypes');
var MessageTypes = require('../shared/MessageTypes');

var UpdateGame = module.exports;

/**
 * The socket.io socket.
 */
var socket;

/**
 * Call this to bind the socket to the class.
 * @param socket
 */
UpdateGame.init = function (s) {
  socket = s;
}.bind(UpdateGame);

/**
 * Send a join game action.
 * @param name
 */
UpdateGame.joinGame = function (name) {
  console.log('joining game');
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.JOIN_GAME,
    name: name
  });
}.bind(UpdateGame);

/**
 * Send a save word action.
 * @param word
 * @param playerWordIndex
 */
UpdateGame.saveWord = function (word, playerWordIndex) {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.SAVE_WORD,
    word: word,
    playerWordIndex: playerWordIndex
  });
}.bind(UpdateGame);

/**
 * Join a team.
 * @param team
 */
UpdateGame.joinTeam = function (team) {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.JOIN_TEAM,
    team: team
  });
}.bind(UpdateGame);

/**
 * Start the game.
 */
UpdateGame.startGame = function () {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.START_GAME
  });
}.bind(this);

/**
 * Start the round.
 */
UpdateGame.startRound = function () {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.START_ROUND
  });
}.bind(UpdateGame);

/**
 * Skip the current word.
 */
UpdateGame.skipWord = function () {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.SKIP_WORD
  });
}.bind(UpdateGame);

/**
 * Correctly guessed the current word.
 */
UpdateGame.correctWord = function () {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.CORRECT_WORD
  });
}.bind(UpdateGame);

/**
 * Ask to replace the current game.
 */
UpdateGame.outOfSync = function () {
  socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.OUT_OF_SYNC
  });
}.bind(UpdateGame);
