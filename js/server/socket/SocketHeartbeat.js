'use strict';
// @flow


const MessageTypes = require('../../shared/MessageTypes');

/**
 * @param socket
 * @param next
 */
module.exports = (socket:Socket, next:Next) => {
  socket.on(MessageTypes.HEARTBEAT, () => {
    socket.emit(MessageTypes.HEARTBEAT, {time: Date.now()});
  });
  next();
};