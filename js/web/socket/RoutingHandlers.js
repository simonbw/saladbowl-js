const MessageTypes = require('../../shared/MessageTypes.js');

module.exports = (socket) => {
  socket.on(MessageTypes.REDIRECT, function (data) {
    console.log('redirect received', data);
    window.location = data.url;
  });
};
