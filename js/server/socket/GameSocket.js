'use strict';

import SocketPlayerAttacher from './SocketPlayerAttacher';
import SocketLogger from './SocketLogger';
import SocketHeartbeat from './SocketHeartbeat';
import SocketGameLookup from './SocketGameLookup';
import SocketActionHandlers from './SocketActionHandlers';
import SocketConnections from './SocketConnections';

const GameSocket = {};

/**
 *
 * @param io
 */
GameSocket.init = (io) => {
  io.use((socket, next) => {
    socket.io = io;
    next();
  });
  io.use(SocketPlayerAttacher);
  io.use(SocketLogger);
  io.use(SocketHeartbeat);
  io.use(SocketGameLookup);
  io.use(SocketActionHandlers);
  io.use(SocketConnections);
};

export default GameSocket;
