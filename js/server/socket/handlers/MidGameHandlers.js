'use strict';

const ActionTypes = require('../../../shared/ActionTypes');
const HandlerHelpers = require('./HandlerHelpers');

/**
 *
 */
exports[ActionTypes.SERVER.CORRECT_WORD] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.WORD_CORRECT
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.SKIP_WORD] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.WORD_SKIPPED
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.START_ROUND] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.ROUND_STARTED,
    startTime: Date.now()
  }, (action, game) => {
    // TODO: Better timer handling
    if (socket.roundTimeout) {
      clearTimeout(socket.roundTimeout);
    }
    socket.roundTimeout = setTimeout(() => {
      HandlerHelpers.dispatch(socket, {
        type: ActionTypes.CLIENT.ROUND_ENDED
      });
    }, game.get('secondsPerRound') * 1000);
    return action;
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.END_ROUND] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.ROUND_ENDED
  });
};