var Game = require('../shared/Game');
var Timer = require('./Timer');
var processResponse = require('./processResponse');

/**
 * Redraw the page.
 * @param data
 */
function redraw(data) {
  $('#main-content').html(Handlebars.templates['game/main'](data));
  Timer.start(data.game, data.player);
  bindAll(data.game);
}

/**
 * Bind all event handlers.
 * @param game
 */
function bindAll(game) {
  // Bind everything. TODO: Make this shorter/cleaner
  // TODO: Don't allow double clicks
  function bindClick(selector, action, data) {
    $(selector).click(function () {
      $.post(game.getUrl(action), data).done();
    });
  }

  $('.button.correct').click(function () {
    $('.correct').addClass('disabled');
    $('.skip').addClass('disabled');
    $('#current-word').fadeTo(100, 0);
    $.post(game.getUrl('correct-word'), {'word': game.currentWord}).done();
  });
  $('.button.skip').click(function () {
    $('.correct').addClass('disabled');
    $('.skip').addClass('disabled');
    $('#current-word').fadeTo(100, 0);
    $.post(game.getUrl('skip-word'), {'word': game.currentWord}).done();
  });

  //bindClick('.button.correct', 'correct-word', {'word': game.currentWord});
  //bindClick('.button.skip', 'skip-word', {'word': game.currentWord});
  bindClick('.button.start-round', 'start-round');
  bindClick('#start-game-button:not(.disabled)', 'start-game');
  $('.team.joinable').click(function () {
    var team = $(this).data('team-id');
    $.post(game.getUrl('join-team'), {'team': team})
      .done();
  });
}

/**
 * Get data for the page.
 *
 * @param url
 * @param lastUpdatedAt
 */
function getData(url, lastUpdatedAt) {
  jQuery.get(url, {'lastUpdatedAt': lastUpdatedAt})
    .done(function (response) {
      var data = processResponse(response);
      redraw(data);
      getData(data.game.getUrl('json'), data.game.lastUpdatedAt);
    })
    .fail(function () {
      getData(url, lastUpdatedAt);
    });
}

/**
 * Initialize the game page.
 * @param game
 * @param player
 */
module.exports.init = function (game, player) {
  getData(game.getUrl('json'), game.lastUpdatedAt);
  bindAll(game);
  Timer.start(game, player);
};