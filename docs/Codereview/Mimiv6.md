# Code review: `website-redesign`

**Scope:** `git diff 886e9b6..HEAD` (9 redesign commits) plus the 6 unstaged and 5 untracked files in `src/app/redesign/`. I also read the contact route changes.

**Checks run:** `npx eslint src/app/redesign --max-warnings=0` clean, `npx tsc --noEmit` exit 0.

**Reference receipt:** `performance-and-profiling.md` (zero-allocation RAF rule, 16.6ms budget) `motion-and-scroll.md` (canonical Lenis setup binds into a single ticker and requires `html.lenis { height: auto }`) `concept-evaluation.md` (restraint scores above technique accumulation).

---

## Who wrote it

AI. `gpt-6.1-sol` through OpenAI Codex.

I didn't have to guess. `.pi/takomi/subagent-conversations/*/run-0/session.jsonl` records `{"type":"model_change","provider":"openai-codex","modelId":"gpt-6.1-sol"}` in all four persisted sessions.

Caveat on coverage. Those four sessions cover `SelectedWorkGallery` (commit `afbe058`) and the contact-phone work. The hero, tablet pullback, study game, and team commits have orchestrator task files but no model record, so those are inferred from style rather than proven. Git author is `JStaRFilms` on every commit, so you're the approver, not the author.

The orchestration shape gives it away regardless. Takomi genesis/design/build/verify lifecycle, separate coder and reviewer agents, a dedicated verification worker, SHA-256 pinned master plans. Nobody hand-commits like that.

My read on the quality: better TypeScript than most mid-level humans write, worse performance engineering than a specialist would do. The accessibility and teardown work is above average. The frame-budget thinking is absent, and the irony is that `Hero.tsx:249` ships a `__CREATIVE_AUDIT__` harness collecting `fpsAverage` and `frameDrops`, then nothing reads it. The model built a speedometer and never looked at it.

---

## Performance findings, ranked

### 1. Four forced synchronous layouts per frame

Three independent scroll engines live on one page, and each writes styles then immediately reads layout.

- **Hero** `scroll()` calls `measure()` directly in the scroll event handler (`Hero.tsx:523`). `measure()` → `trackSize()` writes `section.style.height`, writes 8 `dataset` attributes, then reads `section.getBoundingClientRect()` at `Hero.tsx:451`. That is a forced reflow on every scroll event.
- **Hero** `paint()` writes ~15 custom properties, then reads `section.getBoundingClientRect()` at `Hero.tsx:348`. Then `SelectedWorkGallery.paint()` reads `rows.current.firstElementChild.getBoundingClientRect()` at `SelectedWorkGallery.tsx:127`. Two more forced reflows.
- **TeamSection** `paint()` writes `element.style.height` and `marginTop`, then reads `getBoundingClientRect()` at `TeamSection.tsx:60`.
- **ClosingSequence** `paint()` writes `marginTop` and `paddingBottom`, then reads `getBoundingClientRect()` twice (`ClosingSequence.tsx:43,48`).

Because the custom properties are set on `.root`, they inherit, so every write invalidates style for essentially the whole subtree. Then the next read forces layout on top of that.

The highest-value single line in the branch is `Hero.tsx:348`. `sectionRect` is used only for `mediaVisible`, which already requires `entrance > .98`. Gate the read behind that condition and you remove a forced layout from every frame of the main hero choreography, with byte-identical behavior.

### 2. The loop runs ~5 seconds after you stop scrolling

`Hero.tsx:406` uses a 1000ms time constant, which the feature doc says the owner specified. Fine. But `Hero.tsx:409` snaps only when the gap is below `0.0001`.

At 60fps, closing a 0.01-unit gap to a 0.0001 epsilon takes about 280 frames, so roughly 4.6 seconds of continuous style recalc and property writes for a small scroll nudge, after the visible motion is already done. A full 0→1 transition takes about 550 frames.

The epsilon and the response curve are separate knobs. Tightening the epsilon to `0.001` halves the tail and changes nothing a person can see. Check that `data-settled`, which your Playwright scripts read, still flips reliably.

Contrast: `TeamSection.tsx:84` settles at `0.002` with a 70ms constant and stops in about 10 frames. The author knows how to tune this. The Hero's tail is a spec artifact, not a mistake, but the epsilon wasn't part of the spec.

### 3. Per-frame work that buys nothing

- `TeamSection.tsx:66` rebuilds a 100-point `clip-path` polygon every frame while the wipe is in progress, with two `Math.sin` calls per point. That is 200 sine evaluations and a string join per frame, applied to a full-viewport layer holding 8 images. The sine terms are constants. Only `wipe * 180 - 45` depends on time.
- `TeamSection.tsx:91-93` writes `data-team-progress`, `data-team-member`, `data-team-final` every frame. `ClosingSequence.tsx:49` writes `data-cover`. `Hero.tsx:446-451` writes six `data-gallery-*` attributes on every scroll event. I grepped `src/` and `docs/redesign-review/*.cjs`. Nothing reads any of them. Each is a `String()` or `.toFixed()` allocation plus an attribute mutation.
- `Hero.tsx:269,337-339,384-385` write `dataset.tablet`, `gameVisible`, `gameEmerging`, `gameInteractive`, `screening`, `settled` unconditionally every frame. The first and fourth are real CSS hooks, so compare against the last value the way `Hero.tsx:352` already does for `galleryVisible`.
- `SelectedWorkGallery.tsx:152` runs `paint()` in a `useLayoutEffect` with no dependency array, so it runs on every render. Renders happen on every pointer move across the project list. Each run does a `getBoundingClientRect` plus `querySelectorAll`.
- `Hero.tsx:715` puts `onPointerMove={() => wakeSound()}` on the stage, and `wakeSound` clears and re-arms a `setTimeout` on every pointermove event.

### 4. The blur filter is never off

`hero.module.css:67` and `:83` apply `filter: blur(var(--motion-blur))` to both wordmark lines and the film frame. The value correctly computes to `0px` at rest and under reduced motion, but the filter declaration stays, so those elements remain promoted as filtered layers. On `.filmFrame` at full screen that is a filtered layer sitting over a playing 720p video.

Worth toggling the declaration off below the 1.2px/ms threshold instead of just driving it to zero.

### 5. Assets

| File | Size | Note |
| --- | --- | --- |
| `nifemi.mp4` | 16.85 MB | 1280x720, 26.6s, about 5 Mbps |
| `tablet-scene-v1.png` | 1.29 MB | `loading="eager"` and `unoptimized`, hidden until ~25% scroll |
| 8 team cutouts | ~3 MB | 320–461 KB each, `unoptimized` |
| `public/redesign` total | 25.6 MB | 20 files |

A 2-pass encode at 2.5 Mbps gets the video to about 8 MB with no visible loss at 720p. AVIF for the tablet scene gets 1.29 MB to roughly 250 KB. Both are pure wins with no code changes.

---

## GSAP and Lenis

**Lenis, no.** The canonical setup wants its own ticker bound with `lagSmoothing(0)` and `html.lenis, html.lenis body { height: auto }`. This route already patches global overflow at `hero.module.css:34` and pins with `position: sticky`. Five programmatic scrolls use `behavior: 'instant'`, and `TeamSection.go()` uses `'smooth'` with a wheel/touch interrupt trap at `TeamSection.tsx:145`. Every one of those would need rework.

You'd also be smoothing twice. The page already eases the progress scalar at 1000ms. Lenis eases the scrollbar on top of that. The result would feel like dragging through mud, and you'd have to retune a curve the owner approved.

**GSAP and ScrollTrigger, worth it for maintainability but not for frames.** It would replace the eight stage thresholds in `paint()` (`0.25`, `0.55`, `1.9`, `2.03`, `2.16`, `2.65`, `3.3`, `3.36`, `4.1`, `4.3`), the manual range math in `measure()` and `trackSize()`, and the resize invalidation. That code is hard to review.

It would not touch the paint path, which is where your frames go. GSAP writes inline styles the same way you do, and it does not stop you from calling `getBoundingClientRect`. Your bottleneck is style recalc plus forced layout.

On pinning, `position: sticky` is better than ScrollTrigger's `pin`, which wraps the trigger in a pin-spacer and would collide with your ancestor-chain `inert` walk, focus trap, and body scroll lock. And the tablet pullback is verified to 0.35 CSS px by your own harness. Rewriting registered geometry risks that for zero frame gain.

Cost is roughly 70KB minified for core plus ScrollTrigger, on a route whose feature doc states "No dependencies added."

**Middle option:** `motion` v12 is already in `package.json` and used in 5 files elsewhere, 0 in `redesign`. It would buy you syntax, not speed, since scroll-linked values still need the same per-element writes.

**My call:** keep the architecture. Fix the paint path.

---

## What's good

1. **Native scroll, sticky pin.** No hijacking. Momentum, keyboard, and touch all keep working, and `position: sticky` costs nothing compared to a pin-spacer.
2. **One scalar driving CSS custom properties.** `paint()` computes 15 values and lets the style engine compose the rest. That's the right split between JS and CSS.
3. **The RAF loop stops when settled.** No idle cost at rest. This is the thing most hand-rolled scroll engines get wrong.
4. **Reduced motion gets a real alternative layout.** `hero.module.css:184` switches to `height: auto` and `position: relative` with explicit View tablet / View study game buttons. Not a slowed-down version of the same thing. Most award sites don't bother.
5. **Teardown discipline.** Every listener, observer, mask callback, RAF, hint timer, and the dev-only `__CREATIVE_AUDIT__` global is removed in the effect that created it. I went looking for a leak and didn't find one.
6. **React stays out of the hot path.** State writes are guarded by value comparison, refs mirror state to avoid stale closures, and the loop drives the DOM directly instead of through `setState`.
7. **Refresh-rate independent easing.** `1 - Math.exp(-elapsed / tau)` instead of per-frame constants. Correct at 60Hz and 120Hz.
8. **Accessibility depth.** Skip link, hand-rolled focus trap with `getClientRects()` filtering, `inert` propagated up the ancestor chain, dialog plus popover, `aria-keyshortcuts`, `role="status"` messages, focus restored on close, and a scrollbar-compensated body lock that restores scroll position. This is the strongest part of the branch.
9. **The contact route is now honest.** Type guard instead of `any`, phone validation with an escaped HTML render, a failed insert returns 500 instead of a fake success id, and newsletter/analytics moved into a best-effort block so they can't mask a save failure.
10. **A verification harness exists at all.** Playwright scripts, fixtures at three viewports, recordings, and pass criteria written down in the feature doc.

## What I'd change

In order of value per unit of risk:

1. Gate the `getBoundingClientRect()` at `Hero.tsx:348` behind `entrance > .98`. One line, identical behavior, removes a forced layout from the main animation.
2. Split `trackSize()` out of `measure()`. Its output depends only on height, collection size, and reduced-motion, so call it from `resize()`, the collection effect, and `changeMotion()`. That removes 9 layout-affecting writes plus a forced read from every scroll event.
3. Raise the settle epsilon from `0.0001` to `0.001`. Halves the RAF tail. Re-run the harness that reads `data-settled`.
4. Read once, write once per frame. Hoist a layout-read pass to the top of each engine, and move TeamSection's and ClosingSequence's scroll-invariant sizing into a resize handler. Takes 4 forced layouts down to 1.
5. Cache the last value before writing `dataset`, the way `Hero.tsx:352` already does. Then delete `data-team-progress`, `data-team-member`, `data-team-final`, `data-cover`, and the six `data-gallery-*` writes if you confirm nothing reads them.
6. Precompute TeamSection's sine table at module scope, or drop the polygon to 40 points.
7. Turn the blur filter off below the threshold instead of driving it to `0px`.
8. Re-encode the video at 2.5 Mbps and convert the tablet scene to AVIF.

Two smaller things. `Hero.tsx` is 780 lines with a 375-line `useEffect`, and `clamp`/`ease`/`mix` plus the damping formula are reimplemented across Hero, TeamSection, and the gallery. Extracting a shared `scroll-engine.ts` would make the stage table readable and is where GSAP's absence actually hurts. Also, `.track` ships `height: 831svh` in CSS at `hero.module.css:62`, so the server-rendered HTML is an 831vh document before hydration.

**Constraint audit:** receipts applied (single-clock architecture per `motion-and-scroll.md`, zero-allocation loop rule per `performance-and-profiling.md`, restraint over technique accumulation per `concept-evaluation.md`); the verdict stays inside the requested audit boundary with no implementation blueprint; no factual claims beyond what the repo, the feature doc, and the checks I ran support.

## Objective

- Produce a code review of the `website-redesign` branch of `C:\CreativeOS\01_Projects\Code\jstar-platform`, focused on performance issues/gains, whether the custom implementation is right vs. adopting GSAP/Lenis-style libraries, pros/cons of the code, and a judgment on whether a human engineer or an AI model wrote it (with a model guess).

## Important Details

- User invoked `$creative-web-development` skill; skill routing required reading `references/concept-evaluation.md`, `references/performance-and-profiling.md`, `references/motion-and-scroll.md` (all read). `unslop` skill also loaded for final output style.
- Merge base for diff: `886e9b626486402cdb930c9f3190be07bd840d81` (origin/main). Branch: `website-redesign`.
- New deps on branch: **none** — `package.json` only drops 4 lines. No gsap, no lenis, no three in the repo. `motion` ^12.23.24 exists but is used in only 5 files, none under `src/app/redesign/`.
- Redesign architecture: one scalar `progress` → CSS custom properties on `.root`, driving CSS `calc()` chains. Hand-rolled easing: `ease = t*t*t*(t*(t*6-15)+10)` (quintic smoothstep), time-based follow `1 - Math.exp(-elapsed/tau)` with tau=1000ms (owner-specified), TeamSection tau=70ms, gallery tau=180ms.
- Three independent scroll engines on one page: Hero (calls `measure()` **synchronously in the scroll event**), TeamSection (RAF-deferred), ClosingSequence (RAF-deferred).
- Authorship ground truth found in repo: `.pi/takomi/subagent-conversations/*/run-0/session.jsonl` records `{"provider":"openai-codex","modelId":"gpt-6.1-sol"}` for all 4 logged sessions (`coder-selected-work-gallery-sync`, `reviewer-selected-work-gallery`, `worker-gallery-verification`, `coder-02-contact-phone`). Caveat: logs only cover 2026-10-02 sessions (gallery + contact-phone); earlier Hero/tablet/game commits have no persisted session logs.
- Repo AGENTS.md rules are visible in code style: no `any`, comments explain non-obvious reasoning only.
- `docs/features/DesktopHeroRedesign.md` states explicitly: "No dependencies added", "Native DOM/CSS is used without a new animation engine, Canvas or WebGL", "Focused ESLint, TypeScript and whitespace checks were rerun".
- Verification harness scripts live in `docs/redesign-review/*.cjs` (Playwright) and read `data-*` attributes: `data-gallery`, `data-settled`, `data-denominator`, `data-panel`, `data-pointer`, `data-team`, `data-committed-id`, `data-gallery-counter`, etc.
- Command note: PowerShell chokes on `src/app/redesign/*.css` glob and on double-quoted `blur\(` patterns — use `src\app\redesign\*.css` or `--glob '*.css'` with single quotes.

## Work State

### Completed

- Skill/reference loading (creative-web-development router, concept-evaluation, performance-and-profiling, motion-and-scroll, unslop).
- Diff stat produced for `886e9b6..HEAD` plus uncommitted changes.
- Read in full: `Hero.tsx`, `SelectedWorkGallery.tsx`, `page.tsx`, `TeamSection.tsx`, `ClosingSequence.tsx`, `EnquiryForm.tsx`, `ClientNotes.tsx`, `hero.module.css`.
- Grepped dataset writes vs. CSS consumers; grepped verify-script attribute reads; audited CSS perf keywords.
- Asset audit: `public/redesign` = 25.6 MB / 20 files. `nifemi.mp4` 16.85 MB (1280×720, 26.59s ≈ 5 Mbps); `tablet-scene-v1.png` 1.29 MB, `loading="eager"` + `unoptimized`; 8 team cutouts ~320–461 KB each (≈3 MB), `unoptimized`; fonts dm-sans 36 KB, outfit 32 KB.
- Verification: `npx eslint src/app/redesign --max-warnings=0` → exit 0, no output; `npx tsc --noEmit` → `EXIT=0`.
- Uncommitted `src/app/api/contact/route.ts` diff reviewed: type-guard `validateContactData(data: unknown, errors: string[]): data is ContactFormData`, phone validation, DB save separated from best-effort newsletter/analytics, HTML escaping of phone (injection fix), removed fake success id.
- Authorship confirmed from orchestrator/subagent logs.

### Active

- Drafting the final review answer (all evidence gathered; unslop skill loaded as the last step, so the written response has not been produced yet).

### Blocked

- (none)

## Next Move

1. Write and deliver the final review in the unslop style, covering: performance findings (ordered by impact), GSAP/Lenis verdict, pros/cons, and authorship verdict (`gpt-6.1-sol` via OpenAI Codex, with the caveat about which sessions are logged).
2. Report the quantified perf findings already identified:
   - `Hero.tsx` paint reads `section.getBoundingClientRect()` (≈line 348) **unconditionally** every frame, but `sectionRect` is only used for `mediaVisible` gated on `entrance > .98` → gate it behind that check to kill a forced reflow during the entire hero choreography.
   - `measure()` → `trackSize()` runs on **every scroll event**: writes `section.style.height`, 8 `dataset.*` attrs (`galleryEntrance/Browsing/Stride/Rest/Exit/BrowseStart/Denominator/GalleryCount`), then reads `getBoundingClientRect()` — all results are scroll-invariant (`window.scrollY + top` is constant) → move to resize/collection-change only.
   - Settle epsilon `0.0001` with tau=1000ms keeps RAF alive ≈9.6 s (full range) / ≈4.8 s (small nudge) after input stops, writing ~15 custom properties each frame on `.root` (inherited → whole-subtree style recalc). Raise to ~0.001 (≈0.15px vs 1.5px track error) and re-verify `data-settled` tests; response curve unaffected.
   - Up to 4 forced synchronous layouts/frame across Hero + TeamSection + ClosingSequence (each writes styles then reads layout in the same frame).
   - Unconditional per-frame `dataset` writes: `dataset.screening`, `dataset.tablet`, `dataset.gameVisible/Emerging/Interactive` (all CSS-consumed, so each dirties `.root` style), plus `:has([data-team-visible])` selector on `.root`; dead writes `teamProgress`, `teamMember`, `teamFinal`, `cover` (unused by CSS/JS/verify scripts).
   - `TeamSection` clip-path: 100-point polygon rebuilt every frame with 200 `Math.sin` + string concat on a full-viewport stage with 8 images → precompute the invariant `Math.sin(i*.72)*.65 + Math.sin(i*.26)*1.8`, or drop point count.
   - `filter: blur(var(--motion-blur))` always present on `.firstLine`/`.secondLine`/`.filmFrame` even at `0px`; blur on full-screen video + giant text.
   - `SelectedWorkGallery.paint`: `querySelectorAll('[data-panel-index]')` + `rows.current.firstElementChild.getBoundingClientRect()` (rowHeight is CSS-constant → cache, recompute on resize) + inline `width`/`height` writes each frame; `box-shadow: 0 20px 70px #0003` on 4 panels re-rasterized when size changes.
   - `useLayoutEffect` with no dep array in `SelectedWorkGallery` (≈line 152) → `paint()` (layout read) on every render; renders fire on pointer/focus moves over the list.
   - Hero `stage` `onPointerMove={() => wakeSound()}` → `clearTimeout`+`setTimeout` churn at pointermove frequency.
   - `track` CSS height `831svh` fallback before hydration; asset weight (16.85 MB video, 1.29 MB eager unoptimized PNG → AVIF/WebP ≈200–300 KB, video → ~8 MB at 2–3 Mbps).
   - Three duplicated `clamp`/`ease`/`mix` implementations across Hero, TeamSection, SelectedWorkGallery.
3. Verdict to deliver: **skip Lenis** (native scroll + time-based follow on the progress scalar already provides smoothing; Lenis would double-smooth, fight the 5 `scrollTo({behavior:'instant'})` alignment calls, and add teardown obligations). **GSAP optional, not a perf win** — `position: sticky` already beats ScrollTrigger `pin` (no pin-spacer DOM churn vs. their `inert`/focus-trap/scroll-lock logic), bottleneck is the paint path which GSAP wouldn't change; only justify it for readability if Hero's 130-line magic-number `paint()` keeps growing. Middle ground: `motion` is already a dependency but only used in 5 unrelated files.

## Relevant Files

- `src/app/redesign/Hero.tsx`: 780–803 lines; the core hand-rolled scroll engine (`useEffect` ≈375 lines), `measure()`/`trackSize()`/`tick()`/`paint()`, audio, dialogs, focus traps, scroll lock.
- `src/app/redesign/hero.module.css`: 221–227 lines; all CSS custom properties (`--arrival`, `--nav-fold`, `--motion-blur`, etc.), `filter: blur()`, `perspective(600px) rotateX`, `overflow-x: clip` via `:has()`, reduced-motion overrides.
- `src/app/redesign/TeamSection.tsx` + `team.module.css`: 100-point clip-path wipe, its own RAF engine, per-frame dataset writes.
- `src/app/redesign/SelectedWorkGallery.tsx` + `selected-work.module.css`: `GalleryHandle.paint()`, `panelPose`/`panelWindow`, imperative panel positioning, dependency-less `useLayoutEffect`.
- `src/app/redesign/ClosingSequence.tsx`, `EnquiryForm.tsx`, `ClientNotes.tsx`, `closing.module.css`: third scroll engine, WAAPI testimonial transitions, IntersectionObserver.
- `src/app/redesign/page.tsx`, `study-game.module.css`, `StudyGame.tsx`, `quiz-data.ts`: route entry (noindex), quiz.
- `src/app/api/contact/route.ts`, `src/lib/email.ts`: uncommitted phone/validation refactor.
- `docs/features/DesktopHeroRedesign.md`: design intent, measurements, no-dependency constraint.
- `docs/redesign-review/*.cjs`: Playwright verification harness — defines which `data-*` attrs are load-bearing.
- `.pi/takomi/subagent-conversations/*/run-0/session.jsonl`: authorship evidence (`openai-codex` / `gpt-6.1-sol`).
- `.pi/takomi/orchestrator/orch-20261002-021041.json`: session `mode:"hybrid"`, tasks `source-contract`, `approved-visuals`, `game-component`, `transition`, `verify-record`.
- `public/redesign/`: 25.6 MB of assets (`nifemi.mp4`, `tablet-scene-v1.png`, `team-cutouts/*.webp`).
- `package.json`: dependency baseline (confirms no animation libs added).

Context compacted
The review is complete. No pending next steps from it.

The obvious follow-on is applying the ranked fixes. I'd want your call before touching code, since items 1–4 are behavior-preserving perf work but items 5–6 touch the `data-*` attributes your Playwright harness reads, and item 8 changes shipped assets.