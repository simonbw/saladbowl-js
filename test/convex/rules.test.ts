// @vitest-environment edge-runtime
import { convexTest } from 'convex-test';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '../../convex/_generated/api';
import schema from '../../convex/schema';
import ActionTypes from '../../js/shared/ActionTypes';

const modules = import.meta.glob('../../convex/**/*.ts');

const PLAYERS = ['alice', 'bob', 'carol', 'dave'];
const S = ActionTypes.SERVER;

async function setup() {
  const t = convexTest(schema, modules);
  const code = await t.mutation(api.game.createGame, { wordsPerPlayer: 1, secondsPerRound: 30 });
  const send = (userId: string, action: Record<string, unknown>) =>
    t.mutation(api.game.dispatch, { code, userId, action: action as any });
  const getGame = () => t.query(api.game.getGame, { code });
  return { t, code, send, getGame };
}

async function lobby(players = PLAYERS) {
  const ctx = await setup();
  for (const id of players) {
    await ctx.send(id, { type: S.JOIN_GAME, name: id.toUpperCase() });
    await ctx.send(id, { type: S.SAVE_WORDS, words: [{ playerWordIndex: 0, word: `${id}-word` }] });
  }
  if (players.includes('carol')) {
    await ctx.send('carol', { type: S.JOIN_TEAM, team: 1 });
  }
  if (players.includes('dave')) {
    await ctx.send('dave', { type: S.JOIN_TEAM, team: 1 });
  }
  return ctx;
}

async function startedGame() {
  const ctx = await lobby();
  await ctx.send('alice', { type: S.START_GAME });
  return ctx;
}

async function finishedGame() {
  const ctx = await startedGame();
  for (let phase = 0; phase < 3; phase++) {
    await ctx.send('alice', { type: S.START_ROUND });
    for (let i = 0; i < PLAYERS.length; i++) {
      await ctx.send('alice', { type: S.CORRECT_WORD });
    }
  }
  return ctx;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('lobby rules', () => {
  it('refuses to start before everyone is ready', async () => {
    const { send, getGame } = await lobby(['alice', 'bob', 'carol']);
    await expect(send('alice', { type: S.START_GAME })).rejects.toThrow(/Not ready yet/);
    expect((await getGame()).started).toBe(false);
  });

  it('refuses to start while a player is still adding nouns', async () => {
    const { send } = await lobby();
    await send('erin', { type: S.JOIN_GAME, name: 'Erin' });
    await expect(send('alice', { type: S.START_GAME })).rejects.toThrow(/Not ready yet/);
  });

  it('refuses joins, nouns and team changes once the game has started', async () => {
    const { send, getGame } = await startedGame();
    await expect(send('erin', { type: S.JOIN_GAME, name: 'Erin' })).rejects.toThrow(/already started/);
    await expect(
      send('alice', { type: S.SAVE_WORDS, words: [{ playerWordIndex: 0, word: 'sneaky' }] }),
    ).rejects.toThrow(/already started/);
    await expect(send('alice', { type: S.JOIN_TEAM, team: 1 })).rejects.toThrow(/locked/);
    const game = await getGame();
    expect(game.players).toHaveLength(4);
    expect(game.words[0].word).toBe('alice-word');
  });

  it('validates names, nouns and teams', async () => {
    const { send, getGame } = await setup();
    await expect(send('alice', { type: S.JOIN_GAME, name: '   ' })).rejects.toThrow(/Enter a name/);
    await expect(send('alice', { type: S.JOIN_GAME, name: 'x'.repeat(31) })).rejects.toThrow(/Enter a name/);
    await send('alice', { type: S.JOIN_GAME, name: '  Alice  ' });
    expect((await getGame()).players[0].name).toBe('Alice');

    await expect(
      send('alice', { type: S.SAVE_WORDS, words: [{ playerWordIndex: 1, word: 'nope' }] }),
    ).rejects.toThrow(/slot/);
    await expect(
      send('alice', { type: S.SAVE_WORDS, words: [{ playerWordIndex: -1, word: 'nope' }] }),
    ).rejects.toThrow(/slot/);
    await expect(
      send('alice', { type: S.SAVE_WORDS, words: [{ playerWordIndex: 0, word: ' ' }] }),
    ).rejects.toThrow(/Each noun/);
    await expect(send('alice', { type: S.JOIN_TEAM, team: 5 })).rejects.toThrow(/team does not exist/);
    await expect(send('bob', { type: S.JOIN_TEAM, team: 0 })).rejects.toThrow(/Join the game/);
  });
});

describe('turn rules', () => {
  it('only lets the current clue-giver run the round', async () => {
    const { send, getGame } = await startedGame();
    await send('bob', { type: S.START_ROUND });
    expect((await getGame()).roundStarted).toBe(false);

    await send('alice', { type: S.START_ROUND });
    await send('bob', { type: S.CORRECT_WORD });
    await send('carol', { type: S.SKIP_WORD });
    await send('dave', { type: S.END_ROUND });
    const game = await getGame();
    expect(game.points).toEqual([]);
    expect(game.words.every((w: any) => w.skips === 0)).toBe(true);
    expect(game.roundStarted).toBe(true);
  });

  it('undoes a mistaken Correct', async () => {
    const { send, getGame } = await startedGame();
    await send('alice', { type: S.START_ROUND });
    const word = (await getGame()).wordIndex;
    await send('alice', { type: S.CORRECT_WORD });
    await send('bob', { type: S.UNDO_CORRECT }); // not bob's turn: ignored
    expect((await getGame()).points).toHaveLength(1);

    await send('alice', { type: S.UNDO_CORRECT });
    const game = await getGame();
    expect(game.points).toHaveLength(0);
    expect(game.wordIndex).toBe(word);
    expect(game.words[word].inBowl).toBe(true);
  });

  it('only skips the current clue-giver, and only once they have dropped off', async () => {
    const { t, code, send, getGame } = await startedGame();
    await t.mutation(api.game.heartbeat, { code, userId: 'alice' });

    // Connected: ignored.
    await send('bob', { type: S.SKIP_PLAYER, playerId: 'alice' });
    expect((await getGame()).players[0].active).toBe(true);

    // Not the current player: ignored.
    await send('alice', { type: S.SKIP_PLAYER, playerId: 'carol' });
    expect((await getGame()).players[2].active).toBe(true);

    // Alice drops off; now she can be skipped.
    vi.advanceTimersByTime(21_000);
    await t.finishInProgressScheduledFunctions();
    vi.advanceTimersByTime(21_000);
    await t.finishInProgressScheduledFunctions();
    await send('carol', { type: S.SKIP_PLAYER, playerId: 'alice' });
    expect((await getGame()).players[0].active).toBe(false);
  });
});

describe('playAgain', () => {
  it('is refused while the game is still going', async () => {
    const { t, code } = await startedGame();
    await expect(t.mutation(api.game.playAgain, { code, userId: 'alice' })).rejects.toThrow(/not over/);
  });

  it('creates one follow-up game and moves players over with their teams', async () => {
    const { t, code, getGame } = await finishedGame();
    const next = await t.mutation(api.game.playAgain, { code, userId: 'carol' });
    expect(next).not.toBe(code);
    expect((await getGame()).nextGameCode).toBe(next);

    // Everyone else lands in the same new game.
    expect(await t.mutation(api.game.playAgain, { code, userId: 'alice' })).toBe(next);
    // Calling twice doesn't join twice.
    expect(await t.mutation(api.game.playAgain, { code, userId: 'alice' })).toBe(next);
    // A spectator gets the code but isn't joined for them.
    expect(await t.mutation(api.game.playAgain, { code, userId: 'stranger' })).toBe(next);

    const nextGame = await t.query(api.game.getGame, { code: next });
    expect(nextGame.started).toBe(false);
    expect(nextGame.wordsPerPlayer).toBe(1);
    expect(nextGame.secondsPerRound).toBe(30);
    expect(nextGame.players.map((p: any) => [p.id, p.name, p.team])).toEqual([
      ['carol', 'CAROL', 1],
      ['alice', 'ALICE', 0],
    ]);
    expect(nextGame.words.every((w: any) => w.word === null)).toBe(true);
  });

  it('lets players change teams in the follow-up game', async () => {
    const { t, code } = await finishedGame();
    const next = await t.mutation(api.game.playAgain, { code, userId: 'carol' });
    const sendNext = (userId: string, action: Record<string, unknown>) =>
      t.mutation(api.game.dispatch, { code: next, userId, action: action as any });
    await sendNext('carol', { type: S.JOIN_TEAM, team: 0 });
    const nextGame = await t.query(api.game.getGame, { code: next });
    expect(nextGame.players[0].team).toBe(0);
  });
});

describe('SHUFFLE_TEAMS', () => {
  const teamsOf = (game: any) => Object.fromEntries(game.players.map((p: any) => [p.id, p.team]));
  const splitOf = (game: any) => {
    const groups: Record<number, string[]> = {};
    game.players.forEach((p: any) => (groups[p.team] ??= []).push(p.id));
    return Object.values(groups).map((ids) => ids.sort().join(',')).sort().join('|');
  };

  it('deals everyone onto even teams and changes the split', async () => {
    const { send, getGame } = await lobby([...PLAYERS, 'erin', 'frank']);
    const before = await getGame();
    await send('erin', { type: S.SHUFFLE_TEAMS });
    const after = await getGame();
    const sizes = Object.values(teamsOf(after)).reduce<Record<number, number>>((acc, team: any) => {
      acc[team] = (acc[team] ?? 0) + 1;
      return acc;
    }, {});
    expect(sizes).toEqual({ 0: 3, 1: 3 });
    expect(splitOf(after)).not.toBe(splitOf(before));
  });

  it('keeps the number of teams in use', async () => {
    const { send, getGame } = await lobby([...PLAYERS, 'erin', 'frank']);
    await send('erin', { type: S.JOIN_TEAM, team: 2 });
    await send('frank', { type: S.JOIN_TEAM, team: 2 });
    await send('alice', { type: S.SHUFFLE_TEAMS });
    expect(new Set(Object.values(teamsOf(await getGame())))).toEqual(new Set([0, 1, 2]));
  });

  it('is refused once the game starts, or from someone not in it', async () => {
    const { send } = await lobby();
    await expect(send('stranger', { type: S.SHUFFLE_TEAMS })).rejects.toThrow(/Join the game/);
    await send('alice', { type: S.START_GAME });
    await expect(send('alice', { type: S.SHUFFLE_TEAMS })).rejects.toThrow(/locked/);
  });
});
