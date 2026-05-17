'use strict';

import ConnectionHandlers from './ConnectionHandlers';
import ErrorHandlers from './ErrorHandlers';
import GameHandlers from './GameHandlers';
import RoutingHandlers from './RoutingHandlers';
import TimingHandlers from './TimingHandlers';

/**
 * @type {Object<string, function>}
 */
const handlers = [
  ConnectionHandlers,
  ErrorHandlers,
  GameHandlers,
  RoutingHandlers,
  TimingHandlers
];

const SocketHandlers = {};

/**
 * Initialize all handlers on a socket.
 * @param socket
 */
SocketHandlers.init = (socket) => {
  handlers.forEach((handler) => handler(socket));
};

export default SocketHandlers;
