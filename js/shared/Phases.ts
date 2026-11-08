'use strict';

/**
 * @file The three phases ("rounds") of the game, in play order.
 */

export interface Phase {
  name: string;
  instructions: string;
}

const PHASES: Phase[] = [
  { name: 'Describe It', instructions: 'Say anything but the word.' },
  { name: 'Charades', instructions: "Just don't make a sound." },
  { name: 'One Word', instructions: 'You only get one word.' },
];

export const PHASE_COUNT = PHASES.length;

/** The phase at `phaseIndex`, clamped so a bad index never crashes a render. */
export function getPhase(phaseIndex: number): Phase {
  return PHASES[Math.min(Math.max(phaseIndex | 0, 0), PHASES.length - 1)];
}

export default PHASES;
