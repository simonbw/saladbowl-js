/*
 * This file contains a bunch of methods that get attached to sockets.
 */

const ActionTypes = require('../../shared/ActionTypes.js');
const MessageTypes = require('../../shared/MessageTypes.js');

const methods = {};

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
 * @param action
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
  this.emit('GAME', {
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
  socket._emit = socket.emit;
  socket.emit = function () {
    console.log('socket emitting', arguments);
    socket._emit.apply(socket, arguments);
  };
  for (var methodName in methods) {
    if (methods.hasOwnProperty(methodName)) {
      socket[methodName] = methods[methodName].bind(socket);
    }
  }
  next();
};