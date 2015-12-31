/*
 * Utility functions for dealing with games.
 */

module.exports = {
  /**
   * Get a list of lists of players.
   *
   * @param game
   * @param includePoints
   * @returns {*}
   */
  getTeams: function (game, includePoints) {
    if (!game) {
      return undefined;
    }

    var teams = [];

    if (includePoints) {
      var points = game.getPoints();
      for (var i = 0; i < points.length; i++) {
        teams[i] = teams[i] || {players: []};
        teams[i].points = points[i];
      }
    }

    var max = 0;
    game.players.forEach(function (player) {
      max = Math.max(max, player.team);
      teams[player.team] = teams[player.team] || {players: []};
      teams[player.team].players.push(player);
    });

    // guarantees stuff
    for (var j = 0; j < max; j++) {
      teams[j] = teams[j] || {players: []};
    }

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

    var points = game.getTeams().map(function () {
      return 0;
    });

    game.points.forEach(function (point) {
      points[point.team] += 1;
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
    return team.players[game.currentPlayerIndex % team.players.length];
  }
};