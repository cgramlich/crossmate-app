# CLAUDE.md - Crossmate App (frontend)

Auto-read by Claude Code at session start. Keep it current.

**Doc currency (starter spec section 5):** keep this file + the arch docs in step with the
code in the SAME session; don't hardcode the version (it lives in `APP_VERSION`/`BUILD` in
index.html); log dated changes in `CG Apps\Crossmate\Crossmate Log`.

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
- **Solve (GameView):** opens a game (`/api/game/{code}`) - shows join code, roster, invite,
  and the shared per-cell state. THE GRID ITSELF IS STEP 2 (placeholder preview for now).
- **Build:** placeholder for the builder (Step 2/3).
- **Friends:** LIVE connections (add/accept/decline/remove) + requires a username.
- **Settings (You):** profile (username/display), sign out, diagnostics log, version.

## Shared plumbing (mirrors the clean base)
- Supabase Auth (anon key, auth only). `authToken()` attaches the Bearer on every backend call.
- `api()` generic fetch helper; `Api.*` domain calls; `collGet/collPut` for library/meta.
- Update check: fetch own HTML, compare `BUILD`, offer reload banner (resume + 5-min interval).

## Owner working prefs
Windows 11, ASCII-only in code/logs, explicit over clever, production-ready. Icons/branding
art + manifest deferred (parity build; art at the native step).

## Related
- Kickoff `CG Apps\Crossmate\START-HERE-crossmate.md`; Step 1 plan + sourcing research in
  `Crossmate Architecture & Design`. Backend: `C:\Users\cjgra\crossmate-backend`.
- Template source: `C:\Users\cjgra\tracker-app\index.html` (clean shell) +
  `C:\Users\cjgra\dining-log-app` (MenuCaptain social UI reference).
