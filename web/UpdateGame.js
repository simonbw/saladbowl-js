var GameActions = require('../shared/ActionTypes');
var MessageTypes = require('../shared/MessageTypes');

var UpdateGame = module.exports;

/**
 * Call this to bind the socket to the class.
 * @param socket
 */
UpdateGame.init = function (socket) {
  this.socket = socket;
}.bind(UpdateGame);

/**
 * Send a join game action.
 * @param name
 */
UpdateGame.joinGame = function (name) {
  console.log('joining game');
  this.socket.emit(MessageTypes.GAME, {
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
  this.socket.emit(MessageTypes.GAME, {
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
  this.socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.JOIN_TEAM,
    team: team
  });
}.bind(UpdateGame);

/**
 * Start the game.
 */
UpdateGame.startGame = function () {
  this.socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.START_GAME
  });
}.bind(this);

/**
 * Start the round.
 */
UpdateGame.startRound = function () {
  this.socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.START_ROUND
  });
}.bind(UpdateGame);

/**
 * Skip the current word.
 */
UpdateGame.skipWord = function () {
  this.socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.SKIP_WORD
  });
}.bind(UpdateGame);

/**
 * Correctly guessed the current word.
 */
UpdateGame.correctWord = function () {
  this.socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.CORRECT_WORD
  });
}.bind(UpdateGame);


