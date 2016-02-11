/**
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  console.log('User connected with id', socket.user.id);
  socket.on('disconnect', function () {
    console.log('User disconnected with id', socket.user.id);
  });
  next();
};