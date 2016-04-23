'use strict';

const MessageTypes = require('../shared/MessageTypes');
const MathUtil = require('../shared/MathUtil');


const Timing = module.exports;

const HEARTBEAT_INTERVAL = 1000;

const offsets = [];

/**
 * The socket.io socket.
 */
Timing.init = (socket) => {
  var sentHeartbeatAt = Date.now();
  socket.on(MessageTypes.HEARTBEAT, (data) => {
    const now = Date.now();
    const heartbeatDuration = now - sentHeartbeatAt;

    // Assume the request takes the same time as the response
    const serverTime = data.time + heartbeatDuration / 2;
    offsets.push(now - serverTime);

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

/**
 * Return an approximation of the server's clock time.
 * @returns {number}
 */
Timing.getServerTime = () => {
  const total = MathUtil.sum(offsets);
  const averageOffset = total / offsets.length;
  return Date.now() + averageOffset;
};