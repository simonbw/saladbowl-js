/*
 * This file contains a bunch of methods that get attached to sockets.
 */

var ActionTypes = require('../../shared/ActionTypes.js');
var MessageTypes = require('../../shared/MessageTypes.js');

var methods = {};

// TODO: These might be stupid because they cannot be broadcast

/**
 * Emit an error.
 * @param message
 */
methods.emitError = function (message) {
  this.emit(MessageTypes.ERROR, {
    message: message
  });
};

/**
 * Emit an action.
 * @param action
 */
methods.emitAction = function (action) {
  this.emit(MessageTypes.GAME, action);
};

/**
 * Emit an action.
 * @param url
 */
methods.emitRedirect = function (url) {
  this.emit(MessageTypes.REDIRECT, {
    url: url
  });
};

/**
 * Emit a replace game action.
 */
methods.emitReplaceGame = function () {
  this.emitAction({
    type: ActionTypes.CLIENT.REPLACE_GAME,
    game: this.game
  });
};


/**
 * Attach useful methods to the socket.
 * @param socket
 * @param next
 */
module.exports = function (socket, next) {
  for (var methodName in methods) {
    if (methods.hasOwnProperty(methodName)) {
      socket[methodName] = methods[methodName].bind(socket);
    }
  }
  next();
};