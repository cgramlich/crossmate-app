# CLAUDE.md - Crossmate App (frontend)

Auto-read by Claude Code at session start. Keep it current.

**Doc currency (starter spec section 5):** keep this file + the arch docs in step with the
code in the SAME session; update the arch doc body when the architecture changes; don't
hardcode the version (it lives in `APP_VERSION`/`BUILD` in index.html); write a DATED entry
in `C:\Users\cjgra\Dropbox\My AI\CG Apps\Crossmate\Crossmate Log\` for EVERY work session.
Rule: `CG Apps\Forever Apps\forever-apps-starter-spec.md` section 5.

## What this is
Crossmate frontend: a single-file PWA (`index.html`, React 18 + Babel via CDN, no build step)
for a co-op crossword app. Fresh clean shell in the MenuCaptain/Tracker style, reskinned to
Crossmate, wired to `crossmate-backend`. Offline = localStorage cache + fetch-based update
check (NO service worker, matching the clean base). Parity build, NOT a store target.

## Coordinates
- Repo: `cgramlich/crossmate-app` (public). LIVE at https://cgramlich.github.io/crossmate-app/
  (GitHub Pages, master/root). Configured + live 2026-07-13.
- Backend: `crossmate-backend` -> https://web-production-8202f.up.railway.app (Railway).
  Supabase project `cosxmhvsnghrbfrtysvg`. `API_BASE` in index.html points here.
- Version: `APP_VERSION` (friendly) + `BUILD` ("YYYY-MM-DD.N", what the updater compares).
  Bump BOTH on every deploy (BUILD must be strictly newer or the update prompt won't fire).

## CONFIG (top of the <script> in index.html) - set at cloud stand-up
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (public-safe anon key), `API_BASE` (Railway backend).
- `CONFIGURED` auto-detects the placeholders; until set, the app boots to the auth screen
  with a "Setup pending" banner and sign-in disabled.

## Structure (screens)
- **Auth:** email + password (Supabase `signInWithPassword`/`signUp`/`resetPasswordForEmail`).
- **Home:** your games (`/api/game/mine`) + puzzle library (`/api/puzzles`); tap a puzzle to
  start a game.
- **Solve:** `SoloSolve` (local-only, localStorage) and `CoopSolve` (the shared grid) both
  render the same `Solver`. Co-op opens a game (`/api/game/{code}`), shows join code, roster
  and invite in the info sheet, and POSTs every keystroke to `/api/game/{code}/fill`; a 5s
  poll pulls teammates' letters back and tints their cells. Local writes are held in
  `pending` so a poll can never revert what you just typed, and a fill that FAILS moves to
  `outbox` and is retried (bounded backoff + a drain on the next successful poll). If the
  backoff is spent the grid says so in a banner rather than diverging silently - never drop
  a letter, never let one user's grid quietly disagree with everyone else's.
- **Build:** placeholder for the builder (Step 2/3).
- **Friends:** LIVE connections (add/accept/decline/remove) + requires a username.
- **Settings (You):** profile (username/display), sign out, diagnostics log, version.

## Shared plumbing (mirrors the clean base)
- Supabase Auth (anon key, auth only). `authToken()` attaches the Bearer on every backend call.
- `api()` generic fetch helper; `Api.*` domain calls; `collGet/collPut` for library/meta.
- Update check: fetch own HTML, compare `BUILD`, offer reload banner (resume + 5-min interval).
- CDN scripts are ALL pinned to an exact version with `integrity` + `crossorigin` (React,
  ReactDOM, Babel, supabase-js). When bumping one, re-hash from the live bytes and pin the
  PACKAGED file - for jsDelivr that means an explicit `dist/...` path, never the bare
  `@ver` path, which it answers with a file it minifies on the fly (SRI must not be used
  on generated files). No service worker here, so there is no cache list to keep in step.

## Owner working prefs
Windows 11, ASCII-only in code/logs, explicit over clever, production-ready. Icons/branding
art + manifest deferred (parity build; art at the native step).

## Related
- Kickoff `CG Apps\Crossmate\START-HERE-crossmate.md`; Step 1 plan + sourcing research in
  `Crossmate Architecture & Design`. Backend: `C:\Users\cjgra\crossmate-backend`.
- Template source: `C:\Users\cjgra\tracker-app\index.html` (clean shell) +
  `C:\Users\cjgra\dining-log-app` (MenuCaptain social UI reference).
