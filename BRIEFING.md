# Crossmate — BRIEFING

Deck-ready source material. Hand this to a design tool with only a design type and an
audience and it should produce something accurate without asking follow-up questions.

**Written to leave the machine.** No secrets, no keys, no internal URLs, no personal data.
Everything below is cleared for external use. See the "Do not say" list at the end.

**Last updated: 2026-08-28.**

---

## The arc

**Situation.** Solving a crossword is a solitary ritual, but the good part is rarely
solitary. Two people at a kitchen table pass the paper back and forth, and the pleasure is
as much in "oh, *you* got that one" as in finishing. Every major crossword app models the
solitary half beautifully and the shared half barely at all: you get a leaderboard, or a
streak, or nothing.

**Problem.** Building the shared half runs into a wall that has nothing to do with
engineering. A co-op crossword app needs *crosswords*, and the good ones are not available.
The New York Times has no licensable interface for a small third party and discontinued the
export format third-party solvers depended on in August 2021. Newspaper syndicates license
only through business-to-business contracts. And the indie crossword scene — the obvious
fallback, full of genuinely excellent constructors — runs on "free to solve," which is not
the same thing as free to redistribute. A research pass across six source categories, with
every licence checked against a primary source, found **no bulk library of modern
crosswords usable with attribution alone**.

That reframes the project. The interesting constraint is not "how do we sync a grid." It is
"where do the puzzles come from, legally, forever."

**What was done.** Crossmate was built as a private, invite-only co-op crossword app for one
family, on a template already proven across a portfolio of sibling apps. Three weeks took it
from an empty repository to a deployed product where two people can solve the same grid and
watch each other's letters land. Critically, the content strategy was decided *first* and
then enforced in code: the app physically cannot store a puzzle that lacks a licence
declaration and an author credit.

The single design decision that made the co-op half cheap was made before any of it was
built: store the shared answer grid as **one database row per cell**, not as a single blob.
That choice looked like over-engineering on day one. It is why the shared version, when it
arrived, required no rewrite of the solving grid at all — and why a future live-cursor
version will replace one polling loop and nothing else.

**What it means now.** The app works: solo solving and shared solving both ship. The
remaining build is the piece the licensing research pointed to all along — a **puzzle
builder**, so the family constructs puzzles for each other. That turns the hardest
constraint into the most charming feature: the safest possible content is the content you
made for the people you are playing with.

---

## Concrete figures

| Figure | Value | Date / source |
|---|---|---|
| Empty repo to deployed co-op app | ~3 weeks | 2026-07-12 to 2026-08-01, project logs |
| Backend, front end, cloud stood up | 2 days | backend 2026-07-12, front end and live deploy 2026-07-13 |
| Solo solving grid shipped | 2026-07-14 | project logs |
| Shared co-op solving shipped | 2026-07-26 | project logs |
| Front end size | one HTML file, ~1,100 lines of application code, **no build step** | source, 2026-08-28 |
| Database tables | 11, all with row-level security enabled | schema, 2026-07-14 |
| Shared-grid sync interval | 5 seconds (poll), with optimistic local writes | source, 2026-07-26 |
| Failed-sync retry schedule | 4 bounded attempts: 1.5s, 4s, 10s, 20s, then quiet retry on each successful poll | 2026-08-01 |
| Research breadth | 6 parallel source-category investigations, licences verified against primary sources | 2026-07-08 |
| Cost of the rejected option | ~$75–250 per commissioned 15×15 puzzle, ~$750–2,000 for ten | 2026-07-08 research |
| Date NYT dropped third-party export | 2021-08-10 | primary source, 2026-07-08 research |
| Candidate autofill wordlist | ~303,000 entries, scored 0–60, licence **CC BY-NC-SA** | Spread the Wordlist, verified 2026-07-13 |
| Cold-start latency before mitigation | ~40s first request after idle, ~1s once warm | measured 2026-07-14 |
| Puzzles in the library today | 3 (all originals, licence "owned") | 2026-08-28 |

*Note: the three demo puzzles are 5×5 minis generated in-house specifically so that no
third-party content was ever required to demonstrate the app.*

---

## Quotable claims (each true and standalone)

- "The hard problem in a co-op crossword app is not synchronisation. It is that you cannot
  legally get the crosswords."
- "Free to solve is not free to redistribute. The entire indie crossword world runs on that
  distinction, and most people building on it never notice."
- "Attribution does not cure infringement, and small, private and free is not fair use."
- "We stored the shared grid as one row per cell instead of one blob. That looked like
  over-engineering for a month, and then it meant the shared version cost no rewrite."
- "The app cannot save a puzzle that does not declare its licence and its author. The rule
  is enforced by the code, not by anyone remembering it."
- "The safest content we can possibly ship is the puzzle you made for the person you are
  playing with."
- "Technical access is not a licence."
- "Three weeks from empty repository to two people solving the same grid on two phones."

---

## What deserves a picture

- **The licensing landscape as a decision tree.** Six candidate sources, each ending in
  "blocked", "permission required", or "ours". It is a genuinely surprising diagram and it
  carries the whole strategy argument in one frame.
- **One row per cell versus one blob.** A before/after architecture sketch showing why the
  shared version needed no grid rewrite, and why live cursors will swap a single component.
- **The shared grid itself.** A 5×5 mini with two players' letters distinguished by colour —
  the product in one image, and the emotional pitch at the same time.
- **Timeline strip.** Backend, front end, live deployment, solo solving, co-op solving —
  five dated milestones across roughly three weeks.
- **The cost comparison.** ~$750–2,000 to commission ten puzzles, against $0 for a builder
  the family uses forever. A two-bar chart makes the argument by itself.
- **Portfolio context.** Crossmate as one app in a family of sibling apps sharing a single
  proven template — useful whenever the audience cares about leverage rather than this app.

---

## Angles by audience

**Portfolio / investor angle.** Crossmate is evidence that the shared template compounds:
one app's worth of new work (a crossword grid and a licensing strategy) sitting on top of
authentication, sync, offline handling and a social graph that already existed and were
already hardened. The genuinely novel work was concentrated where it created value. It also
demonstrates a repeatable discipline — decide the legal constraint first, then encode it so
it cannot quietly erode.

**Product / user angle.** It is a togetherness app that happens to use crosswords. The
design goal was never "solve faster"; it was to make someone else's presence visible on the
page. Teammates' letters arrive in their own colour. The next feature turns the family from
solvers into constructors.

**Engineering angle.** A single-file front end with no build step, a single-file API, and
one data-model decision made early for a feature that did not exist yet. Optimistic local
writes with a bounded retry queue mean a letter typed on a flaky connection is never
silently lost from a *shared* document — the failure mode that would quietly corrupt trust
in a co-op app. Security posture is fail-safe by default: row-level security on every table
with no policies at all, so the publicly-shipped key can read nothing.

**Design angle.** The solving grid follows crossword convention rather than inventing one —
the active word in pale gold, the active cell in solid gold — because a puzzle app that
feels unfamiliar in the first three seconds has already lost. Everything else in the app is
deliberately quiet so the grid is the only loud thing on screen.

---

## Do not say

- **Do not claim the two-person co-op test has been completed.** As of 2026-08-28 co-op is
  verified by automated harness and code review only. No demo should imply two real users
  have solved together on the live deployment.
- **Do not describe the puzzles as NYT-quality or professionally constructed.** They are
  three in-house 5×5 minis made to demonstrate the app.
- **Do not present the builder as shipped.** It is designed and next, not built.
- **Do not describe the candidate wordlist as unrestricted.** It is CC BY-NC-SA:
  attribution, share-alike, and **non-commercial**, which is compatible only while the app
  is free. If the app is ever sold, that dependency has to change.
- **Do not imply the app is for sale, in an app store, or publicly available.** It is a
  private, invite-only family build and deliberately not a store product.
- **Do not name or imply any relationship with the New York Times, any newspaper syndicate,
  or any named indie constructor.** The strategy is precisely that we do not use their work.
- **Do not include URLs, project identifiers, keys, or infrastructure detail.** None are
  needed for a deck and they are excluded on purpose.
- **Do not include any family member's name or any real account detail.**
