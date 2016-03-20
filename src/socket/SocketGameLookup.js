var GameStore = require('../GameStore');
var ActionTypes = require('../../shared/ActionTypes');
var MessageTypes = require('../../shared/MessageTypes');


/**
 * Attach the game to the socket.
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  socket.gameId = socket.handshake.query.gameId;
  GameStore.get(socket.gameId)
    .then(function (game) {
      if (!game) {
        throw Error('Game not found');
      }
      socket.join(socket.gameId);
      socket.gameRoom = socket.io.to(socket.gameId);
      socket.emit(MessageTypes.GAME, {
        type: ActionTypes.CLIENT.REPLACE_GAME,
        game: game.toJS()
      });
      next();
    })
    .catch(function (error) {
      console.error('SocketGameLookup Error:', error);
      next(error);
    });
};
