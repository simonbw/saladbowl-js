'use strict';

import * as Immutable from 'immutable';
import MathUtil from './MathUtil';
import TeamNames from './TeamNames';
import * as Validation from './Validation';
import { PHASE_COUNT } from './Phases';
import type { Game } from './types';

/** Final scores and superlatives, computed from `game.points`. */
export interface GameStats {
  teams: { index: number; name: string; total: number; byPhase: number[] }[];
  /** Indices of the team(s) with the top score; more than one means a tie. */
  winners: number[];
  /** Clue-givers by points earned, best first. */
  players: { id: string; name: string; team: number; points: number }[];
  /** The noun skipped the most, or null if nothing was ever skipped. */
  mostSkipped: { word: string; skips: number; playerName: string } | null;
}

interface GameHelpersType {
  getNextWordIndex(game: Game, excludeIndex?: number): number;
  playerIsJoined(game: Game, playerId: string | null | undefined): boolean;
  getTeams(game: Game): Immutable.List<any>;
  getPlayer(game: Game, playerId: string): any;
  getPlayerIndex(game: Game, playerId: string | null | undefined): number;
  getCurrentPlayer(game: Game): any;
  getCurrentPlayerIndex(game: Game): number;
  isCurrentPlayerConnected(game: Game): boolean;
  getCurrentTeam(game: Game): any;
  playerIsGuessing(game: Game, playerId: string | null | undefined): boolean;
  getPlayerWords(game: Game, playerId: string): any;
  playerWordsAreValid(game: Game, playerId: string): boolean;
  getWordsInBowl(game: Game): any;
  getMostSkippedWord(game: Game): any;
  readyToStart(game: Game): boolean;
  canSkip(game: Game): boolean;
  isCurrentPlayer(game: Game, playerId: string | null | undefined): boolean;
  canUndoCorrect(game: Game): boolean;
  getGameStats(game: Game): GameStats;
}

const GameHelpers = {} as GameHelpersType;

// TODO: Memoization

/**
 * Calculate the next word index.
 * @param game
 * @param excludeIndex a word not to pick (the one just skipped), unless it's
 *   the only word left
 * @returns {number}
 */
GameHelpers.getNextWordIndex = (game: Game, excludeIndex?: number): number => {
  let words = GameHelpers.getWordsInBowl(game);
  if (excludeIndex != null && words.size > 1) {
    words = words.filter((word: any) => word.get('index') !== excludeIndex);
  }
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
 * @param game
 * @param playerId
 * @returns {boolean}
 */
GameHelpers.playerIsJoined = (game: Game, playerId: string | null | undefined): boolean => {
  return GameHelpers.getPlayerIndex(game, playerId) >= 0;
};

/**
 * Return a list of teams.
 * @param game
 * @returns {Immutable.List}
 */
GameHelpers.getTeams = (game: Game): Immutable.List<any> => {
  const teams: any[] = [];

  const lastTeam = game.get('players').reduce((largest: number, player: any) => {
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

  game.get('players').forEach((player: any) => {
    const ready = GameHelpers.playerWordsAreValid(game, player.get('id'));
    const connected = Boolean(game.getIn(['connections', player.get('id')]));
    player = player.set('ready', ready).set('connected', connected);
    teams[player.get('team')].players.push(player);
  });

  game.get('points').forEach((point: any) => {
    teams[point.get('team')].points.push(point);
  });

  if (game.get('started') && !game.get('ended')) {
    const currentTeam = teams[game.get('teamIndex') % teams.length];
    currentTeam.current = true;
    const activePlayers = activeOrAll(currentTeam.players);
    const activePlayerIndex = game.get('playerIndex') % activePlayers.length;
    const currentPlayer = activePlayers[activePlayerIndex];
    const currentPlayerIndex = currentTeam.players.findIndex((player: any) => player.get('id') == currentPlayer.get('id'));
    currentTeam.players[currentPlayerIndex] = currentTeam.players[currentPlayerIndex].set('current', true);
  }

  return Immutable.fromJS(teams) as Immutable.List<any>;
};

/**
 * Return the player object with the given id.
 * @param game
 * @param playerId
 * @returns {*}
 */
GameHelpers.getPlayer = (game: Game, playerId: string): any => {
  return game.get('players').find((player: any) => {
    return player.get('id') == playerId;
  });
};

/**
 * Return the index in the player list of a player.
 * @param game
 * @param playerId
 * @returns {number}
 */
GameHelpers.getPlayerIndex = (game: Game, playerId: string | null | undefined): number => {
  if (playerId == null) {
    return -1;
  }
  return game.get('players').findIndex((player: any) => {
    return player.get('id') == playerId;
  });
};

/**
 * Return the player whose turn it is.
 * @param game
 * @returns {Immutable.Map}
 */
GameHelpers.getCurrentPlayer = (game: Game): any => {
  const team = GameHelpers.getCurrentTeam(game);
  const activePlayers = activeOrAll(team.get('players'));
  return activePlayers.get(MathUtil.mod(game.get('playerIndex'), activePlayers.size));
};

/**
 * Return the index for the player whose turn it is.
 * @param game
 * @returns {number}
 */
GameHelpers.getCurrentPlayerIndex = (game: Game): number => {
  return GameHelpers.getPlayerIndex(game, GameHelpers.getCurrentPlayer(game).get('id'));
};

/**
 * Return true if the player whose turn it is is connected.
 * @param game
 * @returns {boolean}
 */
GameHelpers.isCurrentPlayerConnected = (game: Game): boolean => {
  const currentPlayer = GameHelpers.getCurrentPlayer(game);
  return Boolean(game.get('connections').get(currentPlayer.get('id')));
};

/**
 * Return the current team.
 * @param game
 * @returns {*}
 */
GameHelpers.getCurrentTeam = (game: Game): any => {
  const teams = GameHelpers.getTeams(game);
  return teams.get(MathUtil.mod(game.get('teamIndex'), teams.size));
};

/**
 * Return true if the user is on the guessing team.
 * @param game
 * @param playerId
 * @returns {boolean}
 */
GameHelpers.playerIsGuessing = (game: Game, playerId: string | null | undefined): boolean => {
  if (!playerId) {
    return false;
  }
  const team = GameHelpers.getCurrentTeam(game);
  return team.get('players').some((player: any) => {
    return player.get('id') == playerId;
  });
};

/**
 * Return all of a player's words.
 * @param game
 * @param playerId
 * @returns {*}
 */
GameHelpers.getPlayerWords = (game: Game, playerId: string): any => {
  return game.get('words').filter((word: any) => {
    return word.get('playerId') == playerId;
  });
};

/**
 * Return true if a player has saved all their words.
 * @param game
 * @param playerId
 * @returns {boolean}
 */
GameHelpers.playerWordsAreValid = (game: Game, playerId: string): boolean => {
  const words = GameHelpers.getPlayerWords(game, playerId);
  return words.every((word: any) => {
    return Validation.validateWord(word.get('word'));
  });
};

/**
 * Return only the words that are in the bowl.
 * @param game
 */
GameHelpers.getWordsInBowl = (game: Game): any => {
  return game.get('words').filter((word: any) => {
    return word.get('inBowl');
  });
};

/**
 * Return the word that was skipped the most times.
 * @param game
 * @returns {*}
 */
GameHelpers.getMostSkippedWord = (game: Game): any => {
  return game.get('words').reduce((last: any, current: any) => {
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
 * @param game
 */
GameHelpers.readyToStart = (game: Game): boolean => {
  // Not Enough Players
  if (game.get('players').size < 4) {
    return false;
  }
  // Not all words are done
  if (!game.get('words').every((word: any) => {
      return Validation.validateWord(word.get('word')) && word.get('inBowl');
    })) {
    return false;
  }
  const teams = GameHelpers.getTeams(game);
  // Not enough teams
  if (teams.size < 2) {
    return false;
  }
  // Not enough players on each team
  if (!teams.every((team: any) => {
      return team.get('players').size >= 2;
    })) {
    return false;
  }

  // Everything is good
  return true;
};

/**
 * Return true if the player can skip.
 * @param game
 * @returns {boolean}
 */
GameHelpers.canSkip = (game: Game): boolean => {
  return GameHelpers.getWordsInBowl(game).size > 1;
};

/**
 * Return true if it is this player's turn to give clues.
 */
GameHelpers.isCurrentPlayer = (game: Game, playerId: string | null | undefined): boolean => {
  if (!playerId || !game.get('started') || game.get('ended')) {
    return false;
  }
  const current = GameHelpers.getCurrentPlayer(game);
  return Boolean(current) && current.get('id') === playerId;
};

/**
 * Return true if the last "Correct" tap of the running round can be taken back.
 */
GameHelpers.canUndoCorrect = (game: Game): boolean => {
  const lastIndex = game.get('lastCorrectWordIndex');
  const lastPoint = game.get('points').last();
  return Boolean(game.get('roundStarted')) && !game.get('ended') && lastIndex != null &&
    Boolean(lastPoint) && lastPoint.get('wordIndex') === lastIndex &&
    lastPoint.get('phaseIndex') === game.get('phaseIndex');
};

/**
 * Final scores and superlatives for the game-over screen.
 */
GameHelpers.getGameStats = (game: Game): GameStats => {
  const teams = GameHelpers.getTeams(game).toJS() as any[];
  const teamStats = teams.map((team) => {
    const byPhase = new Array(PHASE_COUNT).fill(0);
    team.points.forEach((point: any) => {
      byPhase[point.phaseIndex] = (byPhase[point.phaseIndex] ?? 0) + 1;
    });
    return { index: team.index, name: team.name, total: team.points.length, byPhase };
  });

  const best = Math.max(0, ...teamStats.map((team) => team.total));
  const winners = best > 0
    ? teamStats.filter((team) => team.total === best).map((team) => team.index)
    : [];

  const pointsByPlayer: Record<string, number> = {};
  game.get('points').forEach((point: any) => {
    pointsByPlayer[point.get('playerId')] = (pointsByPlayer[point.get('playerId')] ?? 0) + 1;
  });
  const players = game.get('players').toJS()
    .map((player: any) => ({
      id: player.id,
      name: player.name,
      team: player.team,
      points: pointsByPlayer[player.id] ?? 0,
    }))
    .sort((a: any, b: any) => b.points - a.points);

  let mostSkipped: GameStats['mostSkipped'] = null;
  const skipped = game.get('words').size ? GameHelpers.getMostSkippedWord(game) : null;
  if (skipped && skipped.get('skips') > 0) {
    const owner = GameHelpers.getPlayer(game, skipped.get('playerId'));
    mostSkipped = {
      word: skipped.get('word'),
      skips: skipped.get('skips'),
      playerName: owner ? owner.get('name') : '',
    };
  }

  return { teams: teamStats, winners, players, mostSkipped };
};

/**
 * A team's players who are still in the rotation. If every one of them has
 * been skipped, fall back to all of them so there is always a current player.
 */
function activeOrAll(players: any): any {
  // Works on both an Immutable.List (`size`) and a plain array (`length`).
  const active = players.filter((player: any) => player.get('active'));
  return (active.size ?? active.length) > 0 ? active : players;
}

export default GameHelpers;
