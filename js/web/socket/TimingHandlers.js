const MessageTypes = require('../../shared/MessageTypes.js');
const Timing = require('../Timing');

const HEARTBEAT_INTERVAL = 500;

module.exports = (socket) => {
  let sentHeartbeatAt;
  socket.on(MessageTypes.HEARTBEAT, (data) => {
    Timing.update(sentHeartbeatAt, data.time);

    setTimeout(() => {
      sentHeartbeatAt = Date.now();
      socket.emit(MessageTypes.HEARTBEAT);
    }, HEARTBEAT_INTERVAL);
  });

  setTimeout(() => {
    sentHeartbeatAt = Date.now();
    socket.emit(MessageTypes.HEARTBEAT);
  }, 100);
};
