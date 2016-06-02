'use strict';
// @flow


const MessageTypes = require('../../shared/MessageTypes.js');

module.exports = (socket:Socket) => {
  socket.on(MessageTypes.ERROR, function (error) {
    console.log('Error Received:', error);
  });
};
