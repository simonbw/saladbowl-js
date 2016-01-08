var FastClick = require('fastclick');

var Game = require('../shared/Game');
var GamePage = require('./gamePage');
var IndexPage = require('./IndexPage');
var misc = require('./misc');
var ServerTime = require('./ServerTime');


$(function () {
  FastClick(document.body);
  misc.setupHandlebars();

  var game = Game.transformGame(SALADBOWL.game);
  var player = SALADBOWL.player;

  if (SALADBOWL.serverTime) {
    ServerTime.update(SALADBOWL.serverTime);
  }

  if ($('#index-page').length) {
    IndexPage.init();
  }
  if ($('#game-page').length) {
    GamePage.init(game, player);
  }
  if ($('#new-game-page').length) {
  }
  if ($('#join-page').length) {
  }
  if ($('#add-word-page').length) {
  }
});