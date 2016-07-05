'use strict';

/**
 *
 * @param io
 */
exports.init = (io) => {
  io.use((socket, next) => {
    socket.io = io;
    next();
  });
  io.use(require('./SocketPlayerAttacher'));
  io.use(require('./SocketLogger'));
  io.use(require('./SocketHeartbeat'));
  io.use(require('./SocketGameLookup'));
  io.use(require('./SocketActionHandlers'));
  io.use(require('./SocketConnections'));
};