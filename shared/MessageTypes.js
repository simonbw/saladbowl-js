/**
 * @file Types of messages that can be passed through the socket.
 */

/**
 * Sent to the client when an error occurs.
 * @type {string}
 */
exports.ERROR = 'error';

/**
 * Sent to the client when the game state changes.
 * @type {string}
 */
exports.GAME = 'GAME';

/**
 * Used for syncing clocks.
 * @type {string}
 */
exports.HEARTBEAT = 'HEARTBEAT';

/**
 * Sent to the client when redirecting to a new page.
 * @type {string}
 */
exports.REDIRECT = 'REDIRECT';
