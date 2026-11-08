/**
 * @file Turns client intent (`SERVER.*` actions) into the authoritative
 * `CLIENT.*` actions the shared reducers key on.
 *
 * This is the Convex-era port of the old socket handlers
 * (`PreGameHandlers` / `MidGameHandlers`). It is pure: the caller supplies the
 * current game, the acting user, and the server clock, so it is unit-testable
 * without a Convex runtime.
 */

import { ConvexError } from 'convex/values';

import ActionTypes from '../../js/shared/ActionTypes';
import GameHelpers from '../../js/shared/GameHelpers';
import * as Validation from '../../js/shared/Validation';
import type { Action, Game } from '../../js/shared/types';

/** Refuse a request with a message the player will see. */
function reject(message: string): never {
  throw new ConvexError(message);
}

/**
 * Return the `CLIENT.*` action to run through `GameReducers`, or `null` to
 * ignore the request.
 *
 * Lobby requests that can't be honoured throw a `ConvexError` so the player
 * sees why. In-game requests that are merely stale (a tap that lands just
 * after the timer fired, a double-tapped "Ready") are ignored quietly, as are
 * requests from anyone but the current clue-giver.
 */
export function translateServerAction(
  game: Game,
  action: Action,
  userId: string,
  now: number,
): Action | null {
  const started = Boolean(game.get('started'));
  const inGame = started && !game.get('ended');
  const roundInProgress = inGame && Boolean(game.get('roundStarted'));
  const isJoined = GameHelpers.playerIsJoined(game, userId);
  const isCurrentPlayer = inGame && GameHelpers.isCurrentPlayer(game, userId);

  switch (action.type) {
    // ---------- pre game ----------
    case ActionTypes.SERVER.JOIN_GAME: {
      if (started) {
        reject('This game has already started.');
      }
      if (!Validation.validateUserName(action.name)) {
        reject(`Enter a name of up to ${Validation.MAX_USER_NAME_LENGTH} characters.`);
      }
      return {
        type: ActionTypes.CLIENT.PLAYER_JOINED,
        player: { id: userId, name: action.name.trim() },
      };
    }

    case ActionTypes.SERVER.SAVE_WORDS: {
      if (started) {
        reject('The game has already started.');
      }
      if (!isJoined) {
        reject('Join the game before adding nouns.');
      }
      if (!Array.isArray(action.words)) {
        return null;
      }
      const wordsPerPlayer = game.get('wordsPerPlayer');
      const words = action.words.map((entry: any) => {
        const slot = entry?.playerWordIndex;
        if (!Number.isInteger(slot) || slot < 0 || slot >= wordsPerPlayer) {
          reject('That noun slot does not exist.');
        }
        if (!Validation.validateWord(entry.word)) {
          reject(`Each noun must be 1 to ${Validation.MAX_WORD_LENGTH} characters.`);
        }
        return { playerWordIndex: slot, word: entry.word.trim() };
      });
      return {
        type: ActionTypes.CLIENT.WORDS_UPDATED,
        playerId: userId,
        words,
      };
    }

    case ActionTypes.SERVER.JOIN_TEAM: {
      if (started) {
        reject('Teams are locked once the game starts.');
      }
      if (!isJoined) {
        reject('Join the game before picking a team.');
      }
      // Any existing team, or one past the end to start a new team.
      const teamCount = GameHelpers.getTeams(game).size;
      if (!Number.isInteger(action.team) || action.team < 0 || action.team > teamCount) {
        reject('That team does not exist.');
      }
      return {
        type: ActionTypes.CLIENT.TEAM_JOINED,
        playerId: userId,
        team: action.team,
      };
    }

    case ActionTypes.SERVER.SHUFFLE_TEAMS: {
      if (started) {
        reject('Teams are locked once the game starts.');
      }
      if (!isJoined) {
        reject('Join the game before shuffling teams.');
      }
      return {
        type: ActionTypes.CLIENT.TEAMS_SHUFFLED,
        teams: shuffledTeams(game),
      };
    }

    case ActionTypes.SERVER.START_GAME:
      if (started) {
        return null; // double tap
      }
      if (!isJoined) {
        reject('Join the game first.');
      }
      if (!GameHelpers.readyToStart(game)) {
        reject('Not ready yet: everyone needs to add their nouns, and every team needs at least 2 players.');
      }
      return { type: ActionTypes.CLIENT.GAME_STARTED };

    // ---------- mid game ----------
    case ActionTypes.SERVER.START_ROUND: {
      // A double-tapped "Ready" must not restart a running round's clock.
      if (!inGame || game.get('roundStarted') || !isCurrentPlayer) {
        return null;
      }
      const leftover = game.get('secondsLeftover');
      const secondsThisRound =
        leftover > 0
          ? leftover + game.get('bonusSeconds')
          : game.get('secondsPerRound');
      return {
        type: ActionTypes.CLIENT.ROUND_STARTED,
        startTime: now,
        secondsThisRound,
      };
    }

    case ActionTypes.SERVER.CORRECT_WORD:
      // Without this guard a tap that lands just after the timer fires would
      // score a point outside the round.
      if (!roundInProgress || !isCurrentPlayer) {
        return null;
      }
      return { type: ActionTypes.CLIENT.WORD_CORRECT, time: now };

    case ActionTypes.SERVER.SKIP_WORD:
      if (!roundInProgress || !isCurrentPlayer || !GameHelpers.canSkip(game)) {
        return null;
      }
      return { type: ActionTypes.CLIENT.WORD_SKIPPED };

    case ActionTypes.SERVER.UNDO_CORRECT:
      if (!isCurrentPlayer || !GameHelpers.canUndoCorrect(game)) {
        return null;
      }
      return { type: ActionTypes.CLIENT.CORRECT_UNDONE };

    case ActionTypes.SERVER.END_ROUND:
      if (!roundInProgress || !isCurrentPlayer) {
        return null;
      }
      return { type: ActionTypes.CLIENT.ROUND_ENDED };

    case ActionTypes.SERVER.SKIP_PLAYER: {
      // Only the clue-giver who is up next, only between rounds, and only once
      // they've actually dropped off.
      if (!inGame || game.get('roundStarted') || !isJoined || typeof action.playerId !== 'string') {
        return null;
      }
      const current = GameHelpers.getCurrentPlayer(game);
      if (current.get('id') !== action.playerId || game.getIn(['connections', action.playerId])) {
        return null;
      }
      return {
        type: ActionTypes.CLIENT.PLAYER_SKIPPED,
        playerId: action.playerId,
      };
    }

    default:
      return null;
  }
}

/**
 * What a state transition means for the round timer.
 *  - `start`: a round just began; schedule its end.
 *  - `stop`: a running round just ended (or the game ended mid-round); cancel
 *    the scheduled end.
 */
export function roundTimerChange(
  before: Game,
  after: Game,
): 'start' | 'stop' | null {
  const wasRunning = Boolean(before.get('roundStarted')) && !before.get('ended');
  const isRunning = Boolean(after.get('roundStarted')) && !after.get('ended');
  if (!wasRunning && isRunning) {
    return 'start';
  }
  if (wasRunning && !isRunning) {
    return 'stop';
  }
  return null;
}

/**
 * Deal the players onto evenly sized teams in random order, keeping the number
 * of teams in use (at least 2). Tries a few times to land on a split that
 * differs from the current one, so a tap visibly does something.
 */
function shuffledTeams(game: Game): Record<string, number> {
  const players = game.get('players').toJS() as { id: string; team: number }[];
  const teamsInUse = new Set(players.map((player) => player.team)).size;
  const teamCount = Math.max(2, Math.min(teamsInUse, Math.floor(players.length / 2)));
  // Players that share a team, as a comparable key (team labels don't matter).
  const splitKey = (teamOf: (id: string) => number) => {
    const groups = new Map<number, string[]>();
    players.forEach((player) => {
      const team = teamOf(player.id);
      groups.set(team, [...(groups.get(team) ?? []), player.id]);
    });
    return [...groups.values()].map((ids) => ids.sort().join(',')).sort().join('|');
  };
  const current = splitKey((id) => players.find((player) => player.id === id)!.team);

  let teams: Record<string, number> = {};
  for (let attempt = 0; attempt < 10; attempt++) {
    const order = players.map((player) => player.id);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    teams = {};
    order.forEach((id, i) => {
      teams[id] = i % teamCount;
    });
    if (splitKey((id) => teams[id]) !== current) {
      break;
    }
  }
  return teams;
}
