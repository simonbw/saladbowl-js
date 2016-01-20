const SocketLogger = require('./SocketLogger');
const SocketMethods = require('./SocketMethods');
const SocketGameLookup = require('./SocketGameLookup');
const SocketActionHandlers = require('./SocketActionHandlers');


/**
 *
 * @param io
 */
exports.init = function (io) {
  io.use(SocketLogger);
  io.use(SocketMethods);
  io.use(SocketGameLookup);
  io.use(SocketActionHandlers);
};