import { describe, it, expect } from 'vitest';

import ActionTypes from '../../js/shared/ActionTypes';
import GameHelpers from '../../js/shared/GameHelpers';
import reducer from '../../js/shared/reducers/GameReducers';
import type { Game } from '../../js/shared/types';
import { startedGame } from '../gameFixtures';

const run = (game: Game, type: string, extra: Record<string, unknown> = {}) =>
  reducer(game, { type, ...extra });

const startRound = (game: Game) =>
  run(game, ActionTypes.CLIENT.ROUND_STARTED, { startTime: 0, secondsThisRound: 60 });

describe('WORD_SKIPPED', () => {
  it('never hands back the word that was just skipped', () => {
    for (let trial = 0; trial < 100; trial++) {
      let game = startRound(startedGame('G' + trial));
      // Leave two words in the bowl, the case where a repeat was most likely.
      game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 1 });
      game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 2 });
      for (let skip = 0; skip < 5; skip++) {
        const before = game.get('wordIndex');
        game = run(game, ActionTypes.CLIENT.WORD_SKIPPED);
        expect(game.get('wordIndex')).not.toBe(before);
        expect(game.getIn(['words', before, 'skips'])).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the last word when it is the only one left', () => {
    let game = startRound(startedGame());
    for (let i = 0; i < 3; i++) {
      game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: i });
    }
    const last = game.get('wordIndex');
    expect(run(game, ActionTypes.CLIENT.WORD_SKIPPED).get('wordIndex')).toBe(last);
  });
});

describe('CORRECT_UNDONE', () => {
  it('removes the point and makes the word current again', () => {
    let game = startRound(startedGame('UNDO', 2));
    const word = game.get('wordIndex');
    game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 1 });
    expect(game.get('points').size).toBe(1);
    expect(GameHelpers.canUndoCorrect(game)).toBe(true);

    game = run(game, ActionTypes.CLIENT.CORRECT_UNDONE);
    expect(game.get('points').size).toBe(0);
    expect(game.get('wordIndex')).toBe(word);
    expect(game.getIn(['words', word, 'inBowl'])).toBe(true);

    // Only once.
    expect(GameHelpers.canUndoCorrect(game)).toBe(false);
    expect(run(game, ActionTypes.CLIENT.CORRECT_UNDONE)).toBe(game);
  });

  it('cannot undo once the round is over', () => {
    let game = startRound(startedGame('UNDO2', 2));
    game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 1 });
    game = run(game, ActionTypes.CLIENT.ROUND_ENDED);
    expect(GameHelpers.canUndoCorrect(game)).toBe(false);
  });
});

describe('ROUND_STARTED', () => {
  it('records the score at the start of the turn', () => {
    let game = startRound(startedGame('PTS', 2));
    game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 1 });
    game = run(game, ActionTypes.CLIENT.ROUND_ENDED);
    game = startRound(game);
    expect(game.get('pointsAtRoundStart')).toBe(1);
  });
});

describe('PLAYER_SKIPPED', () => {
  it('moves to the next player on the same team', () => {
    let game = startedGame();
    expect(GameHelpers.getCurrentPlayer(game).get('id')).toBe('p0');
    game = run(game, ActionTypes.CLIENT.PLAYER_SKIPPED, { playerId: 'p0' });
    expect(GameHelpers.getCurrentPlayer(game).get('id')).toBe('p2');
    expect(game.get('teamIndex')).toBe(0);
  });

  it('passes the turn to the next team when nobody on this team is left', () => {
    let game = startedGame();
    game = run(game, ActionTypes.CLIENT.PLAYER_SKIPPED, { playerId: 'p0' });
    game = run(game, ActionTypes.CLIENT.PLAYER_SKIPPED, { playerId: 'p2' });
    // p2 stays in the rotation so team 0 always has a clue-giver…
    expect(GameHelpers.getPlayer(game, 'p2').get('active')).toBe(true);
    // …and team 1 is up.
    expect(game.get('teamIndex')).toBe(1);
    expect(GameHelpers.getCurrentPlayer(game).get('team')).toBe(1);
  });

  it('never leaves a team without a current player', () => {
    // Even if every player on a team is somehow inactive, rendering must not crash.
    let game = startedGame();
    game = game.setIn(['players', 0, 'active'], false).setIn(['players', 2, 'active'], false);
    expect(() => GameHelpers.getTeams(game)).not.toThrow();
    expect(GameHelpers.getCurrentPlayer(game)).toBeTruthy();
  });
});

describe('GameHelpers.getGameStats', () => {
  it('totals points per team and phase and ranks clue-givers', () => {
    let game = startRound(startedGame('STATS', 2));
    game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 1 });
    game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 2 });
    game = run(game, ActionTypes.CLIENT.WORD_SKIPPED);
    game = run(game, ActionTypes.CLIENT.ROUND_ENDED);
    game = startRound(game);
    game = run(game, ActionTypes.CLIENT.WORD_CORRECT, { time: 3 });

    const stats = GameHelpers.getGameStats(game);
    expect(stats.teams.map((t) => t.total)).toEqual([2, 1]);
    expect(stats.teams[0].byPhase).toEqual([2, 0, 0]);
    expect(stats.winners).toEqual([0]);
    expect(stats.players[0]).toMatchObject({ id: 'p0', points: 2 });
    expect(stats.mostSkipped?.skips).toBe(1);
  });

  it('reports a tie and no most-skipped word when nothing was skipped', () => {
    const stats = GameHelpers.getGameStats(startedGame());
    expect(stats.winners).toEqual([]);
    expect(stats.mostSkipped).toBeNull();
  });
});
