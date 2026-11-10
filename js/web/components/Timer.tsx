'use strict';

import React, { useEffect, useRef, useState } from 'react';
import Timing from '../Timing';

const DELAY = 50; // milliseconds between redraws

/** Milliseconds until `endTime` (server clock), updated every DELAY ms. */
function useRemaining(endTime: number): number {
  const endTimeRef = useRef(endTime);
  endTimeRef.current = endTime;
  const get = () => Math.max(0, endTimeRef.current - Timing.getServerTime());
  const [remaining, setRemaining] = useState(get);
  useEffect(() => {
    const interval = setInterval(() => setRemaining(get()), DELAY);
    return () => clearInterval(interval);
  }, []);
  return remaining;
}

interface TimerProps {
  endTime: number; // server clock, ms
  totalMs: number; // the turn's full length, for the progress
}

const fraction = (remaining: number, total: number) => Math.min(1, Math.max(0, total > 0 ? remaining / total : 0));

/**
 * The clue-giver's timer: a bar that drains, no number, so the slip stays the
 * thing to read.
 */
export function TimerBar(props: TimerProps) {
  const remaining = useRemaining(props.endTime);
  const seconds = Math.ceil(remaining / 1000);
  return (
    <div className="timer-bar" role="timer" aria-label={`${seconds} seconds left`}>
      <div className="timer-bar-fill" style={{ width: `${fraction(remaining, props.totalMs) * 100}%` }}/>
    </div>
  );
}

const RING = 264; // diameter, px
const RING_STROKE = 8;

/**
 * Everyone else's timer: the seconds left inside a ring that empties
 * clockwise from 12 o'clock, like a hand sweeping round.
 */
export function TimerRing(props: TimerProps) {
  const remaining = useRemaining(props.endTime);
  const seconds = Math.ceil(remaining / 1000);
  const c = RING / 2;
  const r = c - RING_STROKE / 2 - 1;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="timer-ring" role="timer" aria-label={`${seconds} seconds left`}>
      <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`} fill="none" strokeWidth={RING_STROKE} aria-hidden="true">
        <circle className="timer-ring-track" cx={c} cy={c} r={r}/>
        {remaining > 0 && (
          <circle
            className="timer-ring-fill"
            cx={c} cy={c} r={r}
            strokeLinecap="round"
            strokeDasharray={`${circumference * fraction(remaining, props.totalMs)} ${circumference}`}
          />
        )}
      </svg>
      <span className="timer-ring-seconds" aria-hidden="true">{seconds}</span>
    </div>
  );
}

/** endTime/totalMs for the running turn. */
export function turnTiming(game: any): TimerProps {
  const totalMs = game.get('secondsThisRound') * 1000;
  return { endTime: game.get('roundStartedAt') + totalMs, totalMs };
}
