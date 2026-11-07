'use strict';

const KEY = 'userId';

function randomId(): string {
  // crypto.randomUUID only exists in secure contexts; phones testing against a
  // LAN dev server (http://192.168…) aren't one, but getRandomValues works.
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * This browser's player id, generated once and remembered. Replaces the old
 * server-assigned `userId` cookie.
 *
 * In dev it lives in sessionStorage instead, so each tab is a separate player —
 * handy for playing a whole game on one machine.
 */
export function getUserId(): string {
  const storage = import.meta.env.DEV ? sessionStorage : localStorage;
  let userId = storage.getItem(KEY);
  if (!userId) {
    userId = randomId();
    storage.setItem(KEY, userId);
  }
  return userId;
}
