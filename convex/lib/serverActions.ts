/**
 * @file Turns client intent (`SERVER.*` actions) into the authoritative
 * `CLIENT.*` actions the shared reducers key on.
 *
 * This is the Convex-era port of the old socket handlers
 * (`PreGameHandlers` / `MidGameHandlers`). It is pure: the caller supplies the
 * current game, the acting user, and the server clock, so it is unit-testable
 * without a Convex runtime.
 */

import ActionTypes from '../../js/shared/ActionTypes';
import type { Action, Game } from '../../js/shared/types';

/**
 * Return the `CLIENT.*` action to run through `GameReducers`, or `null` to
 * ignore the request (unknown type, or not valid in the current game state).
 */
export function translateServerAction(
  game: Game,
  action: Action,
  userId: string,
  now: number,
): Action | null {
  const roundInProgress =
    game.get('started') && !game.get('ended') && game.get('roundStarted');

  switch (action.type) {
    // ---------- pre game ----------
    case ActionTypes.SERVER.JOIN_GAME:
      return {
        type: ActionTypes.CLIENT.PLAYER_JOINED,
        player: { id: userId, name: String(action.name ?? '') },
      };

    case ActionTypes.SERVER.SAVE_WORDS:
      if (!Array.isArray(action.words)) {
        return null;
      }
      return {
        type: ActionTypes.CLIENT.WORDS_UPDATED,
        playerId: userId,
        words: action.words,
      };

    case ActionTypes.SERVER.JOIN_TEAM:
      return {
        type: ActionTypes.CLIENT.TEAM_JOINED,
        playerId: userId,
        team: action.team,
      };

    case ActionTypes.SERVER.START_GAME:
      return { type: ActionTypes.CLIENT.GAME_STARTED };

    // ---------- mid game ----------
    case ActionTypes.SERVER.START_ROUND: {
      // A double-tapped "Ready" must not restart a running round's clock.
      if (!game.get('started') || game.get('ended') || game.get('roundStarted')) {
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
      if (!roundInProgress) {
        return null;
      }
      return { type: ActionTypes.CLIENT.WORD_CORRECT, time: now };

    case ActionTypes.SERVER.SKIP_WORD:
      if (!roundInProgress) {
        return null;
      }
      return { type: ActionTypes.CLIENT.WORD_SKIPPED };

    case ActionTypes.SERVER.END_ROUND:
      return { type: ActionTypes.CLIENT.ROUND_ENDED };

    case ActionTypes.SERVER.SKIP_PLAYER:
      if (typeof action.playerId !== 'string') {
        return null;
      }
      return {
        type: ActionTypes.CLIENT.PLAYER_SKIPPED,
        playerId: action.playerId,
      };

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
