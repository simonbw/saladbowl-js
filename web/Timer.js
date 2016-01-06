var Timer = {};

var MAX_SERVER_TIMES = 5;

var timerInterval = null;
var timerTimeout = null;
var serverTimes = [];

/**
 *
 * @param time
 */
Timer.updateServerTime = function (time) {
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
Timer.getServerTime = function () {
  var offset = 0;
  serverTimes.forEach(function (timePair) {
    offset += (timePair[1] - timePair[0]) / serverTimes.length;
  });
  return Date.now() + offset;
};

/**
 * Return the number of milliseconds remaining in the round.
 * Returns null if the clock is not running.
 *
 * @param game
 * @returns {number|null}
 */
Timer.getTimeRemaining = function (game) {
  if (!game.roundStarted || !game.roundStarted) {
    return null;
  }
  var duration = game.phases[game.currentPhase].duration;
  var timeSinceStart = (Timer.getServerTime() - game.roundStartedAt);
  var timeout = duration - timeSinceStart;
  return timeout > 0 ? timeout : 0;
};


/**
 * Format milliseconds to look good.
 *
 * @param milliseconds {number}
 * @returns {string}
 */
var formatClock = function (milliseconds) {
  return (milliseconds / 1000).toFixed(1);
};

/**
 * Update the timer on the screen.
 *
 * @param game
 */
Timer.redraw = function (game) {
  var timeRemaining = Timer.getTimeRemaining(game);
  if (timeRemaining != null) {
    $('#timer').html(formatClock(timeRemaining));
  }
};

/**
 * Setup the timer.
 *
 * @param game
 * @param isCurrentPlayer {boolean}
 */
Timer.start = function (game, isCurrentPlayer) {
  var timeRemaining = Timer.getTimeRemaining(game);
  if (timeRemaining != null) {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(Timer.redraw.bind(this, game), 1 / 30);

    if (timerTimeout) {
      clearTimeout(timerTimeout);
    }
    if (isCurrentPlayer) {
      timerTimeout = setTimeout(function () {
        $.get(game.getUrl('next-team'), function () {
          // TODO: refresh
        });
      }, timeRemaining);
    }
  }
};


/**
 *
 */
module.exports = Timer;