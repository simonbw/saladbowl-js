var MessageTypes = require('../../shared/MessageTypes');

/**
 * Map of all action handlers.
 */
var handlers = Object.assign({},
  require('./handlers/PreGameHandlers'),
  require('./handlers/MidGameHandlers'));


/**
 * Bind all action handlers to socket events.
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  socket.on(MessageTypes.GAME, function (action) {
    console.log('Game Action Received', action);
    if (handlers.hasOwnProperty(action.type)) {
      try {
        handlers[action.type](action, socket);
      } catch (e) {
        console.error('error handling action' + action.type, error);
      }
    } else {
      console.error('Unknown Action', action);
    }
  });
  next();
};