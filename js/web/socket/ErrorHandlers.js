'use strict';

import MessageTypes from '../../shared/MessageTypes.js';

export default (socket) => {
  socket.on(MessageTypes.ERROR, function (error) {
    console.log('error received:', error);
  });
};
