var ServerTime = module.exports;

var MAX_SERVER_TIMES = 10;
var serverTimes = [];

// TODO: Make this less jittery

/**
 *
 * @param time
 */
ServerTime.update = function (time) {
  var now = Date.now();
  serverTimes.push([now, time]);
  // Keep it recent
  if (serverTimes.length > MAX_SERVER_TIMES) {
    serverTimes.shift();
  }
};

/**
 * Gets an estimate of what the time on the server is.
 *
 * @returns {number}
 */
ServerTime.get = function () {
  var offset = 0;
  serverTimes.forEach(function (timePair) {
    offset += (timePair[1] - timePair[0]) / serverTimes.length;
  });
  return Date.now() + offset;
};