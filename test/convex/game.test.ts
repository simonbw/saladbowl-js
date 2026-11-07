// @vitest-environment edge-runtime
import { convexTest } from 'convex-test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '../../convex/_generated/api';
import schema from '../../convex/schema';
import ActionTypes from '../../js/shared/ActionTypes';

const modules = import.meta.glob('../../convex/**/*.ts');

const PLAYERS = ['alice', 'bob', 'carol', 'dave'];

async function setup(secondsPerRound = 30) {
  const t = convexTest(schema, modules);
  const code = await t.mutation(api.game.createGame, { wordsPerPlayer: 1, secondsPerRound });
  const send = (userId: string, action: Record<string, unknown>) =>
    t.mutation(api.game.dispatch, { code, userId, action: action as any });
  const getGame = () => t.query(api.game.getGame, { code });
  return { t, code, send, getGame };
}

/** Four players, one word each, two teams of two, game started. */
async function startedGame(secondsPerRound = 30) {
  const ctx = await setup(secondsPerRound);
  const { send } = ctx;
  for (const id of PLAYERS) {
    await send(id, { type: ActionTypes.SERVER.JOIN_GAME, name: id.toUpperCase() });
    await send(id, {
      type: ActionTypes.SERVER.SAVE_WORDS,
      words: [{ playerWordIndex: 0, word: `${id}-word` }],
    });
  }
  await send('carol', { type: ActionTypes.SERVER.JOIN_TEAM, team: 1 });
  await send('dave', { type: ActionTypes.SERVER.JOIN_TEAM, team: 1 });
  await send('alice', { type: ActionTypes.SERVER.START_GAME });
  return ctx;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createGame / getGame', () => {
  it('creates a game with a short code and the requested settings', async () => {
    const { code, getGame } = await setup(45);
    expect(code).toMatch(/^[A-Z2-9]{4}$/);
    const game = await getGame();
    expect(game.id).toBe(code);
    expect(game.wordsPerPlayer).toBe(1);
    expect(game.secondsPerRound).toBe(45);
  });

  it('looks games up case-insensitively and returns null when missing', async () => {
    const { t, code } = await setup();
    expect(await t.query(api.game.getGame, { code: code.toLowerCase() })).not.toBeNull();
    expect(await t.query(api.game.getGame, { code: 'NOPE' })).toBeNull();
  });

  it('clamps out-of-range settings', async () => {
    const t = convexTest(schema, modules);
    const code = await t.mutation(api.game.createGame, { wordsPerPlayer: 0, secondsPerRound: 9999 });
    const game = await t.query(api.game.getGame, { code });
    expect(game.wordsPerPlayer).toBe(5);
    expect(game.secondsPerRound).toBe(200);
  });
});

describe('pre-game dispatch', () => {
  it('runs join / words / teams / start through the shared reducers', async () => {
    const { getGame } = await startedGame();
    const game = await getGame();
    expect(game.players.map((p: any) => p.id)).toEqual(PLAYERS);
    expect(game.players.map((p: any) => p.team)).toEqual([0, 0, 1, 1]);
    expect(game.words.every((w: any) => w.inBowl)).toBe(true);
    expect(game.started).toBe(true);
  });

  it('rejects joining twice with a readable error', async () => {
    const { send } = await setup();
    await send('alice', { type: ActionTypes.SERVER.JOIN_GAME, name: 'A' });
    await expect(send('alice', { type: ActionTypes.SERVER.JOIN_GAME, name: 'A' })).rejects.toThrow(
      /already in game/,
    );
  });

  it('ignores unknown actions', async () => {
    const { send, getGame } = await setup();
    const before = await getGame();
    await send('alice', { type: 'SERVER.NOPE' });
    expect(await getGame()).toEqual(before);
  });
});

describe('round timer', () => {
  it('ends the round when the scheduled timer fires', async () => {
    const { t, send, getGame } = await startedGame(30);
    await send('alice', { type: ActionTypes.SERVER.START_ROUND });
    let game = await getGame();
    expect(game.roundStarted).toBe(true);
    expect(game.secondsThisRound).toBe(30);

    vi.advanceTimersByTime(29_000);
    await t.finishInProgressScheduledFunctions();
    expect((await getGame()).roundStarted).toBe(true);

    vi.advanceTimersByTime(2_000);
    await t.finishInProgressScheduledFunctions();
    game = await getGame();
    expect(game.roundStarted).toBe(false);
    expect(game.teamIndex).toBe(1);
  });

  it('ignores a second START_ROUND while a round is running', async () => {
    const { send, getGame } = await startedGame();
    await send('alice', { type: ActionTypes.SERVER.START_ROUND });
    const startedAt = (await getGame()).roundStartedAt;
    vi.advanceTimersByTime(5_000);
    await send('alice', { type: ActionTypes.SERVER.START_ROUND });
    expect((await getGame()).roundStartedAt).toBe(startedAt);
  });

  it('ignores CORRECT_WORD outside a round', async () => {
    const { send, getGame } = await startedGame();
    await send('alice', { type: ActionTypes.SERVER.CORRECT_WORD });
    expect((await getGame()).points).toEqual([]);
  });

  it('cancels the timer when the bowl empties, and carries leftover time + bonus', async () => {
    const { t, send, getGame } = await startedGame(30);
    await send('alice', { type: ActionTypes.SERVER.START_ROUND });
    vi.advanceTimersByTime(10_000);
    for (let i = 0; i < PLAYERS.length; i++) {
      await send('alice', { type: ActionTypes.SERVER.CORRECT_WORD });
    }
    let game = await getGame();
    expect(game.roundStarted).toBe(false);
    expect(game.phaseIndex).toBe(1);
    expect(game.points).toHaveLength(4);
    expect(game.secondsLeftover).toBeCloseTo(20, 0);

    // Same player continues into the next phase with leftover + bonus seconds.
    await send('alice', { type: ActionTypes.SERVER.START_ROUND });
    game = await getGame();
    expect(game.roundStarted).toBe(true);
    expect(game.secondsThisRound).toBeCloseTo(25, 0);

    // The first round's timer (due at 30s) must not end this new round.
    vi.advanceTimersByTime(21_000);
    await t.finishInProgressScheduledFunctions();
    expect((await getGame()).roundStarted).toBe(true);

    // ...but this round's own timer (25s) does.
    vi.advanceTimersByTime(5_000);
    await t.finishInProgressScheduledFunctions();
    expect((await getGame()).roundStarted).toBe(false);
  });

  it('ends the round early on END_ROUND', async () => {
    const { t, send, getGame } = await startedGame(30);
    await send('alice', { type: ActionTypes.SERVER.START_ROUND });
    await send('alice', { type: ActionTypes.SERVER.END_ROUND });
    let game = await getGame();
    expect(game.roundStarted).toBe(false);
    expect(game.teamIndex).toBe(1);

    // Carol starts the next round; the cancelled timer must not end it.
    await send('carol', { type: ActionTypes.SERVER.START_ROUND });
    vi.advanceTimersByTime(29_000);
    await t.finishInProgressScheduledFunctions();
    game = await getGame();
    expect(game.roundStarted).toBe(true);
    expect(game.teamIndex).toBe(1);
  });

  it('plays all three phases through to game over', async () => {
    const { send, getGame } = await startedGame(30);
    for (let phase = 0; phase < 3; phase++) {
      await send('alice', { type: ActionTypes.SERVER.START_ROUND });
      for (let i = 0; i < PLAYERS.length; i++) {
        await send('alice', { type: ActionTypes.SERVER.CORRECT_WORD });
      }
    }
    const game = await getGame();
    expect(game.ended).toBe(true);
    expect(game.points).toHaveLength(12);
  });
});

describe('presence', () => {
  it('marks users connected on heartbeat and disconnected when heartbeats stop', async () => {
    const { t, code, getGame } = await startedGame();
    const serverTime = await t.mutation(api.game.heartbeat, { code, userId: 'alice' });
    expect(Math.abs(serverTime - Date.now())).toBeLessThan(1000);
    expect((await getGame()).connections.alice).toBe(true);

    // Keep heartbeating for a while: stays connected.
    for (let i = 0; i < 6; i++) {
      vi.advanceTimersByTime(5_000);
      await t.mutation(api.game.heartbeat, { code, userId: 'alice' });
      await t.finishInProgressScheduledFunctions();
    }
    expect((await getGame()).connections.alice).toBe(true);

    // Stop heartbeating: disconnected after the timeout.
    vi.advanceTimersByTime(21_000);
    await t.finishInProgressScheduledFunctions();
    vi.advanceTimersByTime(21_000);
    await t.finishInProgressScheduledFunctions();
    expect((await getGame()).connections.alice).toBe(false);

    // A disconnected current player can be skipped...
    await t.mutation(api.game.dispatch, {
      code,
      userId: 'bob',
      action: { type: ActionTypes.SERVER.SKIP_PLAYER, playerId: 'alice' },
    });
    expect((await getGame()).players[0].active).toBe(false);

    // ...and is reactivated when they come back.
    await t.mutation(api.game.heartbeat, { code, userId: 'alice' });
    const game = await getGame();
    expect(game.connections.alice).toBe(true);
    expect(game.players[0].active).toBe(true);
  });
});
