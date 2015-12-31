var Game = require('../shared/Game');

var REFRESH_DELAY = 1500;

module.exports = function (template, handler, data) {
  if (handler) {
    handler(data);
  }
  setInterval(function () {
    $.get('').done(function (data) {
      data = processResponse(data);
      $('#main-content').html(Handlebars.templates[template](data));
      if (handler) {
        handler(data);
      }
    }).fail(function (error) {
      console.log('ERROR:', error);
    });
  }, REFRESH_DELAY);
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