# Crossmate — HANDOFF

Zero-context resumption document. Read this and you can make the next change
without asking anyone and **without undoing something chosen on purpose.**

Authoritative for the whole project (both repos). `crossmate-backend/HANDOFF.md`
covers backend-only specifics and defers here for shared decisions.

**Last updated: 2026-09-05.**

---

## What this is

A **co-op crossword app**: two or more people solve the *same* puzzle together and see
each other's letters appear. Built for Chris's family and friends, invite-only. It is a
Forever Apps portfolio app and a **parity build — it is NOT going to the app stores**
(portfolio policy: only MenuCaptain does). It is free and not sold, which is load-bearing
for the content licensing below.

The point of the app is togetherness, not puzzle mechanics. "Oh, you got that one" is the
feature.

---

## Current state (2026-08-28)

| | Version | Where |
|---|---|---|
| Front end | `APP_VERSION` 0.5.2, `BUILD` 2026-08-01.1 | https://cgramlich.github.io/crossmate-app/ |
| Backend | 0.2.3 | Railway (host is `API_BASE` in `index.html`) |

Both repos clean and in sync with `origin/master`. Backend health green, `db: connected`.
Last functional change 2026-08-01; the month since has been portfolio-standard sweeps.

**Do not copy these version numbers anywhere.** Read `APP_VERSION`/`BUILD` in
`index.html` and the backend `/health` payload — a pasted version is stale on paste.

**What works today:** sign-in, solo solving (full grid, on-screen and physical keyboard,
clue navigation, check / reveal, solved detection), co-op solving (shared grid, per-cell
sync, teammate colours, join codes, invites), friends/connections, profiles,
swipe-to-delete, PWA update banner.

**What does not exist yet:** the **builder** — the whole content engine. `Build` is a
placeholder screen. There are exactly **3 demo puzzles**.

---

## The map

**`C:\Users\cjgra\crossmate-app`** (GitHub `cgramlich/crossmate-app`, **PUBLIC**, GitHub
Pages from `master` root). A push to `master` is a deploy.

- `index.html` — the entire front end. One `<script type="text/babel">` block, React 18 +
  Babel via CDN, **no build step**. Components in order: `parsePuzzle` → `Solver` →
  `SoloSolve` → `SwipeRow` → `Home` → `CoopSolve` → `Build` → `Friends` → `Settings` →
  `App`.
- `CLAUDE.md` — working rules for this repo.
- No service worker **by design** (see Decisions). No icons yet.

**`C:\Users\cjgra\crossmate-backend`** (GitHub `cgramlich/crossmate-backend`, **PRIVATE**,
Railway auto-deploys `master`).

- `main.py` — the whole API. `sql/schema.sql` — run once in the Supabase SQL editor.

**Docs:** `Dropbox\My AI\CG Apps\Crossmate\` — `Crossmate Log\` (a dated entry per
session; this is the changelog), `Crossmate Architecture & Design\` (sourcing research,
step-1 plan), `START-HERE-crossmate.md` (original kickoff).

---

## How to run, build, deploy

No build step. Preview locally over http (**not** `file://` — SRI and auth behave
differently on a file URL):

```
cd C:\Users\cjgra\crossmate-app && python -m http.server 8080
```

Compile gate before every front-end push. A JSX typo does not fail loudly in production,
it white-screens the live app, so run this every time:

```
node -e "const fs=require('fs');const s=fs.readFileSync('index.html','utf8');const m=s.match(/<script type=.text\/babel.[^>]*>([\s\S]*?)<\/script>/);const b=require('C:/Users/cjgra/tracker-app/node_modules/@babel/standalone');b.transform(m[1],{presets:['react']});console.log('[OK] JSX compiles')"
```

Deploy the front end — bump **both** `APP_VERSION` and `BUILD` in `index.html` first:

```
cd C:\Users\cjgra\crossmate-app && git add -A && git commit -m "..." && git push origin master
```

Deploy the backend (Railway auto-deploys on push):

```
cd C:\Users\cjgra\crossmate-backend && python -m py_compile main.py && git push origin master
```

Verify the backend (host is the `API_BASE` value in `index.html`):

```
curl https://REPLACE-WITH-API_BASE-HOST/health
```

---

## Decisions, dated, with the road not taken

### Content: build our own puzzles; never use syndicated ones (2026-07-07, reaffirmed 2026-07-08)

**The most reversible-looking decision in this project. Do not casually undo it.**

A research pass (six parallel investigators, licences checked against primary sources)
established that **there is no bulk library of good modern crosswords usable with only
attribution.** In the indie crossword world "free to solve" and "free to download" are
near-universal and are **not** redistribution licences. So the content engine is **our own
builder**, with per-constructor written permission and CC0/public-domain as top-ups.

What follows is **our reading of publicly available terms as they stood on 2026-07-08**,
recorded so the decision can be re-examined rather than re-litigated. It is not legal
advice, and terms change — re-check before relying on any line of it.

Considered and set aside:

- **NYT** — we found no licensable interface for a small third party, and `.puz` export was
  discontinued on 2021-08-10, which broke third-party access. Scraping would sit against
  both their terms and copyright.
- **Syndication** (Universal/Andrews McMeel, Tribune/TCA, King Features, Newsday, WSJ) — as
  far as we could establish, these license business-to-business by contract, and we found no
  free, attribution-based or non-commercial tier. Out of proportion to a free family app in
  any case.
- **Commissioning a constructor** — genuinely clean (work-for-hire, we own the rights, and
  the quality is there) at roughly **$75–250 per 15×15**, so about $750–2,000 for ten.
  **Rejected on cost, 2026-07-14.** Do not re-propose it as though it is new.
- **Crosshare** — its **code** is AGPL-3.0, but the **puzzles remain each constructor's
  copyright**, and at the time of research the platform offered constructors no CC/CC0
  option. So there is no blanket licence to reuse what is hosted there. **Technical access
  is not a licence.** Use Crosshare to *find constructors to ask*, which is what it is good
  for.
- **`xword-dl` / Crossword Scraper output** — the tools are open, but the puzzles they
  retrieve are publisher-copyrighted. Fine for solving privately; re-serving them inside a
  shared app is redistribution.
- **Tournament and charity packs** (Indie 500, Boswords, fundraiser packs) — access buys
  solving rights; redistributing would also undercut the fundraiser those packs exist to
  support.
- **The `xd` corpus** — tooling is MIT, but the **puzzle data carries no explicit licence**
  and its own README describes it as research-only. The pre-1965 NYT grids are public domain
  by age yet read as dated (Maleska-era), and old puzzles were ruled out on taste
  (2026-07-14). Do **not** build builder autofill from the modern `xd-clues` set.
- **The Guardian's free API** — real and genuinely open, but it carries no crosswords
  (articles only).

Governing rule: **attribution does not cure infringement, and "small / private / free" is
not fair use** for copying a whole puzzle. Private use lowers practical risk; it is not a
licence.

### Cleanliness is enforced in the API, not remembered (2026-07-12)

`POST /api/puzzles` **refuses** any puzzle without a valid `license`
(`owned` | `cc0` | `public-domain` | `permission-granted` | `commissioned`) and a
`constructor` byline; `permission-granted` additionally requires a `permission_record`
pointing at the written yes. The alternative — "just remember to check" — is how a scraped
puzzle eventually lands in the library.

### Licences of the tools chosen (state the licence before adding any dependency)

- **`.ipuz`** is the internal format: open JSON spec published under **CC BY-ND 3.0**,
  trivial to parse, and it maps straight onto the JSONB `puzzles.data` column. **`.puz`**
  (Across Lite) is **import-only** — binary and reverse-engineered with no official spec,
  but it is the format most real-world puzzles arrive in.
- **Spread the Wordlist** (spreadthewordlist.com) — the intended builder autofill list,
  roughly 303K entries scored 0–60. **Licence: CC BY-NC-SA** — non-commercial, attribution,
  share-alike. It is acceptable **because Crossmate is free and not sold**; **if the app
  ever monetises, this wordlist must be swapped out.** Non-NC alternatives for that day:
  **Peter Broda's list** (~427K, released free for community use) or
  **`gregpoulos/crossword-owl`** (explicitly open).
- **Exet** (`viresh-ratnakar/exet`, **MIT**) — a browser crossword constructor; reuse its
  autofill approach rather than writing a solver from scratch.
- **Exolve** (**MIT**) and **Crossword Nexus's solver** (**BSD-3**) are the acceptable open
  solver/renderers.
- **Crosshare's code is AGPL-3.0 — do not reuse it.** This also matches the standing
  portfolio hard rule: no AGPL in a Forever App.

### The shared fill is one row per cell (2026-07-07, paid off 2026-07-26)

`cells` is `(code, r, c, letter, by_user, updated_at)` — **not** a JSONB blob. Chosen so
the async version can poll those rows now and **Supabase Realtime can subscribe to the
same rows later with no data migration.** Last-write-wins per cell, which is right for a
friendly family co-op. When co-op shipped, only the fill *source* changed and the grid was
untouched. Do not "simplify" this into a blob.

### The Solver is fill-source-agnostic (2026-07-14)

`Solver` takes a `fill` map plus an `onFill` callback and does not know where letters live.
Solo passes local state; co-op passes shared cells and a backend `onFill`. That is why
co-op cost no grid rewrite, and why Realtime later swaps only the polling. Keep it so.

### No service worker (2026-07-13)

Deliberate, inherited from the clean template. Offline is a localStorage cache; updates are
a fetch-and-compare of `BUILD` against the deployed file. Adding a SW would drag in the
whole portfolio SW/versioning ritual for little gain on a family app.

### Supabase email confirmation is OFF (2026-07-13)

Sign-up is instant with no email. Chosen because Supabase's built-in mail is rate-limited
to a few per hour (we hit that limit during setup) and the default Site URL bounced
confirmation links to `localhost:3000`. **Consequence:** password reset is **not
completable in-app** — there is no set-new-password screen. Build one before anyone outside
the family uses this.

### Assembled from the clean template rather than by gutting MenuCaptain (2026-07-08)

Chris's steer: MenuCaptain is the source of truth for every shared pattern. But instead of
forking its ~22k-line restaurant UI and deleting most of it, Crossmate was assembled on the
pre-distilled clean core and MenuCaptain's social modules were **ported in** (profiles,
connections, group-order recast as the co-op game, invite-by-code). Same code lineage, much
lower risk. Deliberately **not** ported: Stripe, Google Places, dish photos, menu OCR,
community menus, email.

---

## Traps (each with the incident behind it)

- **Railway sleeps.** An idle backend returns HTTP 000 after ~40s on the first request,
  then wakes in about a second. This presented as "the app stays loading" **and** as "Check
  and Reveal don't work" — the buttons were fine, there was simply no loaded puzzle under
  them (2026-07-14). Mitigations: `warmBackend()` pings `/health` on app open, `api()` has
  a 15s timeout with three retries, and a keep-warm GitHub Action hits `/health` every
  ~10 minutes. The real fix is a non-sleeping Railway tier. **Diagnose any "unresponsive
  UI" report by checking `/health` latency first.**
- **`store` is a fresh object on every render.** Putting it in a `useEffect` dependency
  array re-runs that effect forever. This shipped once as "stuck syncing" plus a backend
  polling loop. Home now loads once on mount; the comment there says so.
- **Never SRI-pin a jsDelivr bare `@2` URL.** jsDelivr *generates* that minified file on the
  fly and its own header warns against using SRI with it. Pin the packaged static file
  (`dist/umd/supabase.js`) instead. Pinning the generated bytes would have been a time bomb
  (2026-08-01).
- **Driving the Solver from a script needs async waits between actions.** Synchronous clicks
  give false negatives because React has not re-rendered — this made Check and Reveal look
  broken when they were not (2026-07-14).
- **A demo puzzle must never be a word square.** The first one had every Across equal to its
  Down (HEART/HEART…) and read as a bug. Any generator must assert **all ten answers
  distinct**.
- **Bump `APP_VERSION` and `BUILD` together.** A stale `BUILD` silently kills the update
  banner, and the lockstep check cannot catch it (portfolio-wide finding).

---

## What is open

**The approved order of work (decided 2026-08-30) — do these in sequence**

1. ~~**Set `ANTHROPIC_API_KEY` on Railway.**~~ **DONE 2026-09-05** — verified by `/health`
   reporting `ai: configured`. The gate below is cleared.
2. **Run the two-person co-op test.** Five minutes. ← next
3. **Then start the builder.**

> **GATE (now cleared, 2026-09-05): the builder needs `ANTHROPIC_API_KEY` set on Railway.**
> The grid editor and autofill need nothing new, but **clue-assist cannot be finished
> without that key**, so starting before it was set would have meant stalling roughly
> two-thirds in, holding half-finished work. If `/health` ever reports `ai: not_configured`
> again, the key has been lost and clue-assist is inert — check that before debugging the
> feature. Note it is read at **startup**, so a newly added key needs the redeploy to finish
> before `/health` reflects it.

> **Why test before building, even though the two are independent:** it is not a code
> dependency — different paths, neither can invalidate the other. It is that **a bug is far
> easier to chase when the thing under test is the last thing that changed.** Once builder
> work lands, that clean attribution is gone.

**Blocked on the owner**

- **The two-person co-op test has never been run.** Co-op is verified by harness and code
  review, **not** by two real accounts on the live deploy. A path needing no second person:
  the phone signed in as the owner, plus a laptop **incognito** window with a throwaway
  account, join by code, then type on both.
- `DEBUG_KEY` is unset, so `/api/admin/debug` is disabled. (`ANTHROPIC_API_KEY` was set
  2026-09-05; the AI relay is live.)

**Known gaps**

- **The puzzle generator `fill2.js` is LOST.** It lived in a session scratchpad that has
  since been cleared, and it produced the three demo minis. The algorithm: a 5×5 with black
  corners, filled row by row from a scored word list, pruning columns with prefix sets built
  from that same list, rejecting any solution whose ten answers are not all distinct. A
  seeded shuffle of the word list yields different grids per seed. Excluding a
  high-connectivity hub word (ARGUE, in practice) made the search explode — keep the full
  list and vary the seed instead.

  **Caveat, and it matters: the algorithm is recorded but the word list is not, and the word
  list was the actual labour** — roughly 700 five-letter and 400 three-letter common words,
  assembled by hand and inlined in the script. Anyone "just rebuilding from the algorithm"
  will hit that wall immediately. Largely moot going forward, because the builder uses a
  real scored wordlist (see Spread the Wordlist above), but it is the reason a rebuild is
  not the fifteen-minute job it looks like.

  **Decision, 2026-08-30: do not rebuild it.** It was a spike, not a component — fixed grid
  shape, batch solve, tiny inline list — whereas the builder needs arbitrary grids,
  incremental ranked suggestions, and the full wordlist. Rebuilding now means writing code
  the builder will throw away. Revisit only if more demo puzzles are needed before the
  builder ships.
- No password-reset screen (see the email-confirmation decision).
- Only three demo puzzles (`pz_demo_mini_1/2/3`, all `license: owned`, byline "Crossmate").
- No app icons or manifest, so the home-screen icon is a generic placeholder.
- Babel-in-browser (~2 MB) is a real mobile cold-load cost. Only a build step fixes it, and
  that is deferred to any future native work.

**Parked / next**

- **The builder** — the actual content engine and the next big build: grid editor (black
  squares, symmetry, auto-numbering), scored autofill from Spread the Wordlist, one-tap AI
  clue suggestions through the relay, save as ipuz into the library.
- **Supabase Realtime** to replace the 5-second poll (live cursors, instant fill) — a drop-in
  on the same `cells` rows.

---

## Where authority lives

- **Live versions:** `APP_VERSION`/`BUILD` in `index.html`, and the backend `/health`
  payload. Never a document.
- **Config** (Supabase URL, anon key, `API_BASE`): the top of `index.html`. All three are
  public-safe by design; real secrets exist only as Railway environment variables.
- **Schema:** `crossmate-backend/sql/schema.sql`.
- **Content licensing:** the Decisions section above, backed by
  `Crossmate Architecture & Design\crossword-sourcing-research.md`.
- **History:** `Crossmate Log\` and git. This file states what is **true now**, not what
  happened.

Note: this repo is **public**. Nothing sensitive belongs in this file; the anon key and API
base already ship in `index.html` by design.
