'use strict';

import MessageTypes from '../../shared/MessageTypes';
import MidGameHandlers from './handlers/MidGameHandlers';
import OutOfSyncHelper from './handlers/OutOfSyncHelper';
import PreGameHandlers from './handlers/PreGameHandlers';

/**
 * Map of all action handlers.
 */
const handlers = Object.assign({},
  MidGameHandlers,
  OutOfSyncHelper,
  PreGameHandlers);


/**
 * Bind all action handlers to socket events.
 * @param socket
 * @param next
 */
export default (socket, next) => {
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
