var GameActions = require('../shared/ActionTypes');
var MessageTypes = require('../shared/MessageTypes');

var UpdateGame = module.exports;

/**
 * Call this to bind the socket to the class.
 * @param socket
 */
UpdateGame.init = function (socket) {
  this.socket = socket;
};

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
};

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
};

/**
 * Join a team.
 * @param team
 */
UpdateGame.joinTeam = function (team) {
  this.socket.emit(MessageTypes.GAME, {
    type: GameActions.SERVER.JOIN_TEAM,
    team: team
  });
};
