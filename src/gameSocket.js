
module.exports = function (io) {
  io.on('connection', function (socket) {

    socket.emit('game.test', {
      message: 'hello',
      other: 'world'
    });

    var interval = setInterval(function () {
      socket.emit('game.heartbeat');
    }, 500);
    socket.on('disconnect', function () {
      console.log('User disconnected');
      clearInterval(interval);
    })
  });
};