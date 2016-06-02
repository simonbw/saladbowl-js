'use strict';

const MessageTypes = require('../../shared/MessageTypes.js');

module.exports = (socket) => {
  socket.on(MessageTypes.ERROR, function (error) {
    console.log('Error Received:', error);
  });
};
