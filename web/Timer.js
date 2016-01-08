var ServerTime = require('./ServerTime');

var Timer = module.exports;

var REDRAW_DELAY = 1 / 30;
var timerInterval = null;
var timerTimeout = null;

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
  var duration = game.phases[game.currentPhaseIndex].duration;
  var timeSinceStart = (ServerTime.get() - game.roundStartedAt);
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
  if (milliseconds < 10000) {
    return (milliseconds / 1000).toFixed(2);
  }
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
 * @param player
 */
Timer.start = function (game, player) {
  var isCurrentPlayer = game.currentPlayer && (game.currentPlayer.id == player.id);
  if (game.gameStarted && !game.gameEnded) {
    var timeRemaining = Timer.getTimeRemaining(game);
    if (timeRemaining != null) {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      timerInterval = setInterval(Timer.redraw.bind(this, game), REDRAW_DELAY);

      if (timerTimeout) {
        clearTimeout(timerTimeout);
      }
      if (isCurrentPlayer) {
        timerTimeout = setTimeout(function () {
          $.get(game.getUrl('next-team')); // TODO: Refresh here?
        }, timeRemaining);
      }
    }
  }
};
