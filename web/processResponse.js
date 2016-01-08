var ServerTime = require('./ServerTime');
var Game = require('../shared/Game');

/**
 * Convert data sent from server.
 *
 * @param data
 * @returns {*}
 */
module.exports = function (data) {
  if (data.game) {
    data.game = Game.transformGame(data.game);
    data.currentPlayer = data.game.currentPlayer;
    data.phase = data.game.phases[data.game.currentPhaseIndex];
    data.player = data.game.getPlayer(data.user);
    data.teams = data.game.getTeams(true);
  }
  if (data.games) {
    data.games = data.games.map(Game.transformGame);
  }
  if (data.serverTime) {
    ServerTime.update(data.serverTime);
  }
  return data;
};