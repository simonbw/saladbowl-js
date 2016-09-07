'use strict';

const GameStore = require('../../GameStore');
const MessageTypes = require('../../../shared/MessageTypes.js');

/**
 * Dispatch an action to the GameStore then the clients.
 * @param socket
 * @param action
 * @param actionTransform {function(action,game):action=} - Return null to cancel emit
 */
exports.dispatch = (socket, action, actionTransform) => {
  GameStore.dispatch(socket.gameId, action)
    .then((game) => {
      if (typeof actionTransform == 'function') {
        action = actionTransform(action, game);
      }
      if (action) { // Only emit the action if it still exists after the transform
        if (!action.hasOwnProperty('gameHashCode')) {
          action.gameHashCode = game.hashCode();
        }
        socket.gameRoom.emit(MessageTypes.GAME, action);
      }
    })
    .catch((error) => {
      console.error('error dispatching action:', error, error.stack);
      socket.emit(MessageTypes.ERROR, error);
    });
};