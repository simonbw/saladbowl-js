'use strict';

import MessageTypes from '../../shared/MessageTypes';

export default (socket: any) => {
  socket.on(MessageTypes.ERROR, function (error: unknown) {
    console.log('error received:', error);
  });
};
