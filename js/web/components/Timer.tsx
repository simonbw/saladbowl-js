'use strict';

import React, { useEffect, useRef, useState } from 'react';
import Timing from '../Timing';
import { formatSeconds } from '../format';

const DELAY = 50; // milliseconds to wait before drawing again
const LOW_TIME_MS = 10_000;

interface TimerProps {
  endTime: number;
}

/**
 * Counts down to `endTime` (in server clock time), re-rendering every DELAY ms.
 */
export default function Timer(props: TimerProps) {
  const endTimeRef = useRef(props.endTime);
  endTimeRef.current = props.endTime;

  const getRemainingTime = () => endTimeRef.current - Timing.getServerTime();

  const [remaining, setRemaining] = useState<number>(getRemainingTime());

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setRemaining(getRemainingTime());
    }, DELAY);
    return () => clearInterval(timerInterval);
  }, []);

  const className = remaining < LOW_TIME_MS ? 'timer low' : 'timer';
  return <div className={className}>{formatSeconds(remaining)}</div>;
}
