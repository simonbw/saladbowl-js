'use strict';

import MessageTypes from '../../shared/MessageTypes';

export default (socket: any) => {
  socket.on(MessageTypes.REDIRECT, function (data: { url: string }) {
    console.log('redirect received', data);
    window.location.href = data.url;
  });
};
