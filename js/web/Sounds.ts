'use strict';

/**
 * @file Game sound effects, played through the Web Audio API.
 *
 * Clips are fetched and decoded once up front so they play instantly. Mobile
 * browsers keep audio suspended until the page gets a user gesture, so the
 * context is resumed on the first tap. Players can mute; that choice is
 * remembered per device.
 */

export type SoundName = 'correct-word' | 'skip-word' | 'time-up';

const SOUND_NAMES: SoundName[] = ['correct-word', 'skip-word', 'time-up'];
const MUTED_KEY = 'soundMuted';

let context: AudioContext | null = null;
const buffers = new Map<SoundName, AudioBuffer>();
let muted = readMuted();
const listeners = new Set<() => void>();

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === 'true';
  } catch {
    return false;
  }
}

/** Ogg Vorbis is smaller; Safari before 17 can't decode it. */
function extension(): string {
  try {
    return new Audio().canPlayType('audio/ogg; codecs="vorbis"') ? 'ogg' : 'wav';
  } catch {
    return 'wav';
  }
}

async function load(name: SoundName, ctx: AudioContext, ext: string): Promise<void> {
  try {
    const response = await fetch(`/sounds/${name}.${ext}`);
    const data = await response.arrayBuffer();
    buffers.set(name, await ctx.decodeAudioData(data));
  } catch (error) {
    console.warn(`could not load sound ${name}:`, error);
  }
}

/** Create the audio context, start loading clips, and unlock on first tap. */
export function initSounds(): void {
  if (context || typeof AudioContext === 'undefined') {
    return;
  }
  context = new AudioContext();
  const ext = extension();
  SOUND_NAMES.forEach((name) => void load(name, context!, ext));

  const unlock = () => {
    if (context && context.state !== 'running') {
      void context.resume();
    }
  };
  // Not `once`: iOS can re-suspend the context after the page is backgrounded.
  document.addEventListener('pointerdown', unlock, { capture: true });
  document.addEventListener('keydown', unlock, { capture: true });
}

/** Play a clip, unless muted or not loaded yet. */
export function playSound(name: SoundName): void {
  const buffer = buffers.get(name);
  if (muted || !context || !buffer) {
    return;
  }
  if (context.state !== 'running') {
    void context.resume();
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
}

/** Buzz the phone, where supported (not on iOS). */
export function vibrate(pattern: number | number[]): void {
  if (!muted && typeof navigator.vibrate === 'function') {
    navigator.vibrate(pattern);
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem(MUTED_KEY, String(value));
  } catch {
    // Storage blocked; the setting just won't persist.
  }
  listeners.forEach((listener) => listener());
}

/** For the mute toggle: re-render when the setting changes. */
export function subscribeMuted(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
