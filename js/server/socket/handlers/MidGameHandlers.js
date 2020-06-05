'use strict';

const ActionTypes = require('../../../shared/ActionTypes');
const HandlerHelpers = require('./HandlerHelpers');

/**
 *
 */
exports[ActionTypes.SERVER.CORRECT_WORD] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.WORD_CORRECT,
    time: Date.now()
  }, (action, game) => {
    if (!game.get('roundStarted')) { // That was the end of the round
      clearTimeout(socket.roundTimeout);
    }
    return action;
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
  const leftover = game.get('secondsLeftover');
  const secondsThisRound = leftover > 0
    ? leftover + game.get('bonusSeconds')
    : game.get('secondsPerRound');
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.ROUND_STARTED,
    startTime: Date.now(),
    secondsThisRound: secondsThisRound
  }, (action, game) => {
    // TODO: Better timer handling
    if (socket.roundTimeout) {
      clearTimeout(socket.roundTimeout);
    }
    socket.roundTimeout = setTimeout(() => {
      HandlerHelpers.dispatch(socket, {
        type: ActionTypes.CLIENT.ROUND_ENDED
      });
    }, secondsThisRound * 1000);
    return action;
  });
};

// Never actually happens because the server is the one that decides when rounds end
exports[ActionTypes.SERVER.END_ROUND] = (data, socket) => {
  if (socket.roundTimeout) {
    clearTimeout(socket.roundTimeout);
  }
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.ROUND_ENDED
  });
};

exports[ActionTypes.SERVER.SKIP_PLAYER] = (data, socket) => {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.PLAYER_SKIPPED,
    playerId: data.playerId
  });
};
