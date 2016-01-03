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
  serverTimes.push([Date.now(), time]);

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
 * @returns {number|null}
 */
Timer.getTimeRemaining = function (game) {
  if (!game.started) {
    return null;
  }
  var duration = game.phases[game.currentPhase].duration;
  var timeSinceStart = (Timer.getServerTime() - game.startedAt);
  var timeout = duration - timeSinceStart;
  return timeout > 0 ? timeout : 0;
};


/**
 * Format milliseconds to look good.
 *
 * @param milliseconds
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
        $.get('/game/' + game._id + '/next-team', function () {
          //location.reload(); // TODO: Stop refreshing the page
        });
      }, timeRemaining);
    }
  }
};


/**
 *
 */
module.exports = Timer;