const ActionTypes = require('../shared/ActionTypes');
const GameStore = require('./GameStore');

const actionHandlers = {};

module.exports = function (io) {
  io.use(function (socket, next) {
    GameStore.get(socket.handshake.query.gameId).then(function (game) {
      socket.game = game;
      next();
    });
  });
  io.on('connection', function (socket) {
    var userId = socket.request.cookies.userId;
    console.log('user connected', userId);

    socket.emit('GAME', {
      type: ActionTypes.WHOLE_GAME,
      game: socket.game
    });

    socket.on('GAME', function (data) {
      console.log(data);
      if (actionHandlers.hasOwnProperty(data.type)) {
        actionHandlers[data.type](data);
      } else {
        console.error('Unknown Action', data);
      }
    });

    socket.on('disconnect', function () {
      console.log('User disconnected', userId);
    });
  });
};