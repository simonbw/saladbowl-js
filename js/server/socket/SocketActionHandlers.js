'use strict';

const MessageTypes = require('../../shared/MessageTypes');

/**
 * Map of all action handlers.
 */
const handlers = Object.assign({},
  require('./handlers/MidGameHandlers'),
  require('./handlers/OutOfSyncHelper'),
  require('./handlers/PreGameHandlers'));


/**
 * Bind all action handlers to socket events.
 * @param socket
 * @param next
 */
module.exports = (socket, next) => {
  socket.on(MessageTypes.GAME, (action) => {
    console.log('game action received:', action);
    if (handlers.hasOwnProperty(action.type)) {
      try {
        handlers[action.type](action, socket);
      } catch (error) {
        console.error('error handling action' + action.type, error, error.stack);
      }
    } else {
      console.error('unknown action:', action);
    }
  });
  next();
};