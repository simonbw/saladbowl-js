'use strict';

const MessageTypes = require('../shared/MessageTypes');
const MathUtil = require('../shared/MathUtil');


const Timing = module.exports;

const offsets = [];
const MAXIMUM_OFFSETS = 20;

Timing.update = (sentHeartbeatAt, responseSendTime) => {
  const now = Date.now();
  const heartbeatDuration = now - sentHeartbeatAt;

  // Assume the request takes the same time as the response
  const serverTimeEstimate = responseSendTime + heartbeatDuration / 2;

  offsets.push(now - serverTimeEstimate);
  if (offsets.length > MAXIMUM_OFFSETS) {
    offsets.shift();
  }
};

/**
 * Return an approximation of the server's clock time.
 * @returns {number}
 */
Timing.getServerTime = () => {
  return Date.now() + Timing.getOffset();
};

/**
 * @returns {number}
 */
Timing.getOffset = () => MathUtil.median(offsets) || 0;