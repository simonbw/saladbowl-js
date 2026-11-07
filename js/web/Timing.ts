'use strict';

import MathUtil from '../shared/MathUtil';

const offsets: number[] = [];
const MAXIMUM_OFFSETS = 20;

const Timing = {
  /**
   * Record a new clock-offset sample from a heartbeat round trip.
   */
  update(sentHeartbeatAt: number, responseSendTime: number): void {
    const now = Date.now();
    const heartbeatDuration = now - sentHeartbeatAt;

    // Assume the request takes the same time as the response
    const serverTimeEstimate = responseSendTime + heartbeatDuration / 2;

    offsets.push(now - serverTimeEstimate);
    if (offsets.length > MAXIMUM_OFFSETS) {
      offsets.shift();
    }
  },

  /**
   * Return an approximation of the server's clock time.
   */
  getServerTime(): number {
    return Date.now() - Timing.getOffset();
  },

  getOffset(): number {
    return MathUtil.median(offsets) || 0;
  },
};

export default Timing;
