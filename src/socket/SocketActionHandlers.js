var ActionTypes = require('../../shared/ActionTypes');
var MessageTypes = require('../../shared/MessageTypes.js');
var GameStore = require('../GameStore');

/**
 * Map of all action handlers.
 */
var handlers = {};

/**
 *
 */
handlers[ActionTypes.SERVER.ADD_WORD] = function (data, socket) {
  console.log('adding word');
  // TODO: Validation
  var action = {
    type: ActionTypes.CLIENT.WORD_ADDED,
    word: data.word,
    playerId: socket.request.cookies.userId
  };
  GameStore.dispatch(socket.gameId, action)
    .then(function (game) {
      socket.io.to(socket.gameId).emit(MessageTypes.GAME, action);
    });
};

/**
 *
 */
handlers[ActionTypes.SERVER.JOIN_GAME] = function (data, socket) {
  console.log('joining game');
  // TODO: Join Game
};


/**
 *
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  socket.on(MessageTypes.GAME, function (data) {
    console.log(data);
    if (handlers.hasOwnProperty(data.type)) {
      // TODO: Error handling
      handlers[data.type](data, socket);
    } else {
      console.error('Unknown Action', data);
    }
  });
  next();
};