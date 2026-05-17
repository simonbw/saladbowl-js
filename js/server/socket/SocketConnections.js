'use strict';

import HandlerHelpers from './handlers/HandlerHelpers';
import ActionTypes from '../../shared/ActionTypes.js';

/**
 * @param socket
 * @param next
 */
export default (socket, next) => {
  // On connection
  setImmediate(() => {
    HandlerHelpers.dispatch(socket, {
      type: ActionTypes.CLIENT.USER_CONNECTION,
      userId: socket.user.id,
      connected: true
    });
  });

  // On disconnect
  socket.on('disconnect', () => {
    HandlerHelpers.dispatch(socket, {
      type: ActionTypes.CLIENT.USER_CONNECTION,
      userId: socket.user.id,
      connected: false
    });
  });

  next();
};
