var Game = require('../shared/Game');
var Timer = require('./Timer');
var misc = require('./misc');
var Refresh = require('./Refresh');

$(function () {
  var game = Game.transformGame(SALADBOWL.game);
  var player = SALADBOWL.player;
  misc.setupHandlebars();

  if (SALADBOWL.serverTime) {
    Timer.updateServerTime(SALADBOWL.serverTime);
  }

  if ($('#index-page').length) {
    Refresh.auto('/recent-games', 'index');
  }
  if ($('#game-page').length) {
    Refresh.auto(game.getUrl('json'), 'game/main', onGamePage, {'game': game, 'player': player});
  }
  if ($('#new-game-page').length) {
  }
  if ($('#join-page').length) {
  }
  if ($('#add-word-page').length) {
  }
});

/**
 * Called when the game page is rendered.
 *
 * @param data
 */
function onGamePage(data) {
  var game = data.game;
  var currentPlayer = game.currentPlayer;
  var isCurrentPlayer = currentPlayer && (currentPlayer.id == data.player.id);
  if (game.gameStarted && !game.gameEnded) {
    Timer.start(game, isCurrentPlayer);
  }

  $('.button.correct').click(function () {
    $.get(game.getUrl('correct-word'))
      .done(function () {
        Refresh.refresh(game.getUrl('json'), 'game/main', onGamePage);
      });
    // TODO: Don't allow double clicks
  });
  $('.button.skip').click(function () {
    $.get(game.getUrl('skip-word'))
      .done(function () {
        Refresh.refresh(game.getUrl('json'), 'game/main', onGamePage);
      });
    // TODO: Don't allow double clicks
  });
  $('.button.start-round').click(function () {
    $.get(game.getUrl('start-round'))
      .done(function () {
        Refresh.refresh(game.getUrl('json'), 'game/main', onGamePage);
      });
  });
  $('#start-game-button:not(.disabled)').click(function () {
    $.get(game.getUrl('start-game'))
      .done(function () {
        Refresh.refresh(game.getUrl('json'), 'game/main', onGamePage);
      });
  });
  $('.team.joinable').click(function () {
    var team = $(this).data('team-id');
    $.post(game.getUrl('join-team'), {'team': team})
      .done(function () {
        Refresh.refresh(game.getUrl('json'), 'game/main', onGamePage);
      });
  });
}