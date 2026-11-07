# Migration Design: Heroku → Vercel + Convex

**Status:** Phases 0–5 implemented on branch `migrate/vercel-convex`
(2026-11-07); Phase 6 (DNS cutover, Heroku decommission) pending ·
**Date:** 2026-05-16

> **Implementation notes (2026-11-07)** — where the build differs from this design:
> - Presence uses a separate `presence` table plus a scheduled `checkPresence`
>   per user, not `lastSeen` in the game row. That way a heartbeat doesn't push
>   the whole game to every client, and "disconnected" is noticed even when
>   nothing else changes.
> - `heartbeat` also returns the server clock, which replaces the old socket
>   heartbeat for clock sync (`js/web/Timing.ts`).
> - Static pages are plain HTML at the repo root, built as a Vite multi-page
>   app. `vite.config.ts` copies Vercel's clean-URL and `/{code}` routing
>   into the dev server.
> - Server-side guards were added: `START_ROUND` while a round is running, and
>   `CORRECT_WORD`/`SKIP_WORD` outside a round, are ignored.
> - A daily cron deletes games older than 7 days.
> - Fixed a units bug in `WORD_CORRECT`'s `secondsLeftover` (it mixed ms and
>   s), which had kept the "leftover + bonus seconds" feature from ever working.

## 1. Goal

Move SaladBowl off Heroku and onto Vercel, so all of Simon's projects, domains,
and billing live in one place. Heroku is currently a recurring cost for an app
that is mostly idle.

Vercel cannot host a long-lived process or a WebSocket server, so the
real-time, stateful parts of the app move to **Convex**, provisioned through the
**Vercel Marketplace as a native integration** (unified billing on the Vercel
invoice, managed from the Vercel dashboard — no separate account). At SaladBowl's
traffic this lands comfortably inside the free tiers of both services.

## 2. Why this is tractable

The project's defining idea works in our favour: the pure reducers in
`js/shared/reducers/` (`GameReducers.js:17`) are the same on server and client
and don't care where they run. The migration is mostly **relocating the three
things a persistent server provides today**, leaving the game logic itself
almost untouched:

| Today (Heroku) | After (Vercel + Convex) |
| --- | --- |
| socket.io persistent connections | Convex reactive queries (Convex hosts the WebSocket; the browser connects to Convex directly, not through Vercel) |
| `GameStore` in-memory object (`js/server/GameStore.js:17`) | A Convex `games` table |
| Single Node process running reducers on `GAME` messages | A Convex `dispatch` mutation: read → run `GameReducers` → write |
| Per-socket `setTimeout` round timer (`MidGameHandlers.js:50`) | `ctx.scheduler.runAfter` + an `endRound` internal mutation |
| Express + Handlebars HTTP layer | Static pages on Vercel's CDN |
| `userId` cookie via `guaranteeUser` | `userId` generated client-side, kept in `localStorage` |

`js/shared/` stays the single source of truth, imported by **both** the Convex
functions and the client bundle. The authoritative copy of the reducers now
runs inside Convex; the client keeps a mirror — which is exactly the model
`CLAUDE.md` already describes, just with a different transport.

## 3. Target architecture

```
  Browser (React 0.14 + Redux 3, static bundle on Vercel CDN)
    │
    │  convexMiddleware: SERVER.* actions ──▶ client.mutation(api.game.dispatch, …)
    │  subscription:     client.onUpdate(api.game.getGame, {code}) ──▶ REPLACE_GAME
    ▼
  Convex deployment (provisioned via Vercel Marketplace)
    ├─ games table            authoritative game state (one row per game)
    ├─ dispatch  (mutation)   routes SERVER.* → ported handler → GameReducers → write
    ├─ getGame   (query)      reactive; pushes full game state to subscribers
    ├─ createGame(mutation)   replaces POST /new-game
    ├─ heartbeat (mutation)   presence; updates lastSeen
    └─ endRound  (internal)   scheduled round timer callback
```

There is no server process and no SSR. The game page is a client-rendered SPA
that reads the game code from the URL and subscribes to Convex.

## 4. Key design decisions

### 4.1 Game state lives in a Convex `games` table

One row per game. The whole game state stays a JSON blob so the shared reducers
need no changes:

```
games {
  code:           string     // short shareable code, e.g. "K7QP" — indexed
  state:          any         // the game JSON (Immutable map .toJS()'d)
  roundId:        number      // monotonic; guards the scheduled timer
  roundTimeoutId: id | null   // _scheduled_functions id, for cancellation
  createdAt:      number
}
```

The `dispatch` mutation does: read row → `Immutable.fromJS(row.state)` → run
`GameReducers(game, action)` → `.toJS()` → write. **Convex mutations are
serializable transactions with optimistic-concurrency retry**, so the
lost-update race that a serverless rewrite would normally introduce (two players
acting at once during the add-words phase) simply does not occur.

### 4.2 Game IDs → short random codes

`GameStore` uses an in-process incrementing integer (`GameStore.js:19-22`),
which cannot work without a single process. Replace with a short random code
(4–5 chars) generated in `createGame`, uniqueness-checked against the `code`
index with retry on the rare collision. Friendlier to type/share than a UUID.
URLs become `/{code}`.

### 4.3 Identity → client-side `userId`

Drop the `userId` cookie and `guaranteeUser` middleware. The client generates a
`userId` once (`crypto.randomUUID()`), stores it in `localStorage` next to the
existing `userName`, and passes it as an argument to every mutation. Adequate
for a casual party game.

### 4.4 Realtime model: full-state push (no incremental replay)

Today the server enriches a `SERVER.*` intent action with authoritative data
(timestamps), translates it to a `CLIENT.*` action, runs the reducer, and
broadcasts that `CLIENT.*` action; clients replay it and hash-check for drift
(`GameHandlers.js`, `OutOfSyncHelper.js`).

With Convex, the `getGame` **query result is the full authoritative state**.
Every change pushes the whole game to subscribers, who dispatch a single
`CLIENT.REPLACE_GAME`. This **deletes the entire drift/reconciliation
machinery** — `gameHashCode` checks, `SERVER.OUT_OF_SYNC`, `OutOfSyncHelper`.
The game state is tiny; pushing it whole is cheap.

The client still does **not** optimistically apply `SERVER.*` actions —
`convexMiddleware` swallows them and calls a mutation, exactly as
`socketMiddleware` swallows them and emits today (`socketMiddleware.js:11-17`).
So a Convex round-trip per action is **not a regression**: the current app
already waits for the server echo. (Optimistic local reduction is possible
later as an enhancement — see §8.)

### 4.5 Round timer → Convex scheduler

`MidGameHandlers.js:50` keeps the round timer as a `setTimeout` on the socket
object. Replace with Convex's durable scheduler:

- `startRound` path: compute `secondsThisRound` (leftover + bonus, or the
  default — logic from `MidGameHandlers.js:34-58`), run the `ROUND_STARTED`
  reducer with `startTime: Date.now()`, then
  `ctx.scheduler.runAfter(secondsThisRound * 1000, internal.game.endRound,
  {code, roundId})`. Store the returned id in `roundTimeoutId`.
- `endRound` internal mutation: only ends the round if `state.roundStarted` is
  true **and** the incoming `roundId` still matches the row's `roundId` — this
  guards against a round that already ended early.
- Early end (bowl emptied on `CORRECT_WORD`, or explicit `END_ROUND`): run the
  `ROUND_ENDED` reducer, bump `roundId`, and `ctx.scheduler.cancel(roundTimeoutId)`.

`startTime` + `secondsThisRound` are stored **in the game state**, so any client
(including one that joins mid-round) renders the correct countdown locally.
Convex is the authority on when the round actually ends.

### 4.6 Presence → heartbeat

No socket means no `disconnect` event. The app already has a heartbeat concept
(`SocketHeartbeat.js`). Replace it with a `heartbeat` mutation the client calls
every ~10s, writing `lastSeen` into the game's `connections` map. "Connected" is
derived from `lastSeen` recency (e.g. within 30s) — computed in the `getGame`
query so all clients agree. Coarser than socket disconnect, fine for this game.

### 4.7 No SSR

`GET /:gameId` currently renders Handlebars with the game state embedded
(`Routes.js:68-86`, `game.hbs:4-8`). After migration the game page is a static
SPA: it reads the code from `window.location.pathname`, subscribes via Convex,
and renders a loading state until the first push. `getGame` returning `null`
means "game not found".

## 5. Component-by-component mapping

### Server (deleted entirely)

`js/server/` — `app.js`, `www`, `Routes.js`, `GameStore.js`, the whole
`js/server/socket/` tree, `guaranteeUser.js` — is removed. Express, socket.io,
hbs/handlebars, body-parser, cookie-parser, morgan, node-jsx, nodemon all leave
`package.json`.

Their logic moves to `convex/`:

| Old | New |
| --- | --- |
| `GameStore.create` (`GameStore.js:58`) | `createGame` mutation |
| `GameStore.get` / `.dispatch` (`:29`/`:83`) | `getGame` query / `dispatch` mutation |
| `SocketActionHandlers` routing (`:19-32`) | `action.type` → handler table inside `dispatch` |
| `PreGameHandlers` (SAVE_WORDS, JOIN_GAME, JOIN_TEAM, START_GAME) | ported into `dispatch`'s table |
| `MidGameHandlers` (CORRECT_WORD, SKIP_WORD, START_ROUND, END_ROUND, SKIP_PLAYER) | ported into `dispatch`'s table; START/END_ROUND also touch the scheduler |
| `OutOfSyncHelper` (`SERVER.OUT_OF_SYNC`) | deleted — subscription always carries full state |
| `SocketHeartbeat` / `SocketConnections` | `heartbeat` mutation + derived `connected` |
| `guaranteeUser` cookie | client-side `localStorage` userId |

The handlers translate `SERVER.*` intent into the server-enriched `CLIENT.*`
actions that the reducers actually key on — that translation must be ported
**faithfully** (it is where `Date.now()` timestamps enter). Port one handler at
a time, keeping the test suite green.

### Client (rewired, not rewritten)

| File | Change |
| --- | --- |
| `js/web/middleware/socketMiddleware.js` | → `convexMiddleware(client)`: on `SERVER.*`, call `client.mutation(api.game.dispatch, {code, userId, action})` instead of `socket.emit` |
| `js/web/socket/SocketHandlers.js` + sub-handlers | → one `client.onUpdate(api.game.getGame, {code}, game => store.dispatch(replaceGame(game)))` subscription |
| `js/web/Store.js` | swap `socketMiddleware(socket)` for `convexMiddleware(client)`; thunk + logging unchanged |
| `js/web/gamePage.js` | read `code` from URL; create `ConvexClient(CONVEX_URL)`; subscribe; render loading state until first push |
| `js/web/AppReducers.js` | unchanged — still runs shared `GameReducers`; in practice only `REPLACE_GAME` is exercised client-side |
| `js/web/GameApp.js` | add a loading/`game-not-found` guard; page-derivation logic unchanged |

The Convex **vanilla client** (`ConvexClient` from `convex/browser`) is
framework-agnostic — it needs no React hooks. The Convex integration lives
entirely in the Redux middleware plus one subscription, mirroring how
`socketMiddleware` + `SocketHandlers` work today. React/Redux are modernized
separately in Phase 0.5; the Convex migration itself imposes no React-version
requirement.

### HTTP pages → static files

`templates/index.hbs`, `new-game.hbs`, `how-to-play.hbs`, `join-game.hbs` are
mostly static content + a form; convert to plain static HTML served by Vercel.
`POST /new-game` becomes the `new-game` page calling the `createGame` mutation
client-side, then navigating to `/{code}`. A `vercel.json` rewrite maps
`/:code` → `game.html` (Vercel checks the filesystem first, so the named pages
still resolve). `/version` is dropped or replaced with a build-time constant.

## 6. Implementation phases

### Phase 0 — Tooling modernization (TypeScript, Vite, ESM, Node 20) ✅ done

**Goal:** a modern toolchain and TypeScript, with **zero behavior change** and
**no runtime-library upgrades**. React 0.14, Redux 3, and react-redux 4 keep
running exactly as today. Throughout this phase the app remains the Express +
socket.io app and stays deployable to Heroku.

**Conversion scope** — convert what has long-term value; don't gold-plate code
that is scheduled for deletion:

- `js/shared/` → **TypeScript + ESM**. Highest value: it is reused by Convex in
  Phase 1 and is covered by the test suite. Type the reducers, `GameHelpers`,
  `ActionTypes`, `defaultGame`.
- `js/web/` non-component glue (`Store`, `socketMiddleware`, the socket
  handlers, the `gamePage` entry, `AppReducers`, `UIReducers`, actions) →
  **TypeScript + ESM**.
- `js/web/` React components (`GameApp` + the page components) → **stay `.jsx`
  on React 0.14 for now**. They become `.tsx` in Phase 0.5 against good React 18
  types — writing TSX against stale `@types/react@0.14` is the pain we're
  deliberately skipping. Vite/TS happily mix `.jsx` with `.ts`.
- `js/server/` → **mechanical ESM conversion only, no TypeScript**. Phase 4
  deletes this tree; it only needs to keep running until then.

**Tasks (roughly in order):**

1. Bump `engines.node` to `>=20`; delete the stale `.travis.yml` (pins Node 5).
2. Replace **parcel-bundler 1.x** (unmaintained since ~2019, will not run on
   Node 20) with **Vite**. Configure esbuild's classic JSX runtime for React
   0.14 (`jsxFactory: 'React.createElement'`); remove `node-jsx`. Get a green
   client build on the *existing JavaScript* first, before introducing TS.
3. Adopt ESM repo-wide: `"type": "module"` in `package.json`; mechanical
   `require`/`module.exports` → `import`/`export` across `js/`.
4. Add TypeScript: a `tsconfig.json` with `strict: true` and `allowJs: true` so
   files convert incrementally. Convert `js/shared/` first (test-covered), then
   the `js/web/` glue. Leave `js/server/` as `checkJs: false` JavaScript.
5. **Immutable 3 → 4.** Small jump; gives proper TS types for the game-state
   map. Watch for the `Iterable` → `Collection` rename; the `.get()`/`.set()`
   API the reducers depend on is stable. The test suite catches regressions.
6. **Mocha → Vitest** (ESM/TS-native, pairs with Vite). Port `test/*` —
   `describe`/`it` carry over; assertions can stay on `node:assert` or move to
   Vitest's `expect`.
7. Run the server in dev/prod via `tsx` (transparently handles the TypeScript
   `js/shared/` imports); update the `dev`/`build`/`start`/`test` scripts.
   Vite's dev server also removes the current manual-rebuild pain.
8. Add **ESLint (flat config) + `typescript-eslint` + Prettier** (or Biome as a
   lighter single-tool alternative).
9. *Optional:* a GitHub Actions workflow (typecheck + lint + test + build) to
   replace `.travis.yml`.

**Exit criteria:** typecheck, lint, Vitest, and the Vite build all green on Node
20; the app behaves identically (Express + socket.io + React 0.14) and is still
deployable to Heroku.

### Phase 0.5 — React & Redux upgrade ✅ done

**Goal:** bring the UI runtime current. Independent of Convex; the app stays the
Express + socket.io app and remains deployable to Heroku at the end of the phase.

**Tasks:**

1. **React 0.14 → 18:** `ReactDOM.render` → `createRoot().render`;
   `React.createClass`/mixins → function or class components (use the
   `create-react-class` shim only as a stopgap); deprecated lifecycles
   (`componentWillReceiveProps`, …) → modern equivalents; `React.PropTypes` →
   dropped in favour of TypeScript prop types.
2. **Redux 3 → Redux 5 / Redux Toolkit:** swap `createStore` + `applyMiddleware`
   for `configureStore`. **Keep the shared reducers as plain Immutable-based
   reducer functions** — do *not* rewrite them as RTK `createSlice`/Immer
   slices; they must stay Immutable because Convex runs the same code in Phase 1.
   The custom `loggingMiddleware`/`socketMiddleware` carry over unchanged;
   `redux-thunk` now ships inside RTK.
3. **react-redux 4 → 9:** `connect`/`<Provider>` are broadly compatible;
   react-redux 9 requires React 18. Migrating `connect` → `useSelector`/
   `useDispatch` is optional polish, not required.
4. Convert the React components to **`.tsx`** with `@types/react@18`; type their
   props and state.

**Exit criteria:** React 18 + modern Redux; all components `.tsx`; tests green;
the app behaves identically and is still deployable to Heroku.

> Phase 0 and Phase 0.5 each leave the app fully functional and
> Heroku-deployable, so they can ship as independent checkpoints before any
> Convex work begins — de-risking the migration.

### Phase 1 — Stand up Convex ✅ done
- Add the Convex Marketplace integration to the Vercel project; run
  `npx convex dev` locally.
- Add the `games` table schema (§4.1). Store `state` as `v.any()`.
- Port `GameStore` → `createGame`, `getGame`, and a minimal `dispatch` mutation
  that runs `GameReducers`.
- **Verify early:** Immutable.js 3 runs in the Convex runtime, and the
  CommonJS `js/shared/` modules import cleanly under Convex's esbuild bundler.

### Phase 2 — Port the game handlers into Convex ✅ done
- Move `PreGameHandlers` / `MidGameHandlers` logic into `dispatch`'s
  `action.type` → handler table.
- Port the round timer to `ctx.scheduler` + `internal.game.endRound` with the
  `roundId` guard (§4.5).
- Add the `heartbeat` mutation and derived `connected` status.

### Phase 3 — Rewire the client ✅ done
- `socketMiddleware` → `convexMiddleware`; `SocketHandlers` → the `onUpdate`
  subscription; `userId` via `localStorage`; `code` from the URL.
- Remove `socket.io-client`; add `convex`.

### Phase 4 — Replace the HTTP/template layer ✅ done
- Convert the four content templates to static HTML; wire the new-game form to
  `createGame`.
- Delete `js/server/`, Express, hbs/handlebars, `www`, `Routes.js`.

### Phase 5 — Deploy configuration ✅ done
- `vercel.json`: output directory + the `/:code` → `game.html` rewrite.
- Build command: `npx convex deploy --cmd 'npm run build'` (deploys Convex
  functions, then builds the frontend with the injected `CONVEX_URL`).
- Prune `package.json` dependencies and scripts; confirm Node 20.

### Phase 6 — Cutover
- Deploy to Vercel; smoke-test a full multi-device game (join → add words →
  teams → rounds → game over), including a round that ends on the timer and one
  that ends early.
- Move the domain/DNS from Heroku to Vercel.
- Decommission the Heroku dyno.

## 7. Risks & mitigations

| # | Risk | Mitigation |
| --- | --- | --- |
| 1 | Vite + classic JSX for React 0.14; ESM conversion of `js/server/` | Get the Vite build green on the existing JS before adding TS; the `js/server/` ESM conversion is mechanical and short-lived (deleted in Phase 4) |
| 2 | Immutable.js 3 / CommonJS shared modules inside Convex's runtime | Verify with a trivial mutation early in Phase 1; convert `js/shared/` to ESM if needed |
| 3 | `SERVER.*` → `CLIENT.*` enrichment must be ported exactly (timestamps) | Port handler-by-handler; the Mocha suite over `js/shared/` stays valid throughout and is the safety net |
| 4 | Scheduled `endRound` racing with an early end | `roundId` guard token on the game row |
| 5 | Per-action Convex round-trip latency | Not a regression — today's app already waits for the socket echo (§4.4) |
| 6 | Presence less precise than socket disconnect | Acceptable for a party game; heartbeat recency is good enough |
| 7 | In-flight games lost at cutover | The in-memory store already loses games on every restart; cut over when no game is active |
| 8 | Immutable 3 → 4 subtle behavior changes | The Vitest suite over `js/shared/` is the regression net; `Iterable`→`Collection` is the main rename to watch |
| 9 | React 0.14 → 18 component conversion (createClass/mixins/lifecycles) | Small component count (~8); Phase 0.5 is independently shippable to Heroku; game-logic tests are unaffected since the reducers are untouched |

## 8. Out of scope (possible later)

- **Optimistic updates.** The client could reduce `SERVER.*` actions locally
  for snappier UI and let the Convex push reconcile — restoring the full
  "same reducers, both sides" experience. Not needed for parity.
- **Convex function tests** with `convex-test` to replace the deleted server.

## 9. Open questions for Simon

*Resolved:* bundler → **Vite**; React/Redux → **upgraded in Phase 0.5** (not
deferred indefinitely).

*Resolved:* game codes → **short random codes** (4 chars, no 0/O/1/I/L).
