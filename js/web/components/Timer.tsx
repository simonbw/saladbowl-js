'use strict';

import React, { useEffect, useRef, useState } from 'react';
import Timing from '../Timing';

const DELAY = 50; // milliseconds to wait before drawing again
const PRECISION = 2; // number of sig figs for timer to use

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

  const seconds = Math.max(remaining / 1000, 0);
  return <div className="timer">{seconds.toPrecision(PRECISION)}</div>;
}
