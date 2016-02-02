var GameStore = require('../GameStore.js');
var ActionTypes = require('../../shared/ActionTypes.js');


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
      socket.emitAction({
        type: ActionTypes.CLIENT.REPLACE_GAME,
        game: game
      });
      next();
    })
    .catch(function (error) {
      console.error('SocketGameLookup Error:', error);
      next(error);
    });
};
