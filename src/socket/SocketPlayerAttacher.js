/**
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  socket.user = {
    'id': socket.request.cookies.userId
  };
  next();
};