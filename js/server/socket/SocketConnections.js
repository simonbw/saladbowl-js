'use strict';

const HandlerHelpers = require('./handlers/HandlerHelpers');
const ActionTypes = require('../../shared/ActionTypes.js');

/**
 * @param socket
 * @param next
 */
module.exports = (socket, next) => {
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