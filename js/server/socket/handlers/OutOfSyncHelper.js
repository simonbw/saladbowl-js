'use strict';

import ActionTypes from '../../../shared/ActionTypes';
import GameStore from '../../GameStore';
import MessageTypes from '../../../shared/MessageTypes';

const handlers = {};

/**
 * Replace the game when out of sync.
 */
handlers[ActionTypes.SERVER.OUT_OF_SYNC] = (data, socket) => {
  GameStore.get(socket.gameId).then((game) => {
      socket.emit(MessageTypes.GAME, {
        type: ActionTypes.CLIENT.REPLACE_GAME,
        game: game.toJS(),
        gameHashCode: game.hashCode()
      });
    })
    .catch((error) => {
      console.error('error getting game:', error, error.stack);
      socket.emit(MessageTypes.ERROR, error);
    });
};

export default handlers;
