'use strict';

import GameStore from '../GameStore';
import ActionTypes from '../../shared/ActionTypes';
import MessageTypes from '../../shared/MessageTypes';


/**
 * Attach the game to the socket.
 * @param socket
 * @param next
 */
export default (socket, next) => {
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
      console.error('error getting game:', error, error.stack);
      next(error);
    });
};
