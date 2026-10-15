# Code review: `website-redesign`

## Scope check first

This branch is two things welded together. The `src/app/redesign/` directory is a hand-built cinematic scroll site (Hero, SelectedWorkGallery, StudyGame, TeamSection, ClosingSequence, ~1,700 lines of TSX plus ~900 of CSS modules). The rest of the diff is unrelated platform work: auth, chat persistence, Prisma, admin. I'll spend most of my attention on the first because that's what you asked about.

Worth knowing up front: **281 MB of tracked files.** `docs/redesign-review/` alone contributes a 14.4 MB mp4, a 10.9 MB mp4, a 6.4 MB mp4, and 30+ PNGs. `.pi/` and `docs/redesign-review/` are not gitignored. That's not a code problem, it's a clone-time problem, and it happens on every CI run.

---

## The GSAP/Lenis question

You asked whether this should have used GSAP and Lenis. My answer is that the author already thought about it, decided no, and was mostly right. The reasoning is written down in `docs/features/SelectedWorkGallery.md`, under "Ownership decision":

> This needs a small extension of Hero's existing paint/measure loop, not another scroll engine. A separate gallery sticky track would simplify catalog isolation but would force duplicate quiz visuals or a cross-track handoff. Reject it.

That's a correct call, and here's why it holds up:

**Lenis would have actively fought this design.** Lenis replaces native scroll with a virtual engine. This page has roughly a dozen `window.scrollTo({behavior: 'instant'})` calls and a delicate reconciliation protocol built around `alignmentDestination` (`Hero.tsx:525-530`) so that a programmatic scroll isn't mistaken for a user scroll. Every one of those would need to become `lenis.scrollTo`, and the alignment transaction that currently works by comparing `window.scrollY` against an absolute pixel destination would need rewriting. Lenis also degrades find-in-page, scrollbar dragging, and anchor jumps. For a page whose entire premise is choreographed scroll, adding a second scroll authority is a bad trade.

**GSAP would have been roughly neutral, maybe slightly negative.** The author uses `position: sticky` on an 831svh track instead of ScrollTrigger `pin`. That's better here, because pinning creates spacer elements that accumulate and misbehave on reversal, and this page is heavily reversible. GSAP's real win is `quickSetter` and transform caching, which brings me to the actual problem.

**The dependency argument holds for this specific page.** `page.tsx` sets `robots: {index: false, follow: false}` and the title is "Hero review". This is an internal review page. Pulling in GSAP core plus ScrollTrigger to ship it is unjustified.

So: the library question is the wrong question. Here are the questions that actually matter.

---

## Performance findings, ranked

### 1. Per-frame layout thrash on the game canvas

This is the big one. `Hero.tsx:362-369` writes seven `--game-*` custom properties every frame:

```js
element.style.setProperty('--game-width', `${frameWidth * pose.scale}px`);
element.style.setProperty('--game-height', `${frameHeight * pose.scale}px`);
element.style.setProperty('--game-scale', String(pose.scale));
element.style.setProperty('--game-layout-width', `${frameWidth}px`);
element.style.setProperty('--game-layout-height', `${frameHeight}px`);
```

And `hero.module.css:139-143` consumes two of them as **layout properties**:

```css
.gameCanvas {
  width: var(--game-layout-width);
  height: var(--game-layout-height);
  transform: scale(var(--game-scale, 1)) ...;
}
```

`width` and `height` are not compositor properties. Changing them forces a style recalc and a layout pass, and the subtree is the entire StudyGame quiz. So at 60fps you're laying out a quiz UI sixty times a second during the browse sequence.

GSAP wouldn't have fixed this either, which is exactly why it's worth flagging. The fix is to keep the canvas at a fixed pixel size and move only `transform: translate3d() scale()`, plus `contain: layout size` on the frame. Same visual result, zero layout.

### 2. Live `querySelectorAll` inside the per-frame paint

`SelectedWorkGallery.tsx:118-131`:

```js
const rowHeight = rows.current?.firstElementChild?.getBoundingClientRect().height ?? 64;
rows.current?.style.setProperty('transform', `translateY(${-start * rowHeight}px)`);
gallery.querySelectorAll<HTMLElement>('[data-panel-index]').forEach(panel => { ... });
```

A DOM query plus a forced layout read on every animation frame. There are at most four panels. Cache the NodeList on filter change and read `rowHeight` once in `trackSize()` instead.

### 3. Three scroll engines where one would do

Hero, TeamSection, and ClosingSequence each own a `scroll` listener, an rAF loop, their own `matchMedia`, and their own `getBoundingClientRect()` reads. All three also write `style.height` / `style.marginTop` and then read a rect in the same frame, which is textbook layout thrashing.

Here's the thing that makes this a real miss rather than a nitpick: `Hero.tsx:21-25` already declares a `MotionControls` handle with `align`, `refresh`, and `suspend`. It exists to let other components borrow Hero's clock. TeamSection and ClosingSequence don't use it. That's the seam that was built and then left unfinished.

### 4. Hero's scroll handler isn't rAF-coalesced

`Hero.tsx:575` binds `scroll` straight to `scroll()`, which calls `measure()` synchronously. `measure()` calls `trackSize()`, which writes `section.style.height` and eight `dataset` values, then reads `section.getBoundingClientRect()` (`Hero.tsx:451`) to compute `browseStart`. So every scroll event is a write-then-read-then-write-then-read cycle.

Scroll events can fire faster than rAF. Meanwhile TeamSection (`TeamSection.tsx:126`) and ClosingSequence (`ClosingSequence.tsx:59`) both do this correctly with `if (!frame) frame = requestAnimationFrame(paint)`. Hero is the odd one out inside its own codebase, which suggests a consistency miss rather than a deliberate choice.

### 5. `filter: blur()` on a full-width video, recalculated per frame

`Hero.tsx:436` sets `--motion-blur` up to 2.5px. `hero.module.css:68` applies it to `.filmFrame`, which contains a 17 MB looping video, and `:62-63` applies it to the wordmark at `min(15.2vw, 29vh)`. Blur forces re-rasterization. Blurring a video every frame is the expensive case.

Also worth noting: `blur = progress === target ? 0 : ...` snaps to zero the instant the scene settles. On a trackpad that will flicker. That's a design call, not a bug, but it means the blur is fighting itself.

### 6. An 11-write dead block

`Hero.tsx:304-320` computes and writes eleven `--game-*` properties inside `if (progress <= 4.3)`. Twenty lines later, `Hero.tsx:357-369` unconditionally overwrites every one of them whenever `entrance > 0`, which is the normal case. That whole block plus its `gameScale` arithmetic runs60 times a second to produce values that are immediately replaced.

### 7. Per-frame string allocation in TeamSection

`TeamSection.tsx:55-59` builds a 101-point array of template strings and joins it into a `polygon()` on every frame while the wipe is mid-transition. Transient, but it's a 101-vertex clip path re-serialized per frame, plus ~101 string allocations. Bake it to a static clip path and interpolate a small number of control points instead.

### 8. Media budget

- `public/redesign/nifemi.mp4` is 17.2 MB. `preload="metadata"` is right, but `Hero.tsx:569-574` fires `film.play()` on an IntersectionObserver at `threshold: 0.01`, so a visitor who scrolls the hero pulls 17 MB for an ambient background loop. No `saveData` check, no slow-connection fallback to poster-only.
- Every `next/image` on this page uses `unoptimized` (`Hero.tsx:759`, `TeamSection.tsx:207`, `ClosingSequence.tsx:79`). That disables resizing, WebP/AVIF conversion, and `srcset`. The `sizes` attributes on the team cutouts do nothing. `tablet-scene-v1.png` is 1.3 MB of PNG, eager-loaded.
- Eight team cutouts at 330-470 KB each, about 3.1 MB.
- `Hero.tsx:192-196` destroys and reloads the viewer video's `src` on `visibilitychange` when hidden. On return it reloads 17 MB from zero and seeks into an unbuffered range (`restoreViewerTime`). That's a visible stall on every tab switch.

### 9. No layer hints anywhere

`rg 'will-change|contain:|content-visibility' src/app/redesign/` returns nothing. Given that `.tabletScene` is a 1672×941 element with an SVG `mask-image` being transformed every frame during the pullback, and `.gameFrame` / `.filmFrame` are being translated and scaled continuously, this is a straightforward win.

### 10. The audit object is decoration

`Hero.tsx:249-253` implements the `__CREATIVE_AUDIT__` invariant surface, gated behind `NODE_ENV === 'development'`. Nothing reads it. `audit.fpsAverage` is computed at `:398` and discarded. It's the shape of a perf gate with none of the substance.

---

## Correctness and architecture

**Inverted dependency.** `panelPose` and `panelWindow` are defined in `SelectedWorkGallery.tsx:41,55` and imported *by the parent* at `Hero.tsx:11`, then used to place the game frame at `Hero.tsx:358,372`. The parent owns the child and imports geometry helpers from it. Move them to a shared module. A human reviewer catches this in ten seconds; it survived because the pieces were written by separate agents.

**Two modal strategies in one file.** The film viewer uses native `<dialog>.showModal()` (`Hero.tsx:174`) and gets a free focus trap. The game uses `showPopover()` (`Hero.tsx:168`) plus a hand-rolled Tab cycler at `Hero.tsx:177-186`. Pick one.

**State driven from a render loop.** `Hero.tsx:346` calls `updateGallery` (a `setState`) from inside `paint()`, which runs in rAF. It's guarded by the equality check at `:72`, so it only fires on change, and it works. But it means a React render gets scheduled mid-frame, which then runs the layout effect at `:597`, which calls `refresh()`, which calls `paint()` again. That's re-entrant by construction. It holds today because of the equality guard, which is one refactor away from an infinite loop.

**Zero tests.** `rg --files -g "*.test.*"` returns nothing. There's an 800-line numeric geometry engine with real regression risk: flip a sign in `collectionPosition` (`Hero.tsx:263`) and scroll alignment breaks silently, with no visual symptom until someone tries to click a project name. The Playwright scripts under `docs/redesign-review/` catch visual regressions. They don't catch a sign error. A dozen numeric unit tests on `panelPose`, `panelWindow`, `collectionPosition`, and `resultFor` would cost an hour.

**Repo hygiene.** Beyond the 281 MB: `.pi/takomi/subagent-conversations/**/session.jsonl` is committed agent scratch. From the parallel review of the non-UI half: ~20 unguarded `console.log` calls shipped in `db-sync-manager.ts`, obfuscated signatures like `export async function GET(...[]: [req: NextRequest])` at `conversations/route.ts:9`, a stale "potential attack" comment on a 1000-item check, and `ConditionalLayout.tsx:40-42` bypassing `<Providers>` entirely for `/redesign`, which will break any redesign page that needs session or theme context.

**Scope.** The contact-phone work (`schema.prisma`, `email.ts`, `api/contact/route.ts`, the new migration) is entirely uncommitted. Anyone merging this branch gets none of it. The branch name is `website-redesign` and it carries auth, chat, and CMS changes alongside.

---

## The good parts, specifically

I'm going to be direct about these because they're better than what usually comes out of a build like this.

**The RAF loop terminates itself.** `Hero.tsx:438`:

```js
frame = progress === target && !panelMoving ? 0 : requestAnimationFrame(tick);
```

Most hand-rolled scroll engines spin forever. This one costs nothing at rest. TeamSection does the same at `TeamSection.tsx:136`. That's a real optimization and whoever wrote it knew it mattered.

**Zero allocation in the hot path.** Hero's `tick` and `paint` create no objects, no arrays, no strings. The one exception is the `galleryFrame` literal at `:351`, which is minor. Compare that to the TeamSection `edge` array and you'll see the author knew the rule and applied it unevenly rather than not at all.

**Scroll-wins interaction arbitration.** `SelectedWorkGallery.tsx:110-113` clears the pointer latch the instant paint isn't settled, and re-arming requires 4 CSS pixels of deliberate movement *after* settlement. That's the fix for the classic "row slides under a stationary cursor and hijacks the preview" bug. Documented as rule 2 in the feature doc.

**Media lifecycle discipline.** `FilmPreview` (`SelectedWorkGallery.tsx:65-71`) gates on eligibility and tears down `src` in the effect return. `preload="none"` on previews. `preload="metadata"` on the hero. IntersectionObserver gating playback. `visibilitychange` pause. Individual video `src` destruction to free decoder memory.

**Scroll position and focus restoration on modal exit.** `Hero.tsx:200-217` snapshots `window.scrollY`, body overflow, and scrollbar padding, then restores all of it, restores focus to the invoking element or falls back to `focusCatalog()`. That's the level of care most teams skip.

**Reduced motion is a full alternate expression, not a degradation.** It's not `animation: none`. It's a static hero, an explicit tablet view, a real game view, and a static gallery, with `changeMotion` (`Hero.tsx:553-565`) resetting state on preference change mid-session. The CSS `@media (prefers-reduced-motion: reduce)` block is a parallel layout, not a set of nulls.

**Two modal focus strategies, correctly `preventScroll`'d throughout,** and a skip link that routes to the sound control (`Hero.tsx:697`).

---

## So: how should this have been written?

Same architecture. Different transport for the per-frame values.

Keep the single owning clock, the sticky track, the native scroll authority, the self-terminating loop, and the CSS-variable choreography model. That whole spine is right.

Change three things:

1. Move the per-frame channel from custom properties to `transform` and `opacity` on the elements that need them, and give `.gameCanvas` a fixed size with `contain: layout size`. This is the fix for finding 1 and it needs no library.
2. Drive TeamSection and ClosingSequence from the `MotionControls` handle Hero already exposes, or fold them into one clock. This is the fix for findings 3 and 4.
3. Add twelve numeric unit tests and a real CI perf gate, then gitignore `.pi/` and `docs/redesign-review/`.

If you want a library, the honest answer is: **not GSAP and not Lenis.** GSAP would save you maybe 200 lines and add70 KB to a page nobody should find in a search index. If you want to reach for something, reach for the thing that makes your per-frame writes cheap, and in this architecture that's `will-change`, `contain`, and fixed-size canvases.

---

## On who wrote this

**It was AI-orchestrated, with you directing.** Not "AI-assisted." The evidence is in the tree:

- `.pi/takomi/orchestrator/orch-*.json` with a `lifecycle` of `genesis → design → build`, `mode: hybrid`, `sessionIntent: full-project`. That's an orchestrator running a phased pipeline.
- `.pi/takomi/subagent-conversations/` with subagent roles named `coder-`, `reviewer-`, and `worker-`. A plan/code/review pipeline with separate agents per role.
- `docs/tasks/orchestrator-sessions/orch-*/` with `master_plan.md`, `completed/*.task.md`, `pending/*.task.md`, and an `Orchestrator_Summary.md`.
- Branch `claude-saving-logic` in the ref list.
- `docs/redesign-review/verify-*.cjs` Playwright harnesses with machine-shaped outputs (`hero-checks.json`, `tablet-checks.json` at 1,109 lines, `gallery-verify-reduced-recheck.json`).

**Which model.** I'll give you a reasoned guess with the caveat that model identity isn't recoverable from artifacts alone, since an orchestrator can route different roles to different models.

The strongest signal is stylistic. The prose in `docs/features/SelectedWorkGallery.md` has a specific fingerprint: numbered contract sections, explicit rejections with reasoning, imperative prohibitions ("Do not copy its 145ms clock", "Do not replace its denominator"), and a geometry spec expressed as a table of intervals with exact multipliers. The code has Claude-shaped habits: inline quintic easing written out rather than imported, `Reflect.deleteProperty(window, '__CREATIVE_AUDIT__')` instead of `delete window.x`, `Object.defineProperty` with `configurable: true`, an exhaustive `useRef` mirror-state pattern (`galleryLive`, `activeRef`, `finalRef`, `lastFolded`, `lastInteractive`), and comments that explain non-obvious math rather than restating code.

My guess: **Claude, Opus-class for the design and review agents, with a cheaper model for the mechanical coding workers.** The orchestrator role split (`coder` / `reviewer` / `worker`) is consistent with a mixed-model pipeline where a strong model plans and reviews and a cheaper one executes. I can't rule out Sonnet-class throughout. If the orchestrator config lives in `.pi/`, it'll tell you outright.

**What this means for how you read the code.** The quality profile is exactly what I'd expect: the *architecture and the hard parts* are genuinely strong, because a strong model reasoned about them. The *hygiene and the edges* are weak, because nobody owns them. That's why you get a self-terminating RAF loop in one place and 281 MB of committed binaries, a `querySelectorAll` inside a frame loop, an inverted parent/child import, and zero tests on an 800-line numeric engine. Nobody ran a lint pass on the finished work.

The inverted `panelPose` import is the tell I'd point at. Separate agents wrote `Hero.tsx` and `SelectedWorkGallery.tsx` against a shared contract document, and the contract said "the gallery exports panel geometry" without saying "in a module both can import." That's a coordination seam, not a reasoning failure. Which is good news, because coordination seams are fixable by a human in five minutes.

---

## Compliance note

Read `references/concept-evaluation.md`, `references/performance-and-profiling.md`, and `references/motion-and-scroll.md` from the creative-web-development skill before writing this. The binding constraints that shaped it: DPR clamping and draw-call budgeting don't apply (no WebGL here, which is the right call and I checked); the zero-allocation loop protocol is why the TeamSection `edge` array is a finding; the GSAP/Lenis unified-ticker and canonical-Lenis-CSS patterns are why I concluded Lenis would conflict with the native-scroll alignment protocol rather than improve it; the `__CREATIVE_AUDIT__` verifier from the reference is implemented in the code but not wired to anything, which is finding 10.

Concept hard gates: factual integrity passes (the provisional school cover is labelled as provisional in both the content file and the UI, per the skill's Fact Trace rule); utility floor passes on the studio pages but the page is `noindex` so it's not the public site yet; concept-before-technology holds, the design is about a studio's people and work, not about effects; accessible equivalent is strong.