var marked = require('marked');


var helpers = {};
module.exports = helpers;

/**
 * Capitalize the first letter of a string.
 *
 * @param s
 * @returns {string}
 */
helpers.capitalize = function (s) {
  if (!s) {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Return the length of something.
 *
 * @param s
 * @returns {string}
 */
helpers.length = function (s) {
  return s.length;
};

/**
 * Lookup a key on an object.
 *
 * @param object
 * @param key
 * @param options
 * @param options.hash.def the default thing to get
 * @returns {*}
 */
helpers.get = function (object, key, options) {
  var def = (options && options.hash) ? options.hash.def : undefined;
  return object[key] || def;
};


helpers.call = function (object, key) {
  return object[key]();
};

/**
 * JSONify the argument.
 *
 * @param o
 * @param pretty {boolean} - whether or not to pretty print the json
 */
helpers.json = function (o, pretty) {
  var spaces = pretty ? 2 : 0;
  return JSON.stringify(o, null, spaces);
};

/**
 * Format object for inserting into javascript.
 *
 * @param o
 */
helpers.jsObject = function (o) {
  return JSON.stringify(o) || 'undefined';
};

/**
 * Convert markdown to HTML.
 *
 * @param s
 * @returns {*}
 */
helpers.markdown = function (s) {
  var result = marked(s);
  console.log('source:\n', s, '\n\ncompiled:\n', result);
  return result;
};

/**
 * Return whether or not debug stuff should be shown.
 * @returns {boolean}
 */
helpers.debug = function () {
  return false;
};

/**
 *
 * @param team
 * @param game
 */
helpers.isCurrentTeam = function (team, game) {
  return (team == game.currentTeam) && (game.currentPhase > 0);
};

/**
 * Returns true if the game is ready to start.
 *
 * @param game
 * @returns {boolean}
 */
helpers.readyToStart = function (game) {
  // Need to not have started
  if (game.currentPhase != 0) {
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

/**
 * Return the number of milliseconds remaining in the round.
 * Returns null if the clock is not running.
 *
 * @returns {number|null}
 */
helpers.timeRemaining = function (game) {
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
helpers.formatClock = function (milliseconds) {
  if (milliseconds == null) {
    return '';
  }
  var seconds = milliseconds / 1000;
  var whole = Math.floor(seconds);
  var part = seconds - whole;
  part = Math.floor(part * 100);
  return whole + ':' + part;
};