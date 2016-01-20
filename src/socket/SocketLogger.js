/**
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  var userId = socket.request.cookies.userId;
  console.log('User connected with id', userId);
  socket.on('disconnect', function () {
    console.log('User disconnected with id', userId);
  });
  next();
};