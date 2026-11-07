'use strict';

/**
 * @file Ambient declarations for browser globals the client relies on.
 */

export {};

declare global {
  interface Window {
    /** Whether debug tooling is on (true in the Vite dev server). */
    DEBUG_MODE?: boolean;
    /** Debugging handle set by the client when DEBUG_MODE is on. */
    DEBUG?: unknown;
    /** Redux DevTools `compose` hook, when the extension is installed. */
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (...funcs: any[]) => any;
  }
}
