'use strict';
// @flow


const GameStore = require('../../GameStore');
const MessageTypes = require('../../../shared/MessageTypes.js');

/**
 * Dispatch an action to the GameStore then the clients.
 * @param socket
 * @param action
 * @param actionTransform {function(action,game):action=}
 */
exports.dispatch = (socket:Socket, action:Object, actionTransform:?Function) => {
  GameStore.dispatch(socket.gameId, action)
    .then((game) => {
      if (typeof actionTransform == 'function') {
        action = actionTransform(action, game);
      }
      if (!action.hasOwnProperty('gameHashCode')) {
        action.gameHashCode = game.hashCode();
      }
      socket.gameRoom.emit(MessageTypes.GAME, action);
    })
    .catch((error) => {
      console.error(error);
      socket.emit(MessageTypes.ERROR, error);
    });
};