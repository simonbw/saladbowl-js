const ActionTypes = require('../../shared/ActionTypes');
const MessageTypes = require('../../shared/MessageTypes.js');
const GameStore = require('../GameStore');

/**
 * Map of all action handlers.
 */
const handlers = {};

/**
 *
 */
handlers[ActionTypes.SERVER.ADD_WORD] = function (data, socket) {
  console.log('adding word');
  // TODO: Validation
  GameStore.addWord(socket.gameId, data.word)
    .then(function () {
      socket.io.to(socket.gameId).emit(MessageTypes.GAME, {
        type: ActionTypes.CLIENT.WORD_ADDED,
        word: data.word
      });
    });
};

/**
 *
 */
handlers[ActionTypes.SERVER.JOIN_GAME] = function (data, socket) {
  console.log('joining game');
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
      handlers[data.type](data, socket);
    } else {
      console.error('Unknown Action', data);
    }
  });
  next();
};