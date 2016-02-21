var GameStore = require('../../GameStore');
var MessageTypes = require('../../../shared/MessageTypes.js');

/**
 * Dispatch an action to the GameStore then the clients.
 * @param socket
 * @param action
 * @param actionTransform {function(action,game):action=}
 */
exports.dispatch = function (socket, action, actionTransform) {
  GameStore.dispatch(socket.gameId, action)
    .then(function (game) {
      if (typeof actionTransform == 'function') {
        action = actionTransform(action, game);
      }
      if (!action.hasOwnProperty('gameHashCode')) {
        action.gameHashCode = game.hashCode();
      }
      socket.gameRoom.emit(MessageTypes.GAME, action);
    })
    .catch(function (error) {
      console.error(error);
      socket.emit(MessageTypes.ERROR, error);
    });
};