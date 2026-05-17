'use strict';

import MessageTypes from '../../shared/MessageTypes';

/**
 * @param socket
 * @param next
 */
export default (socket, next) => {
  socket.on(MessageTypes.HEARTBEAT, () => {
    socket.emit(MessageTypes.HEARTBEAT, {time: Date.now()});
  });
  next();
};
