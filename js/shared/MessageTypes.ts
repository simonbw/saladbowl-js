'use strict';

/**
 * @file Types of messages that can be passed through the socket.
 */

const MessageTypes = {
  /**
   * Sent to the client when an error occurs.
   * @type {string}
   */
  ERROR: 'error',

  /**
   * Sent to the client when the game state changes.
   * @type {string}
   */
  GAME: 'GAME',

  /**
   * Used for syncing clocks.
   * @type {string}
   */
  HEARTBEAT: 'HEARTBEAT',

  /**
   * Sent to the client when redirecting to a new page.
   * @type {string}
   */
  REDIRECT: 'REDIRECT',
};

export default MessageTypes;
