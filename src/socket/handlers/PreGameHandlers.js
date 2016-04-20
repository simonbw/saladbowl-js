var ActionTypes = require('../../../shared/ActionTypes');
var HandlerHelpers = require('./HandlerHelpers');

/**
 *
 */
exports[ActionTypes.SERVER.SAVE_WORDS] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.WORDS_UPDATED,
    playerId: socket.user.id,
    words: data.words
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.JOIN_GAME] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.PLAYER_JOINED,
    player: {
      id: socket.user.id,
      name: data.name,
      team: 0
    }
  }, function (action, game) {
    action.playerIndex = game.get('players').size - 1;
    return action;
  })
};

/**
 *
 */
exports[ActionTypes.SERVER.JOIN_TEAM] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.TEAM_JOINED,
    playerId: socket.user.id,
    team: data.team
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.START_GAME] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.GAME_STARTED
  });
};
