## Code review: `website-redesign` — `/redesign` hero system

Scope reviewed: `src/app/redesign/Hero.tsx:1-806`, `TeamSection.tsx:1-220`, `SelectedWorkGallery.tsx:1-273`, `StudyGame.tsx`, `ClosingSequence.tsx`, `hero.module.css`, `package.json`. Branch: `website-redesign`.

### Verdict on GSAP / Lenis / Motion

Keep it hand-rolled **for this page**, but fix the loop architecture. Do not add GSAP + Lenis now.

You already have `motion@12.23.24` in `package.json:56` and use none of it. Either delete it or use it — dead weight is the worst option.

Why hand-rolled is defensible here:

* Choreography is bespoke: arrival `0-0.25` → expansion `0.25-0.8` → pullback `>1.0` → game `1.9-4.3` → gallery `>4.3` in `Hero.tsx:265-344`. Hard to express cleanly in ScrollTrigger timelines.
* Zero extra JS. GSAP core + ScrollTrigger + Lenis ≈ 130kb min. Current approach is CSS vars + one `rAF`, no re-render per frame — architecturally correct per `performance-and-profiling.md` unified-ticker idea, just implemented 3x.
* `prefers-reduced-motion` is first-class, not bolted on: `Hero.tsx:228,343-344,553-564`, `TeamSection.tsx:55-58`, `ClosingSequence.tsx:44`. GSAP migrations often regress this.

When you *should* switch: if you add smooth-wheel inertia, horizontal galleries, or pin + scrub on mobile Safari. Then adopt Lenis + single ticker per `motion-and-scroll.md:68-98`. Don't cherry-pick Lenis alone — unsynced Lenis + manual `rAF` is worse.

### Performance issues, ranked

**1. 16.45 MB hero video.**
`public/redesign/nifemi.mp4 16.45MB`, `FILM` in `Hero.tsx:27`, played fullscreen via `Hero.tsx:726`. `preload="metadata"` helps, but no mobile rendition, no adaptive bitrate, `unoptimized` poster path. On 4G this is the LCP killer.
Fix: compress to ~2-3MB 720p + 1080p renditions, `media=`-gated sources, `preload="none"` on `width<=800`.

**2. Three independent scroll clocks.**
`Hero.tsx:392` `tick`, `TeamSection.tsx:52` `paint`, `ClosingSequence.tsx:37` `paint`, each with own `scroll` + `resize` + `rAF`. Violates unified-ticker rule (`motion-and-scroll.md:7-27`). Causes desync on fast scroll + 3x `getBoundingClientRect` per frame.
Fix: one scroll owner in `Hero`, pass `progress` down; or move to `motion` `useScroll` + `useTransform`.

**3. Forced sync layout per frame.**
`Hero.tsx:348` `section.getBoundingClientRect()` inside `paint()`, `Hero.tsx:462` same in `measure()`, `SelectedWorkGallery.tsx:127` `firstElementChild.getBoundingClientRect()` + `131` `querySelectorAll('[data-panel-index]')` every paint. Read → write → read in same frame.
Fix: cache rects on `resize`/`refresh`, batch reads before writes, cache panel node list in a `ref`.

**4. Expensive paint properties animated per scroll.**
`hero.module.css:68,83` `filter: blur(var(--motion-blur))` driven in `Hero.tsx:435-436`; `TeamSection.tsx:72` 101-point `clip-path: polygon(...)` rebuilt as string every frame during wipe; `ClosingSequence.tsx:47` animated `borderRadius: 50%→0`; `tabletScene` `mask-image` in `hero.module.css:98-102`. Blur + clip-path + mask = raster storm on mobile.
Fix: drop motion-blur entirely (barely visible at `2.5px`), replace wipe with `transform: translateX/scaleX` + `overflow: clip`, replace border-radius morph with opacity/transform.

**5. Zero-allocation violations.**
`TeamSection.tsx:65-71` allocates `edge: string[]` + 101 strings + `join` per frame; `Hero.tsx:264-391` template-string `setProperty` ×20/frame; `TeamSection.tsx:140` `querySelector('[data-team-name]')` per member per frame (8× DOM query at 60fps).
Fix: preallocate, cache name nodes in `members.current` setup, early-out when `target===rendered`.

**6. `unoptimized` images bypass Next optimization.**
`Hero.tsx:759`, `TeamSection.tsx:196`, `SelectedWorkGallery.tsx:255-256` all `unoptimized`. `tablet-scene-v1.png 1.26MB` eager-loaded even on mobile where it's hidden. 8× `780px` cutouts, only first eager — good — but no `priority`, no `sizes` discipline on hero.
Fix: remove `unoptimized`, add `priority` to tablet scene, `sizes` + AVIF/WebP renditions, lazy-load below-fold panels.

**7. Oversized scroll tracks + negative-margin overlap.**
`hero.module.css:62` `height: 831svh` sticky; `TeamSection.tsx:57-58` `height: 5.1*height + marginTop: -height-entry`; `ClosingSequence.tsx:41` `marginTop: -height-distance`. Huge scroll height + overlapping sticky contexts = iOS Safari `100svh` jitter + scroll-linked CLS. Works, but brittle.
Fix: prefer ScrollTrigger `pinSpacing` semantics or at minimum isolate with `contain: layout paint`.

**8. `useLayoutEffect` without deps + `setState` in `paint`.**
`SelectedWorkGallery.tsx:152-158` runs every render, `paint()` calls `setPaintVisible`/`setPanelIndex` (`117-119`). Correct today due to equality guards, but one missed guard = render loop. Same pattern `Hero.tsx:597`.
Fix: add dep arrays, move `setState` behind `previous!==next` checks only.

Minor: global `pointermove` in `SelectedWorkGallery.tsx:166` runs even when `visible=false`; `window.matchMedia` re-created per `go()` call in `TeamSection.tsx:175,213`; `behavior: 'instant'` in `Hero.tsx:512,656` — valid in modern spec but Safari <17 falls back silently, use `'auto'`.

### What's genuinely good

* Scroll via CSS vars + refs, not React state per frame. `paint()` writes `--progress`, `--arrival`, `--game-*` and lets CSS do the work. Right call.
* Video hygiene: `IntersectionObserver` pause in `Hero.tsx:569-573`, `document.hidden` guard in `resume():256`, `FilmPreview` unloads `src` on cleanup `SelectedWorkGallery.tsx:84`, viewer unloads on close `Hero.tsx:204-206`.
* Accessibility: skip link, focus trap with `Escape` + `Tab` wrap `Hero.tsx:177-186`, `inert` sibling isolation `155-166`, scrollbar-width compensation `152-154`, `aria-hidden` dual-DOM for split headlines `735-738`. Above average.
* Gallery windowing: `panelWindow()` caps to 4 panels, `FilmPreview eligible` gates playback to displayed panel only `251`. Correct instinct.
* Verification discipline: `docs/redesign-review/` with 1440/1920/390 screenshots, journey MP4s, `verify-quiz.cjs` + `__CREATIVE_AUDIT__` harness in `Hero.tsx:249-253,395-400` matching the skill's diagnostic contract. Rare to see this done at all.
* System font stack (`Arial/Helvetica`) — no webfont blocking on hero. Good perf tradeoff.

### Author: human + AI swarm, not solo hand-write

My call: **AI-generated under human direction, likely Claude (Sonnet/Opus 4.x class) via Takomi orchestrator.**

Why:

* `.pi/takomi/orchestrator/`, `.pi/takomi/subagent-conversations/coder-*`, `docs/tasks/orchestrator-sessions/orch-20261002-*/` — this branch was built by agents, not typed.
* Tells: 806-line `Hero.tsx` with 25 refs + magic numbers (`4.3`, `2.7`, `.75`, `PROJECT_STRIDE=.5`), duplicated `clamp`/`ease` in `Hero.tsx:32-33` and `TeamSection.tsx:22-23` instead of shared util, exhaustive a11y boilerplate + over-explanatory comments (`Hero.tsx:271,751`), verification screenshot sprawl. Classic long-context agent output: thorough, correct-ish, never refactors itself.
* Counter-evidence of human taste: reduced-motion parity is genuinely thought through, focus-return + scrollbar compensation are senior details. So: senior directed, agents typed.

If forced to name one model: Claude — only family that routinely produces this exact mix of verbose a11y correctness + single-file sprawl + `popover`/`dialog`/`inert` native-API enthusiasm.

### Do-this-next (smallest useful diff)

1. Delete or adopt `motion` dep. No middle ground.
2. Kill `--motion-blur`, cache `getBoundingClientRect`, cache panel/name node lists — ~80% of jank for ~30 lines.
3. Compress `nifemi.mp4`, responsive renditions, `preload="none"` on mobile.
4. Merge the three `rAF` loops into one ticker owned by `Hero`.

Reference receipt: `performance-and-profiling.md` — zero-allocation loop (§4), teardown (§5), `__CREATIVE_AUDIT__` harness (§7); `motion-and-scroll.md` — unified GSAP+Lenis ticker (§1), pin math (§2). Constraint applied: transform/opacity-only animation, single clock, measured audit over assumed smoothness.
