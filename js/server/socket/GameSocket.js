'use strict';
// @flow


/**
 *
 * @param io
 */
exports.init = (io:SocketIO) => {
  io.use((socket, next) => {
    socket.io = io;
    next();
  });
  io.use(require('./SocketPlayerAttacher'));
  io.use(require('./SocketLogger'));
  io.use(require('./SocketHeartbeat'));
  io.use(require('./SocketGameLookup'));
  io.use(require('./SocketMethods'));
  io.use(require('./SocketActionHandlers'));
};