'use strict';
// @flow


/**
 * @param socket
 * @param next
 */
module.exports = (socket:Socket, next:Next) => {
  console.log('User connected with id', socket.user.id);
  socket.on('disconnect', () => {
    console.log('User disconnected with id', socket.user.id);
  });
  next();
};