Here's the review.

## What's on this branch

`website-redesign` adds a full redesign route: a ~800-line scroll-driven `Hero.tsx` (film → tablet pullback → study game → gallery), `StudyGame.tsx` (quiz), `TeamSection.tsx`, `ClosingSequence.tsx` + `EnquiryForm`, all driven by **hand-rolled rAF + scroll math + CSS custom properties** — no GSAP, no Lenis. The only animation lib in `package.json` is `motion`, and the new code doesn't use it.

## Performance: the good

- **Idle cost is ~zero.** Each engine only runs rAF while `progress !== target` or a panel is moving; at rest `frame = 0`. No persistent loops.
- **Reduced-motion path is fully static** — no rAF, no blur, no sticky scroll. Most sites never bother; excellent.
- **Media is lazy and gated.** `FilmPreview` only sets `src` when eligible, `preload="none"`, frees on unmount; viewer `<video>` strips its src on `visibilitychange`; hero film uses `preload="metadata"`.
- **React re-renders are minimized** — scroll state lives in refs and CSS vars; `updateGallery` early-returns on identical state; `panelWindow` limits panel transforms to ~4 nodes.
- **A11y is thorough** — inert management on siblings, focus traps, dialog/popover mode switching.

## Performance: concerns / gains

1. **Layout thrash per scroll frame.** `TeamSection` writes `element.style.height` and `marginTop`, then reads `getBoundingClientRect()` in the same paint; `ClosingSequence` writes `marginTop`/`--reveal-distance` then reads rects. Cache measurements on resize instead. (`TeamSection.tsx:60-70`, `ClosingSequence.tsx:31-40`)
2. **`filter: blur(var(--motion-blur))`** on the wordmark lines *and* the large `.filmFrame` video — a full filter layer repainted every scroll frame, and `blur(0px)` still allocates the layer. Only apply when `blur > 0`, and never to the video element. (`hero.module.css:67,83`)
3. **Three duplicated scroll engines** (Hero, Team, Closing) each with their own scroll listener, rAF, easing, and `getBoundingClientRect`. One shared hook/clock — or ScrollTrigger — would remove a whole class of divergence bugs.
4. **~15–20 `style.setProperty` calls per frame** on the root; fine on desktop, but a single wrapper `transform` would be cheaper on mobile.
5. **Asset weight.** `nifemi.mp4` is 17 MB, `tablet-scene-v1.png` is 1.3 MB loaded `unoptimized`, and 8 team cutouts at ~400 KB each (~3.2 MB) land eagerly. AVIF cutouts and a poster/fetchpriority strategy are the cheapest wins.

## GSAP/Lenis: should they have used them?

Defensible either way:

- **For hand-rolled:** zero dependency weight, full control over the exact easing/lerp behavior, native scroll preserved (Lenis hijacks it — gesture conflicts, accessibility/SEO friction, and their `scrollTo({behavior:'instant'})` alignment jumps would need Lenis's API anyway). The smoothing they need is a simple exponential follow.
- **Against:** they've re-implemented ScrollTrigger. The magic numbers (`4.3`, `height * 2.7`, tail math in `trackSize`) are a pin/scrub system written by hand. GSAP ScrollTrigger would give pinning, scrub, resize recalculation, and velocity blur that someone else maintains. Hero.tsx alone is 806 lines — hard to maintain, hard to retune. Lenis would replace their exp-follow lerp and unify the three engines' clocks.

Net: for a one-off localized demo page it's acceptable; as production marketing code I'd push for ScrollTrigger + a shared scroll hook, or at minimum extract the duplicated engine into one place.

## Engineer or AI?

**AI, confidently.** Evidence is in the repo itself: `.pi/takomi/subagent-conversations/` (coder/reviewer/worker run logs), `docs/tasks/orchestrator-sessions/`, generated verification PNGs/JSON, and `docs/features/*.md` written per component. The style confirms it: exhaustive intent-explaining comments, uniform patterns across all four components, over-complete accessibility/reduced-motion coverage, and the same scroll engine copy-pasted (with magic constants) into three files rather than refactored — the classic per-task AI generation pattern.

**Best guess at the model:** a Claude Sonnet 4.x / Opus 4.x through the Takomi multi-agent orchestrator. The reasoning, comment style, and a11y zeal are most consistent with that. It *could* be a GPT-5-class model — the repo wires up both Anthropic and Google — but the orchestration logs point to a Claude-family backbone more often than not.

## Bottom line

Strong craft for an AI-built page: idle-friendly rAF, static reduced-motion, lazy media, disciplined refs-over-state. The real costs are the hand-rolled triplicated scroll engine, layout thrash in Team/Closing, the blur filter on the video frame, and ~21 MB of hero media. GSAP/Lenis would trade ~800 lines of bespoke math for a maintained abstraction — worth it if this becomes the production homepage, not worth it for a throwaway review route.