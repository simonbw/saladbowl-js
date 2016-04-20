'use strict';

const MessageTypes = require('../../shared/MessageTypes');

/**
 * @param socket
 * @param next
 */
module.exports = (socket, next) => {
  socket.on(MessageTypes.HEARTBEAT, () => {
    socket.emit(MessageTypes.HEARTBEAT, {time: Date.now()});
  });
  next();
};