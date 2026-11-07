/**
 * @file The SaladBowl backend: game creation, the reactive game query, the
 * `dispatch` mutation that runs the shared reducers, the round timer, and
 * presence.
 *
 * Convex mutations are serializable transactions, so two players acting at
 * once can never lose each other's update.
 */

import * as Immutable from 'immutable';
import { ConvexError, v } from 'convex/values';

import { internal } from './_generated/api';
import type { Doc } from './_generated/dataModel';
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from './_generated/server';
import ActionTypes from '../js/shared/ActionTypes';
import DEFAULT_GAME from '../js/shared/defaultGame';
import GameReducers from '../js/shared/reducers/GameReducers';
import MathUtil from '../js/shared/MathUtil';
import type { Action, Game } from '../js/shared/types';
import { roundTimerChange, translateServerAction } from './lib/serverActions';
import { normalizeGameCode, randomGameCode } from '../js/shared/GameCode';

/** A user counts as disconnected after this long without a heartbeat. */
export const PRESENCE_TIMEOUT_MS = 20_000;

/** Games older than this are deleted by the daily cleanup cron. */
const GAME_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function findGame(
  ctx: QueryCtx,
  code: string,
): Promise<Doc<'games'> | null> {
  return await ctx.db
    .query('games')
    .withIndex('by_code', (q) => q.eq('code', normalizeGameCode(code)))
    .unique();
}

async function getGameOrThrow(
  ctx: QueryCtx,
  code: string,
): Promise<Doc<'games'>> {
  const row = await findGame(ctx, code);
  if (!row) {
    throw new ConvexError('Game not found');
  }
  return row;
}

function toGame(row: Doc<'games'>): Game {
  return Immutable.fromJS(row.state) as Game;
}

/**
 * Run a `CLIENT.*` action through the shared reducers, save the result, and
 * start or stop the round timer if the round's running state changed.
 */
async function applyClientAction(
  ctx: MutationCtx,
  row: Doc<'games'>,
  game: Game,
  clientAction: Action,
): Promise<void> {
  let next: Game;
  try {
    next = GameReducers(game, clientAction);
  } catch (error) {
    // Reducers throw plain Errors for invalid moves (e.g. joining twice).
    // ConvexError keeps the message visible to the client in production.
    throw new ConvexError(error instanceof Error ? error.message : String(error));
  }

  const patch: Partial<Doc<'games'>> = { state: next.toJS() };

  switch (roundTimerChange(game, next)) {
    case 'start':
      patch.roundTimeoutId = await ctx.scheduler.runAfter(
        next.get('secondsThisRound') * 1000,
        internal.game.endRound,
        { gameId: row._id, roundId: row.roundId },
      );
      break;
    case 'stop':
      if (row.roundTimeoutId) {
        await ctx.scheduler.cancel(row.roundTimeoutId);
      }
      patch.roundTimeoutId = null;
      patch.roundId = row.roundId + 1;
      break;
  }

  await ctx.db.patch(row._id, patch);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Create a game and return its shareable code. Replaces `POST /new-game`. */
export const createGame = mutation({
  args: { wordsPerPlayer: v.number(), secondsPerRound: v.number() },
  handler: async (ctx, args) => {
    const wordsPerPlayer = MathUtil.clamp(Math.floor(args.wordsPerPlayer) || 5, 1, 100);
    const secondsPerRound = MathUtil.clamp(Math.floor(args.secondsPerRound) || 60, 1, 200);

    let code = randomGameCode();
    for (let attempt = 1; await findGame(ctx, code); attempt++) {
      // Lengthen the code if the short space is getting crowded.
      code = randomGameCode(attempt < 10 ? undefined : 5);
    }

    const state = DEFAULT_GAME.set('id', code)
      .set('wordsPerPlayer', wordsPerPlayer)
      .set('secondsPerRound', secondsPerRound)
      .toJS();

    await ctx.db.insert('games', {
      code,
      state,
      roundId: 0,
      roundTimeoutId: null,
      createdAt: Date.now(),
    });
    return code;
  },
});

/** The full game state, pushed to every subscriber on change. `null` = not found. */
export const getGame = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const row = await findGame(ctx, code);
    return row ? row.state : null;
  },
});

/**
 * Apply a client `SERVER.*` action. The Convex counterpart of the old
 * `SocketActionHandlers`.
 */
export const dispatch = mutation({
  args: { code: v.string(), userId: v.string(), action: v.any() },
  handler: async (ctx, { code, userId, action }) => {
    if (!action || typeof action.type !== 'string') {
      throw new ConvexError('Malformed action');
    }
    if (!userId) {
      throw new ConvexError('Missing userId');
    }
    const row = await getGameOrThrow(ctx, code);
    const game = toGame(row);
    const clientAction = translateServerAction(game, action, userId, Date.now());
    if (clientAction) {
      await applyClientAction(ctx, row, game, clientAction);
    }
    return null;
  },
});

/**
 * Called by every open client every few seconds. Records presence, marks the
 * user connected if they weren't, and returns the server clock so clients can
 * render the round countdown against server time.
 */
export const heartbeat = mutation({
  args: { code: v.string(), userId: v.string() },
  handler: async (ctx, { code, userId }) => {
    const now = Date.now();
    const row = await findGame(ctx, code);
    if (!row || !userId) {
      return now;
    }

    const presence = await ctx.db
      .query('presence')
      .withIndex('by_game_user', (q) => q.eq('gameId', row._id).eq('userId', userId))
      .unique();

    if (!presence) {
      const presenceId = await ctx.db.insert('presence', {
        gameId: row._id,
        userId,
        lastSeen: now,
        checkScheduled: true,
      });
      await ctx.scheduler.runAfter(PRESENCE_TIMEOUT_MS, internal.game.checkPresence, {
        presenceId,
      });
    } else {
      await ctx.db.patch(presence._id, { lastSeen: now, checkScheduled: true });
      if (!presence.checkScheduled) {
        await ctx.scheduler.runAfter(PRESENCE_TIMEOUT_MS, internal.game.checkPresence, {
          presenceId: presence._id,
        });
      }
    }

    const game = toGame(row);
    if (!game.getIn(['connections', userId])) {
      await applyClientAction(ctx, row, game, {
        type: ActionTypes.CLIENT.USER_CONNECTION,
        userId,
        connected: true,
      });
    }
    return now;
  },
});

// ---------------------------------------------------------------------------
// Internal (scheduled) functions
// ---------------------------------------------------------------------------

/** Scheduled when a round starts; ends it unless it already ended early. */
export const endRound = internalMutation({
  args: { gameId: v.id('games'), roundId: v.number() },
  handler: async (ctx, { gameId, roundId }) => {
    const row = await ctx.db.get(gameId);
    if (!row || row.roundId !== roundId) {
      return;
    }
    const game = toGame(row);
    if (!game.get('roundStarted') || game.get('ended')) {
      return;
    }
    // This function *is* the scheduled timeout, so there is nothing to cancel.
    await applyClientAction(ctx, { ...row, roundTimeoutId: null }, game, {
      type: ActionTypes.CLIENT.ROUND_ENDED,
    });
  },
});

/**
 * Runs once per user per timeout window while they're heartbeating. Marks the
 * user disconnected once their heartbeats stop.
 */
export const checkPresence = internalMutation({
  args: { presenceId: v.id('presence') },
  handler: async (ctx, { presenceId }) => {
    const presence = await ctx.db.get(presenceId);
    if (!presence) {
      return;
    }
    const expiresAt = presence.lastSeen + PRESENCE_TIMEOUT_MS;
    if (Date.now() < expiresAt) {
      await ctx.scheduler.runAt(expiresAt, internal.game.checkPresence, { presenceId });
      return;
    }

    await ctx.db.patch(presenceId, { checkScheduled: false });
    const row = await ctx.db.get(presence.gameId);
    if (!row) {
      return;
    }
    const game = toGame(row);
    if (game.getIn(['connections', presence.userId])) {
      await applyClientAction(ctx, row, game, {
        type: ActionTypes.CLIENT.USER_CONNECTION,
        userId: presence.userId,
        connected: false,
      });
    }
  },
});

/** Daily cron: delete stale games and their presence rows, in batches. */
export const deleteOldGames = internalMutation({
  args: {},
  handler: async (ctx) => {
    const BATCH = 50;
    const cutoff = Date.now() - GAME_MAX_AGE_MS;
    const old = await ctx.db
      .query('games')
      .order('asc')
      .filter((q) => q.lt(q.field('createdAt'), cutoff))
      .take(BATCH);
    for (const game of old) {
      const presences = await ctx.db
        .query('presence')
        .withIndex('by_game_user', (q) => q.eq('gameId', game._id))
        .collect();
      for (const presence of presences) {
        await ctx.db.delete(presence._id);
      }
      await ctx.db.delete(game._id);
    }
    if (old.length === BATCH) {
      await ctx.scheduler.runAfter(0, internal.game.deleteOldGames, {});
    }
  },
});
