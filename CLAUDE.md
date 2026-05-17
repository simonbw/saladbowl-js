# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SaladBowl is a real-time multiplayer browser party game (the "Bowl of Nouns" word-guessing game). Each player joins a game from their own device; gameplay is synced over WebSockets.

## Commands

- `npm run dev` — run the server with nodemon (auto-restart on changes), port 3000
- `npm run build` — bundle the client with Parcel into `dist/` (`js/web/gamePage.js` + `styles/main.scss`)
- `npm start` — run the server in production mode (`NODE_ENV=production`)
- `npm test` — run the Mocha test suite (`mocha --recursive --use_strict`)
- Run a single test file: `npx mocha test/GameHelpersTest.js`
- Filter tests by name: `npx mocha --recursive --grep "getNextWordIndex"`

The server serves the client bundle from `dist/`, so **`npm run build` must run before the client will load**. There is no build watcher wired up — rebuild after changing anything under `js/web/` or `styles/`. The `PORT` env var overrides the default 3000.

Targets Node 12.x (`engines` in package.json). The `.travis.yml` pinning Node 5 is stale.

## Architecture

The defining idea: **the same Redux-style reducers run on both the server and the client.** Game state is a single `Immutable.Map`, and the reducer functions in `js/shared/reducers/` are pure transforms over it. The server is the source of truth; clients keep a local mirror and reconcile.

### Three source trees under `js/`

- **`js/shared/`** — code imported by both server and client. The reducers, `ActionTypes`, `MessageTypes`, `GameHelpers` (queries over game state like `getCurrentPlayer`, `playerIsJoined`), `defaultGame` (the initial Immutable game map), and small utilities.
- **`js/server/`** — Express app + socket.io. `app.js` builds the Express app; `www` is the entry point that creates the HTTP server and wires socket.io.
- **`js/web/`** — the React + Redux client. `gamePage.js` is the Parcel entry point.

### Action conventions (`js/shared/ActionTypes.js`)

Action `type` strings are namespaced and the namespace controls routing:

- `SERVER.*` — client→server intent. The client's `socketMiddleware` intercepts any action whose type starts with `SERVER.` and emits it over the socket *instead of* reducing it locally.
- `CLIENT.*` — server→client broadcasts (e.g. `REPLACE_GAME`, `ROUND_STARTED`).
- `UI.*` — client-only, handled by `js/web/reducers/UIReducers.js`, never sent over the wire.

### Server request/socket flow

1. `guaranteeUser` middleware assigns each visitor a `userId` cookie.
2. HTTP routes (`js/server/Routes.js`) render Handlebars templates (`templates/`). `POST /new-game` creates a game; `GET /:gameId` renders the game page with the serialized initial game state embedded.
3. `GameStore` holds games **in memory only** (a plain object, incrementing numeric IDs) — games are lost on restart and not shared across processes.
4. socket.io connections pass through the middleware chain in `js/server/socket/GameSocket.js` (player attach → logging → heartbeat → game lookup → action handlers → connections).
5. `SocketActionHandlers` receives `GAME` messages, looks up the handler for `action.type` in the merged `PreGameHandlers` / `MidGameHandlers` / `OutOfSyncHelper` maps, and calls it. Handlers mutate state via `GameStore.dispatch(gameId, action)`, which runs the shared `GameReducers` and saves.

### Client flow

- `js/web/Store.js` builds the Redux store with `thunkMiddleware`, `loggingMiddleware`, and `socketMiddleware` (in that order). `AppReducers` splits state into `game` (shared reducers) and `ui` (client reducers).
- `js/web/socket/SocketHandlers.js` registers handlers for incoming socket messages, which dispatch `CLIENT.*` actions into the store.
- `GameApp.js` is a single connected component that picks which page to render purely from game state — `JoinGamePage` → `AddWordsPage` → `JoinTeamsPage` → then in-game `CurrentPlayerPage` / `GuessingPlayerPage` / `WaitingPlayerPage` → `GameOverPage`. There is no router; the visible "page" is derived state.

### Notable constraints

- Uses old major versions: React 0.14, Redux 3, react-redux 4, Immutable 3, socket.io 1. APIs differ from current versions — match the existing style.
- Game state objects are Immutable collections; use `.get()` / `.set()`, not plain property access.
