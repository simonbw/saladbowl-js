'use strict';

import MessageTypes from '../../shared/MessageTypes.js';

export default (socket) => {
  socket.on(MessageTypes.REDIRECT, function (data) {
    console.log('redirect received', data);
    window.location = data.url;
  });
};
