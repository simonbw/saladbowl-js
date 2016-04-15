var ActionTypes = require('../../../shared/ActionTypes');
var GameStore = require('../../GameStore');
var MessageTypes = require('../../../shared/MessageTypes');

/**
 * Replace the game when out of sync.
 */
exports[ActionTypes.SERVER.OUT_OF_SYNC] = function (data, socket) {
  GameStore.get(socket.gameId).then(function (game) {
      socket.emit(MessageTypes.GAME, {
        type: ActionTypes.CLIENT.REPLACE_GAME,
        game: game.toJS(),
        gameHashCode: game.hashCode()
      });
    })
    .catch(function (error) {
      console.error(error);
      socket.emit(MessageTypes.ERROR, error);
    });
};
