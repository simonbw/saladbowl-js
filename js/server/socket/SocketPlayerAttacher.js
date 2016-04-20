'use strict';

/**
 * @param socket
 * @param next
 */
module.exports = (socket, next) => {
  socket.user = {
    'id': socket.request.cookies.userId
  };
  next();
};