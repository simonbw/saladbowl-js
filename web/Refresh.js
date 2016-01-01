var Game = require('../shared/Game');

var REFRESH_DELAY = 1500;

var Refresh = {};

module.exports = Refresh;

var oldDatas = {};

/**
 * Setup auto refreshing.
 *
 * @param template
 * @param handler
 * @param data
 */
Refresh.auto = function (template, handler, data, delay) {
  delay = delay || REFRESH_DELAY;
  if (handler) {
    handler(data);
  }
  setInterval(Refresh.refresh.bind(this, template, handler), delay);
};

/**
 * Refresh a page.
 *
 * @param template
 * @param handler
 */
Refresh.refresh = function (template, handler) {
  $.get('').done(function (data) {
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
    console.log('ERROR:', error);
  });
};

/**
 * Process all the bits of the response.
 *
 * @param data
 */
function processResponse(data) {
  if (data.game) {
    data.game = Game.transformGame(data.game);
  }
  if (data.games) {
    data.games = data.games.map(Game.transformGame);
  }
  return data;
}