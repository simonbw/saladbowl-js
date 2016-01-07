var Game = require('../shared/Game');
var Timer = require('./Timer');

var REFRESH_DELAY = 1000;

var Refresh = {};

module.exports = Refresh;

var oldDatas = {};

/**
 * Setup auto refreshing.
 *
 * @param url
 * @param template
 * @param handler
 * @param data
 * @param delay
 */
Refresh.auto = function (url, template, handler, data, delay) {
  delay = delay || REFRESH_DELAY;
  if (handler) {
    handler(data);
  }
  setInterval(Refresh.refresh.bind(this, url, template, handler), delay);
};

/**
 * Refresh a page.
 *
 * @param template
 * @param handler
 */
Refresh.refresh = function (url, template, handler) {
  jQuery.get(url).done(function (data) {
    data = processResponse(data);
    var oldData = oldDatas[template];
    oldDatas[template] = data;
    if (JSON.stringify(oldData) != JSON.stringify(data)) { // only refresh on new data
      $('#main-content').html(Handlebars.templates[template](data));
    }
    if (handler) {
      handler(data);
    }
  }).fail(function (error) {
    console.error(error);
  });
};

/**
 * Process all the bits of the response.
 *
 * @param data
 */
function processResponse(data) {
  if (data.redirect) {
    location.assign(data.redirect);
  }
  if (data.game) {
    data.game = Game.transformGame(data.game);
    data.currentPlayer = data.game.currentPlayer;
    data.phase = data.game.phases[data.game.currentPhase];
    data.player = data.game.getPlayer(data.user);
    data.teams = data.game.getTeams(true);
  }
  if (data.games) {
    data.games = data.games.map(Game.transformGame);
  }
  if (data.serverTime) {
    Timer.updateServerTime(data.serverTime);
  }
  return data;
}