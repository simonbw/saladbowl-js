/**
 *
 * @param io
 */
exports.init = function (io) {
  io.use(function (socket, next) {
    socket.io = io;
    next();
  });
  io.use(require('./SocketLogger'));
  io.use(require('./SocketMethods'));
  io.use(require('./SocketGameLookup'));
  io.use(require('./SocketActionHandlers'));
};