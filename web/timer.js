var Timer = {};

var timerInterval = null;
var timerTimeout = null;

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
  var timeSinceStart = (Date.now() - game.startedAt);
  var timeout = duration - timeSinceStart;
  return timeout > 0 ? timeout : 0;
};

/**
 * Format milliseconds to look good.
 *
 * @param milliseconds
 */
var formatClock = function (milliseconds) {
  var seconds = milliseconds / 1000;
  var whole = Math.floor(seconds);
  var part = seconds - whole;
  part = Math.floor(part * (seconds > 10 ? 10 : 100));
  return whole + ':' + part;
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