/**
 *
 * @param io
 */
exports.init = function (io) {
  io.use(function (socket, next) {
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