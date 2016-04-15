var MessageTypes = require('../../shared/MessageTypes');

/**
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  socket.on(MessageTypes.HEARTBEAT, function () {
    socket.emit(MessageTypes.HEARTBEAT, {time: Date.now()});
  });
  next();
};