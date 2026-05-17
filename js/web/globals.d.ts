'use strict';

/**
 * @file Ambient declarations for browser globals the client relies on.
 *
 * The server renders the game page and injects `window.INITIAL_GAME`,
 * `window.INITIAL_USER_ID` and `window.DEBUG_MODE` into the document.
 */

export {};

declare global {
  interface Window {
    /** Serialized initial game state injected by the server. */
    INITIAL_GAME?: unknown;
    /** The current visitor's user id, injected by the server. */
    INITIAL_USER_ID?: string;
    /** Whether the page was rendered in debug mode. */
    DEBUG_MODE?: boolean;
    /** Debugging handle set by the client when DEBUG_MODE is on. */
    DEBUG?: unknown;
    /** Redux DevTools `compose` hook, when the extension is installed. */
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (...funcs: any[]) => any;
  }
}
