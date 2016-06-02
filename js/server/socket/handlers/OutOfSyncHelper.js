'use strict';
// @flow


const ActionTypes = require('../../../shared/ActionTypes');
const GameStore = require('../../GameStore');
const MessageTypes = require('../../../shared/MessageTypes');

/**
 * Replace the game when out of sync.
 */
exports[ActionTypes.SERVER.OUT_OF_SYNC] = (data, socket) => {
  GameStore.get(socket.gameId).then((game) => {
      socket.emit(MessageTypes.GAME, {
        type: ActionTypes.CLIENT.REPLACE_GAME,
        game: game.toJS(),
        gameHashCode: game.hashCode()
      });
    })
    .catch((error) => {
      console.error(error);
      socket.emit(MessageTypes.ERROR, error);
    });
};
