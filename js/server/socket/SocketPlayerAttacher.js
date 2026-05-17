'use strict';

/**
 * @param socket
 * @param next
 */
export default (socket, next) => {
  socket.user = {
    'id': socket.request.cookies.userId
  };
  next();
};
