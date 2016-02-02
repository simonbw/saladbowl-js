var GameActions = require('../shared/ActionTypes.js');

var UpdateGame = module.exports;

UpdateGame.init = function (socket) {
  this.socket = socket;
};

UpdateGame.addWord = function (word) {
  this.socket.emit('GAME', {
    type: GameActions.SERVER.ADD_WORD,
    word: word
  });
};
