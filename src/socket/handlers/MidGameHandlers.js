var ActionTypes = require('../../../shared/ActionTypes');
var HandlerHelpers = require('./HandlerHelpers');

/**
 *
 */
exports[ActionTypes.SERVER.CORRECT_WORD] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.WORD_CORRECT
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.SKIP_WORD] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.WORD_SKIPPED
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.START_ROUND] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.ROUND_STARTED
  });
};

/**
 *
 */
exports[ActionTypes.SERVER.END_ROUND] = function (data, socket) {
  HandlerHelpers.dispatch(socket, {
    type: ActionTypes.CLIENT.ROUND_ENDED
  });
};