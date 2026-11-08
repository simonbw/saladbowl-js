'use strict';

/**
 * @file Keep the screen on while the game page is open, using the Screen Wake
 * Lock API (Chrome, Edge, Firefox 126+, Safari 16.4+).
 *
 * The browser drops the lock whenever the page is hidden, so it's re-requested
 * when the page becomes visible again. Some browsers only grant it after a
 * user gesture, so taps retry too. Where the API is missing, this does nothing.
 */

let sentinel: WakeLockSentinel | null = null;
let requesting = false;

async function request(): Promise<void> {
  if (requesting || (sentinel && !sentinel.released) || document.visibilityState !== 'visible') {
    return;
  }
  requesting = true;
  try {
    sentinel = await navigator.wakeLock.request('screen');
  } catch {
    // Denied (no gesture yet, low battery, insecure context…). Retry on the next tap.
  } finally {
    requesting = false;
  }
}

export function keepScreenAwake(): void {
  if (!('wakeLock' in navigator)) {
    return;
  }
  void request();
  document.addEventListener('visibilitychange', () => void request());
  document.addEventListener('pointerdown', () => void request(), { capture: true });
}
