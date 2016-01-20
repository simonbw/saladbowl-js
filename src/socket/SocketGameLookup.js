const GameStore = require('../GameStore.js');


/**
 * Attach the game to the socket.
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  var gameId = socket.handshake.query.gameId;
  GameStore.get(gameId)
    .then(function (game) {
      if (!game) {
        throw Error('Game not found');
      }
      socket.game = game;
      console.log('socket attached game', game);
      socket.emitReplaceGame();
      next();
    })
    .catch(function (error) {
      socket.emitError('Error retrieving game: ' + gameId);
    });
};
