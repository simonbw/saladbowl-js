'use strict';

/**
 * @param socket
 * @param next
 */
module.exports = (socket, next) => {
  console.log('user connected with id', socket.user.id);
  socket.on('disconnect', () => {
    console.log('user disconnected with id', socket.user.id);
  });
  next();
};