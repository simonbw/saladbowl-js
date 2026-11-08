import { describe, it, expect } from 'vitest';

import ActionTypes from '../js/shared/ActionTypes';
import reducer from '../js/shared/reducers/GameReducers';
import { diffGameEvents } from '../js/web/GameEvents';
import { formatSeconds } from '../js/web/format';
import { startedGame } from './gameFixtures';

const start = (game: any) =>
  reducer(game, { type: ActionTypes.CLIENT.ROUND_STARTED, startTime: 0, secondsThisRound: 60 });

describe('diffGameEvents', () => {
  it('ignores the first load', () => {
    const game = startedGame();
    expect(diffGameEvents(reducer(null, null), game)).toEqual([]);
    expect(diffGameEvents(null, game)).toEqual([]);
  });

  it("reports time's up with the turn's score and who's next", () => {
    let game = start(startedGame('EV', 2));
    game = reducer(game, { type: ActionTypes.CLIENT.WORD_CORRECT, time: 1 });
    const next = reducer(game, { type: ActionTypes.CLIENT.ROUND_ENDED });
    expect(diffGameEvents(game, next)).toEqual([{
      type: 'timeUp',
      playerId: 'p0',
      playerName: 'P0',
      team: 0,
      pointsThisTurn: 1,
      nextPlayerId: 'p1',
      nextPlayerName: 'P1',
    }]);
  });

  it('reports a new phase (not time up) when the bowl empties', () => {
    let game = start(startedGame('EV2', 1));
    for (let i = 0; i < 3; i++) {
      game = reducer(game, { type: ActionTypes.CLIENT.WORD_CORRECT, time: 1000 });
    }
    const next = reducer(game, { type: ActionTypes.CLIENT.WORD_CORRECT, time: 10_000 });
    const events = diffGameEvents(game, next);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: 'phaseChanged', phaseIndex: 1, playerId: 'p0', secondsLeftover: 50 });
  });

  it('reports game over', () => {
    const game = start(startedGame()).set('phaseIndex', 2);
    let prev = game;
    for (let i = 0; i < 3; i++) {
      prev = reducer(prev, { type: ActionTypes.CLIENT.WORD_CORRECT, time: 1 });
    }
    const next = reducer(prev, { type: ActionTypes.CLIENT.WORD_CORRECT, time: 1 });
    expect(diffGameEvents(prev, next)).toEqual([{ type: 'gameOver' }]);
  });
});

describe('formatSeconds', () => {
  it('shows whole seconds, then tenths under ten', () => {
    expect(formatSeconds(200_000)).toBe('200');
    expect(formatSeconds(120_000)).toBe('120');
    expect(formatSeconds(59_200)).toBe('60');
    expect(formatSeconds(9_420)).toBe('9.4');
    expect(formatSeconds(-50)).toBe('0.0');
  });
});
