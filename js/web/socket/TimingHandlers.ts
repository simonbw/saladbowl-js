'use strict';

import MessageTypes from '../../shared/MessageTypes';
import Timing from '../Timing';

const HEARTBEAT_INTERVAL = 500;

export default (socket: any) => {
  let sentHeartbeatAt: number;
  socket.on(MessageTypes.HEARTBEAT, (data: { time: number }) => {
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
