'use strict';

const ActionTypes = require('../../../shared/ActionTypes');
const HandlerHelpers = require('./HandlerHelpers');

/**
 *
 */
exports[ActionTypes.SERVER.SAVE_WORDS] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.WORDS_UPDATED,
    playerId: socket.user.id,
    words: data.words
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.JOIN_GAME] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.PLAYER_JOINED,
    player: {
      id: socket.user.id,
      name: data.name
    }
  }, (action, game) => {
    action.playerIndex = game.get('players').size - 1;
    return action;
  })
};

/**
 *
 */
exports[ActionTypes.SERVER.JOIN_TEAM] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.TEAM_JOINED,
    playerId: socket.user.id,
    team: data.team
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.START_GAME] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.GAME_STARTED
  });
};
