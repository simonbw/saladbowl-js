'use strict';

/**
 * Countdown display: whole seconds normally ("60", "125"), tenths in the last
 * ten seconds ("9.4").
 */
export function formatSeconds(ms: number): string {
  const seconds = Math.max(ms, 0) / 1000;
  return seconds >= 10 ? String(Math.ceil(seconds)) : seconds.toFixed(1);
}
