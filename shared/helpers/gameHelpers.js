var helpers = module.exports;

/**
 * Get the url for a game.
 *
 * @param game
 * @returns {string}
 */
helpers.getUrl = function (game) {
  var args = [];
  for (var i = 1; i < arguments.length - 1; i++) {
    args.push(arguments[i]);
  }
  return game.getUrl.apply(game, args);
};

/**
 * Return the number of milliseconds remaining in the round.
 * Returns null if the clock is not running.
 *
 * @returns {number|null}
 */
helpers.timeRemaining = function (game) {
  if (!game.roundStarted || !game.roundStarted) {
    return null;
  }
  var duration = game.currentPhase.duration;
  var timeSinceStart = (Date.now() - game.roundStartedAt);
  var timeout = duration - timeSinceStart;
  return timeout > 0 ? timeout : 0;
};

/**
 * Returns true if the game is ready to start.
 *
 * @param game
 * @returns {boolean}
 */
helpers.readyToStart = function (game) {
  // Need to not have started
  if (game.currentPhaseIndex != 0) {
    return false;
  }
  // Need all words in
  for (var i = 0; i < game.players.length; i++) {
    if (game.players[i].words.length < game.wordsPerPlayer) {
      return false;
    }
  }
  // Need multiple teams
  var teams = game.getTeams();
  if (teams.length < 2) {
    return false;
  }
  // Need multiple people per team
  for (i = 0; i < teams.length; i++) {
    if (teams[i].players.length < 2) {
      return false;
    }
  }
  return true;
};