'use strict';

import ConnectionHandlers from './ConnectionHandlers';
import ErrorHandlers from './ErrorHandlers';
import GameHandlers from './GameHandlers';
import RoutingHandlers from './RoutingHandlers';
import TimingHandlers from './TimingHandlers';

const handlers: Array<(socket: any) => void> = [
  ConnectionHandlers,
  ErrorHandlers,
  GameHandlers,
  RoutingHandlers,
  TimingHandlers,
];

const SocketHandlers = {
  /**
   * Initialize all handlers on a socket.
   */
  init(socket: any): void {
    handlers.forEach((handler) => handler(socket));
  },
};

export default SocketHandlers;
