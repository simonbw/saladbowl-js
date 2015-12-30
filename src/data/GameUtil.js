/*
 * Utility functions for dealing with games.
 */

module.exports = {
  /**
   * Get a list of lists of players.
   *
   * @param game
   * @returns {*}
   */
  getTeams: function (game) {
    if (!game) {
      return undefined;
    }

    var teams = [];
    game.players.forEach(function (player) {
      teams[player.team] = teams[player.team] || [];
      teams[player.team].push(player);
    });

    return teams;
  },

  /**
   * Get a list of points.
   *
   * @param game
   * @returns {*}
   */
  getPoints: function (game) {
    if (!game) {
      return undefined;
    }

    var points = [];
    game.points.forEach(function (point) {
      points[point.team] = (points[point.team] || 0) + 1;
    });

    return points;
  },

  /**
   * Get a list of all words in a game.
   *
   * @param game
   * @returns {*}
   */
  getWords: function (game) {
    if (!game) {
      return undefined;
    }

    var words = [];
    game.players.forEach(function (player) {
      words.push.apply(words, player.words);
    });
    return words;
  },

  /**
   * Get a player from a game and an id.
   *
   * @param game
   * @param playerId
   * @returns {undefined}
   */
  getPlayer: function (game, playerId) {
    if (!game) {
      return undefined;
    }
    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].id == playerId) {
        return game.players[i];
      }
    }
    return undefined;
  },

  /**
   * Returns the current player.
   *
   * @param game
   * @returns {*}
   */
  getCurrentPlayer: function (game) {
    if (!game) {
      return undefined;
    }
    var team = game.getTeams()[game.currentTeam];
    return team[game.currentPlayerIndex % team.length];
  }
};