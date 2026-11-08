# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SaladBowl is a real-time multiplayer browser party game (the "Bowl of Nouns" word-guessing game). Each player joins a game from their own device; gameplay is synced through **Convex**. The frontend is a static Vite build hosted on **Vercel**. There is no server process of our own.

## Commands

- `npm run dev` — runs `convex dev` (pushes `convex/` functions on change) and the Vite dev server on port 3000. The first run asks to log in or link a project; `CONVEX_AGENT_MODE=anonymous npx convex dev` gives a local backend with no account.
- `npm run build` — Vite build of the static pages into `dist/` (needs `VITE_CONVEX_URL`, which `convex dev` writes to `.env.local`)
- `npm test` — Vitest (`test/**/*.test.{js,ts}`); `test/convex/` uses `convex-test` in the edge-runtime environment
- Single file: `npx vitest run test/GameHelpers.test.js`; filter by name: `npx vitest run -t "getNextWordIndex"`
- `npm run typecheck` — `tsc` for the app, then for `convex/` with its own tsconfig
- `npm run lint`

In dev, the player id lives in `sessionStorage`, so each browser tab is a separate player. That makes it easy to play a whole game on one machine.

## Deployment

Vercel runs `npx convex deploy --cmd 'npm run build'` (see `vercel.json`). That deploys the Convex functions to production, then builds the frontend with the prod `VITE_CONVEX_URL` injected. It needs `CONVEX_DEPLOY_KEY` (a production deploy key) set in the Vercel project's environment. `vercel.json` also rewrites `/{code}` → `game.html` and turns on clean URLs.

## Architecture

The defining idea: **the same Redux-style reducers run in the Convex backend and on the client.** Game state is a single `Immutable.Map`, and the reducer functions in `js/shared/reducers/` are pure transforms over it. Convex holds the authoritative copy (as plain JSON in the `games` table); clients mirror it.

### Source trees

- **`js/shared/`** — code imported by both Convex and the client: reducers, `ActionTypes`, `GameHelpers` (queries over game state like `getCurrentPlayer`), `defaultGame`, `GameCode`, small utilities.
- **`convex/`** — the backend. `schema.ts` (`games`, `presence`), `game.ts` (all functions), `lib/serverActions.ts` (pure `SERVER.*` → `CLIENT.*` translation), `crons.ts` (daily cleanup of games older than 7 days). `convex/_generated/` is codegen; it is committed.
- **`js/web/`** — the React 18 + Redux client. `gamePage.tsx` is the game page's entry; `newGamePage.ts` / `joinGamePage.ts` drive the two forms.
- **`*.html` at the repo root** — the static pages (`index`, `new-game`, `join-game`, `how-to-play`, `game`, `404`), each a Vite entry point listed in `PAGES` in `vite.config.ts`.

### Action conventions (`js/shared/ActionTypes.js`)

Action `type` strings are namespaced and the namespace controls routing:

- `SERVER.*` — client intent. `convexMiddleware` sends these to the `game.dispatch` mutation (and passes them to local reducers, which only use them for UI flags like `waitingForServer`).
- `CLIENT.*` — authoritative state changes. Only the backend creates these (in `translateServerAction`, where server timestamps enter), then runs them through `GameReducers`. On the client, only `CLIENT.REPLACE_GAME` is dispatched.
- `UI.*` — client-only, handled by `js/web/reducers/UIReducers.ts`.

### Backend flow (`convex/game.ts`)

- `createGame` makes a row with a random 4-letter `code` (`js/shared/GameCode.ts`) and returns it. URLs are `/{code}`.
- `dispatch(code, userId, action)` reads the row, runs `translateServerAction`, then `GameReducers`, and writes the result. Mutations are serializable transactions, so concurrent actions never lose updates.
- `translateServerAction` is also where the rules live: lobby actions only before the game starts, `START_GAME` only when `readyToStart`, round actions (start/correct/skip/undo/end) only from the current clue-giver. Lobby violations throw a `ConvexError` (the client shows its message); stale or out-of-turn in-game actions return `null` and are ignored.
- `playAgain(code, userId)` (from the game-over screen) creates one follow-up game, links it as `nextGameCode` on the old one, and joins each caller with their old name and team.
- **Round timer:** `applyClientAction` compares round state before and after. When a round starts it schedules `endRound` via `ctx.scheduler`. When a round stops early it cancels that and bumps `roundId`. `endRound` only fires if `roundId` still matches.
- **Presence:** clients call `heartbeat` every 5s. It updates the `presence` table (not the game row, so it doesn't push state to everyone) and schedules `checkPresence`, which flips `connections[userId]` to false after 20s of silence. `heartbeat` returns the server clock; `js/web/Timing.ts` uses it so the countdown matches server time.
- `getGame(code)` is the reactive query. Every change pushes the full game to every client.

### Client flow

- `gamePage.tsx` reads the code from the URL, gets a `userId` from storage (`js/web/backend/userId.ts`), builds the store (`Store.ts`: thunk → logging (dev only) → convex middleware), and starts `startGameSync` (`js/web/backend/gameSync.ts`: game subscription → `REPLACE_GAME`, connection state, heartbeats).
- `gameEffects.ts` subscribes to the store and runs `diffGameEvents` (`GameEvents.ts`) over consecutive game states to detect time's up / new phase / game over, then plays sounds (`Sounds.ts`, Web Audio) and shows announcements. `WakeLock.ts` keeps the screen on. Failed `SERVER.*` mutations show in the error banner via `convexMiddleware`.
- `GameApp.tsx` is a single connected component that picks which page to render purely from game state — `JoinGamePage` → `AddWordsPage` → `JoinTeamsPage` → then in-game `CurrentPlayerPage` / `GuessingPlayerPage` / `WaitingPlayerPage` → `GameOverPage`. There is no router; the visible "page" is derived state.

### Notable constraints

- Game state objects are Immutable collections; use `.get()` / `.set()`, not plain property access. Keep reducers Immutable-based and pure — Convex runs the same code.
- Components use the classic JSX runtime (`import React` explicitly).
- Identity is a client-generated id in `localStorage`, passed to every mutation. No auth.
