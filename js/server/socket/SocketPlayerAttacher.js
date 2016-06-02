'use strict';
// @flow


/**
 * @param socket
 * @param next
 */
module.exports = (socket:Socket, next:Next) => {
  socket.user = {
    'id': socket.request.cookies.userId
  };
  next();
};