var FastClick = require('fastclick');

var Game = require('../shared/Game');
var GamePage = require('./gamePage');
var IndexPage = require('./IndexPage');
var misc = require('./misc');
var ServerTime = require('./ServerTime');
var Sounds = require('./Sounds');

$(function () {
  FastClick(document.body);
  misc.setupHandlebars();
  Sounds.init();

  if (SALADBOWL.serverTime) {
    ServerTime.update(SALADBOWL.serverTime);
  }
  if ($('#index-page').length) {
    IndexPage.init();
  }
  if ($('#game-page').length) {
    GamePage.init(Game.transformGame(SALADBOWL.game), SALADBOWL.player);
  }
  if ($('#new-game-page').length) {
  }
  if ($('#join-page').length) {
  }
  if ($('#add-word-page').length) {
  }
});