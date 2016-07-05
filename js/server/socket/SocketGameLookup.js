'use strict';

const GameStore = require('../GameStore');
const ActionTypes = require('../../shared/ActionTypes');
const MessageTypes = require('../../shared/MessageTypes');


/**
 * Attach the game to the socket.
 * @param socket
 * @param next
 */
module.exports = (socket, next) => {
  socket.gameId = socket.handshake.query.gameId;
  GameStore.get(socket.gameId)
    .then((game) => {
      if (!game) {
        throw Error('Game not found');
      }
      socket.join(socket.gameId);
      socket.gameRoom = socket.io.to(socket.gameId);
      next();
    })
    .catch((error) => {
      console.error('SocketGameLookup Error:', error);
      next(error);
    });
};
