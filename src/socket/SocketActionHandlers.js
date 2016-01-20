const ActionTypes = require('../../shared/ActionTypes');
const MessageTypes = require('../../shared/MessageTypes.js');

/**
 * Map of all action handlers.
 */
const handlers = {};

/**
 *
 */
handlers[ActionTypes.SERVER.ADD_WORD] = function (data, socket) {
  console.log('adding word');
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
  socket.on(MessageTypes.GAME, function (data, callback) {
    console.log(data);
    if (handlers.hasOwnProperty(data.type)) {
      handlers[data.type](data, socket);
    } else {
      console.error('Unknown Action', data);
    }
    callback(MessageTypes.RECEIVED);
  });
  next();
};