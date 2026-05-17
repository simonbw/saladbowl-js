'use strict';

import MessageTypes from '../../shared/MessageTypes.js';

// The prefix that all server actions start with
const serverActionPrefix = 'SERVER.';

/**
 *
 */
export default (socket) => (store) => (next) => (action) => {
  if (action.type.substring(0, serverActionPrefix.length) == serverActionPrefix) {
    console.log('sending server action:', action);
    socket.emit(MessageTypes.GAME, action);
  } else {
    return next(action);
  }
};
