var MessageTypes = require('../shared/MessageTypes');
var MathUtil = require('../shared/MathUtil');


var Timing = module.exports;

var HEARTBEAT_INTERVAL = 1000;

var offsets = [];

/**
 * The socket.io socket.
 */
Timing.init = function (socket) {
  var sentHeartbeatAt = Date.now();
  socket.on(MessageTypes.HEARTBEAT, function (data) {
    var now = Date.now();
    var heartbeatDuration = now - sentHeartbeatAt;

    // Assume the request takes the same time as the response
    var serverTime = data.time + heartbeatDuration / 2;
    offsets.push(now - serverTime);

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

/**
 * Return an approximation of the server's clock time.
 * @returns {number}
 */
Timing.getServerTime = function () {
  var total = MathUtil.sum(offsets);
  var averageOffset = total / offsets.length;
  return Date.now() + averageOffset;
};