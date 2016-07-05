'use strict';

/**
 * @type {Object<string, function>}
 */
const handlers = [
  require('./ConnectionHandlers'),
  require('./ErrorHandlers'),
  require('./GameHandlers'),
  require('./RoutingHandlers'),
  require('./TimingHandlers')
];


/**
 * Initialize all handlers on a socket.
 * @param socket
 */
module.exports.init = (socket) => {
  handlers.forEach((handler) => handler(socket));
};
