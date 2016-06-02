'use strict';
// @flow


const MessageTypes = require('../../shared/MessageTypes.js');

module.exports = (socket:Socket) => {
  socket.on(MessageTypes.REDIRECT, function (data) {
    console.log('redirect received', data);
    window.location = data.url;
  });
};
