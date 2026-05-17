'use strict';

import MessageTypes from '../../shared/MessageTypes.js';
import Timing from '../Timing';

const HEARTBEAT_INTERVAL = 500;

export default (socket) => {
  let sentHeartbeatAt;
  socket.on(MessageTypes.HEARTBEAT, (data) => {
    Timing.update(sentHeartbeatAt, data.time);

    setTimeout(() => {
      sentHeartbeatAt = Date.now();
      socket.emit(MessageTypes.HEARTBEAT);
    }, HEARTBEAT_INTERVAL);
  });

  setTimeout(() => {
    sentHeartbeatAt = Date.now();
    socket.emit(MessageTypes.HEARTBEAT);
  }, 100);
};
