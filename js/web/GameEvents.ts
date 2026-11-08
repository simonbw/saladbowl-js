'use strict';

/**
 * @file Notable moments, found by comparing consecutive game states. The
 * backend only ever sends whole games, so this is how the client notices that
 * a turn just ran out or the bowl just emptied.
 */

import GameHelpers from '../shared/GameHelpers';
import type { Game } from '../shared/types';

export type GameEvent =
  | {
      type: 'timeUp';
      /** The clue-giver whose turn just ended, and their team. */
      playerId: string;
      playerName: string;
      team: number;
      /** Words scored this turn, if known. */
      pointsThisTurn: number | null;
      /** Who's up next. */
      nextPlayerId: string;
      nextPlayerName: string;
    }
  | {
      type: 'phaseChanged';
      phaseIndex: number;
      /** The clue-giver who carries on into the new phase. */
      playerId: string;
      playerName: string;
      secondsLeftover: number;
      bonusSeconds: number;
    }
  | { type: 'gameOver' };

export function diffGameEvents(prev: Game | null | undefined, next: Game | null | undefined): GameEvent[] {
  // Ignore the first load and anything that isn't a running game changing.
  if (!prev || !next || !prev.get('id') || prev.get('id') !== next.get('id')) {
    return [];
  }
  if (!prev.get('started') || prev.get('ended')) {
    return [];
  }

  if (next.get('ended')) {
    return [{ type: 'gameOver' }];
  }

  if (next.get('phaseIndex') > prev.get('phaseIndex')) {
    const player = GameHelpers.getCurrentPlayer(next);
    return [{
      type: 'phaseChanged',
      phaseIndex: next.get('phaseIndex'),
      playerId: player.get('id'),
      playerName: player.get('name'),
      secondsLeftover: Math.max(0, Math.round(next.get('secondsLeftover') ?? 0)),
      bonusSeconds: next.get('bonusSeconds') ?? 0,
    }];
  }

  if (prev.get('roundStarted') && !next.get('roundStarted')) {
    const player = GameHelpers.getCurrentPlayer(prev);
    const nextPlayer = GameHelpers.getCurrentPlayer(next);
    const atStart = prev.get('pointsAtRoundStart');
    return [{
      type: 'timeUp',
      playerId: player.get('id'),
      playerName: player.get('name'),
      team: player.get('team'),
      pointsThisTurn: typeof atStart === 'number' ? next.get('points').size - atStart : null,
      nextPlayerId: nextPlayer.get('id'),
      nextPlayerName: nextPlayer.get('name'),
    }];
  }

  return [];
}
