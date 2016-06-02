'use strict';
// flow

const Immutable = require('immutable');
const MathUtil = require('./MathUtil');
const TeamNames = require('./TeamNames');
const Validation = require('./Validation.js');

const GameHelpers = module.exports;

// TODO: Memoization

/**
 * Calculate the next word index.
 */
GameHelpers.getNextWordIndex = (game:Game):number => {
  const words = GameHelpers.getWordsInBowl(game);
  if (words.size == 0) {
    throw new Error('No next word available');
  } else if (words.size == 1) {
    return words.get(0).get('index');
  } else {
    return words.get(MathUtil.mod(game.hashCode(), words.size)).get('index');
  }
};

/**
 * Return true if the user has joined the game.
 */
GameHelpers.playerIsJoined = (game:Game, playerId:string):boolean => {
  if (!playerId) {
    return false;
  }
  return game.get('players').some((player) => {
    return player.get('id') == playerId;
  });
};

/**
 * Return a list of teams.
 */
GameHelpers.getTeams = (game:Game):List<Map<string, any>> => {
  const teams = [];

  const lastTeam = game.get('players').reduce((largest, player) => {
    return Math.max(largest, player.get('team'));
  }, 0);
  for (let i = 0; i <= lastTeam; i++) {
    teams[i] = {
      index: i,
      name: TeamNames.get(game.get('id'), i),
      players: [],
      points: []
    };
  }

  game.get('players').forEach((player) => {
    player = player.set('ready', GameHelpers.playerWordsAreValid(game, player.get('id')));
    teams[player.get('team')].players.push(player);
  });

  game.get('points').forEach((point) => {
    teams[point.get('team')].points.push(point);
  });

  if (game.get('started') && !game.get('ended')) {
    const team = teams[game.get('teamIndex') % teams.length];
    team.current = true;
    const playerIndex = game.get('playerIndex') % team.players.length;
    team.players[playerIndex] = team.players[playerIndex].set('current', true);
  }

  return Immutable.fromJS(teams);
};

/**
 * Return the player object with the given id.
 */
GameHelpers.getPlayer = (game, playerId) => {
  return game.get('players').find((player) => {
    return player.get('id') == playerId;
  });
};

/**
 * Return the player whose turn it is.
 */
GameHelpers.getCurrentPlayer = (game) => {
  const team = GameHelpers.getCurrentTeam(game);
  return team.get('players').get(MathUtil.mod(game.get('playerIndex'), team.get('players').size));
};

/**
 * Return the current team.
 */
GameHelpers.getCurrentTeam = (game) => {
  let teams = GameHelpers.getTeams(game);
  return teams.get(MathUtil.mod(game.get('teamIndex'), teams.size));
};

/**
 * Return true if the user is on the guessing team.
 */
GameHelpers.playerIsGuessing = (game, playerId) => {
  if (!playerId) {
    return false;
  }
  let team = GameHelpers.getCurrentTeam(game);
  return team.get('players').some((player) => {
    return player.get('id') == playerId;
  });
};

/**
 * Return all of a player's words.
 */
GameHelpers.getPlayerWords = (game, playerId) => {
  return game.get('words').filter((word) => {
    return word.get('playerId') == playerId;
  });
};

/**
 * Return true if a player has saved all their words.
 */
GameHelpers.playerWordsAreValid = (game, playerId) => {
  let words = GameHelpers.getPlayerWords(game, playerId);
  return words.every((word) => {
    return Validation.validateWord(word.get('word'));
  });
};

/**
 * Return the index in the player list of a player.
 */
GameHelpers.getPlayerIndex = (game, playerId) => {
  return game.get('players').findEntry((player) => {
    return player.get('id') == playerId;
  })[0];
};

/**
 * Return only the words that are in the bowl.
 */
GameHelpers.getWordsInBowl = (game) => {
  return game.get('words').filter((word) => {
    return word.get('inBowl');
  });
};

/**
 * Return the word that was skipped the most times.
 */
GameHelpers.getMostSkippedWord = (game) => {
  return game.get('words').reduce((last, current) => {
    if (!last) {
      return current;
    }
    if (current.get('skips') > last.get('skips')) {
      return current;
    } else {
      return last;
    }
  });
};

/**
 * Return true if the game is ready to be started.
 */
GameHelpers.readyToStart = (game) => {
  // Not Enough Players
  if (game.get('players').size < 4) {
    return false;
  }
  // Not all words are done
  if (!game.get('words').every((word) => {
      return Validation.validateWord(word.get('word')) && word.get('inBowl');
    })) {
    return false;
  }
  let teams = GameHelpers.getTeams(game);
  // Not enough teams
  if (teams.size < 2) {
    return false;
  }
  // Not enough players on each team
  if (!teams.every((team) => {
      return team.get('players').size >= 2;
    })) {
    return false;
  }

  // Everything is good
  return true;
};

/**
 * Return true if the player can skip.
 */
GameHelpers.canSkip = (game) => {
  return GameHelpers.getWordsInBowl(game).length > 1;
};
