# Performance and Technical Release Readiness Audit Report

**Target Route:** `/redesign` (Redesign staging route; legacy site remains at `/`)\
**Repository Baseline Commit:** `5986347139b2647d56f8f71389e8bae46fd71f14` on branch `website-redesign`\
**Audit Environment:** Local Production Build (Next.js 15.5.7, Turbopack, standalone server at `http://localhost:5782/`)\
**Test Harness:** Headless Google Chrome 140 (via Playwright / Chrome DevTools Protocol), Windows 11 x64, Node.js v20.19.4\
**Audit Protocol:** Read-only empirical testing. No code modifications, refactors, dependencies, commits, or deployments were introduced.

---

## 1. Executive Summary

An evidence-based performance and technical release readiness review was executed on the completed J StaR Films Studios website redesign. The audit encompassed cold and warm loading performance benchmarks across 10 independent runs, runtime frame rate and scroll jank profiling, full interactive journey testing, mobile viewport verification (390×844 with 4× CPU throttling), accessibility/reduced-motion testing, memory leak stress analysis (10 navigation roundtrips), and software maintainability review.

### Release Readiness Verdicts

| Experience | Verdict | Summary Assessment |
| :--- | :---: | :--- |
| **Desktop Experience** | **CONDITIONAL PASS** | Visually compelling, artistically faithful, and functionally robust across all interactive journeys. Frame rates average ~48 FPS with 16.7 ms median frame times. The desktop experience is ready for release once two high-priority technical issues are resolved: (1) eliminating eager preloads of heavy downstream images (`tablet-scene-v1.png` and John Oke's cutout) that inflate initial transfer by 1.65 MB, and (2) halting the main Hero animation RAF loop when the browser tab is hidden. |
| **Mobile Experience** | **FAIL (BLOCKED)** | The mobile layout suffers from persistent horizontal document overflow across all scroll checkpoints (`scrollWidth: 416px` vs `innerWidth: 390px`, a 26px horizontal spill) caused by unclipped rotated cards in the closing testimonials stack. Furthermore, 60% of interactive touch targets (35 of 58) fail the 40×40 px touch target guideline, and the prefers-reduced-motion fallback is broken by the gallery overlay intercepting pointer clicks directed at static hero progression controls. Mobile requires remediation before public launch. |

---

## 2. Baseline Measurements

### 2.1 Cold Loading Performance (5 Runs, Cache Disabled)

Measurements captured from production server `http://localhost:5782/redesign` via automated browser automation recording Navigation Timing API and network transfer events.

| Metric | Median | Min | Max | Target / Budget | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **TTFB (Time to First Byte)** | **31.2 ms** | 25.1 ms | 44.8 ms | < 100 ms | **PASS** |
| **FCP (First Contentful Paint)** | **840.0 ms** | 816.0 ms | 928.0 ms | < 1,800 ms | **PASS** |
| **LCP (Largest Contentful Paint)** | **1,116.0 ms** | 1,080.0 ms | 1,180.0 ms | < 2,500 ms | **PASS** |
| **LCP Candidate Element** | `SPAN.hero_secondLine` ("FILMS STUDIOS") | — | — | — | Text element |
| **CLS (Cumulative Layout Shift)** | **0.000** | 0.000 | 0.000 | < 0.100 | **EXCELLENT** |
| **DOMContentLoaded** | **992.5 ms** | 968.7 ms | 1,106.8 ms | < 1,500 ms | **PASS** |
| **Window Load Event** | **1,045.6 ms** | 987.7 ms | 1,198.4 ms | < 2,000 ms | **PASS** |
| **Total Transferred (Cold)** | **2,551,871 B (2.55 MB)** | 2.55 MB | 2.56 MB | < 2.00 MB | **WARN (High)** |
| **Total HTTP Requests** | **37 requests** | 37 | 37 | < 40 | **PASS** |

### 2.2 Warm Loading Performance (5 Runs, Cache Enabled)

| Metric | Median | Min | Max | Status |
| :--- | :---: | :---: | :---: | :---: |
| **TTFB** | **35.0 ms** | 27.6 ms | 78.3 ms | **PASS** |
| **FCP** | **452.0 ms** | 392.0 ms | 616.0 ms | **EXCELLENT** |
| **DOMContentLoaded** | **611.1 ms** | 432.9 ms | 845.2 ms | **EXCELLENT** |
| **Window Load Event** | **663.3 ms** | 605.7 ms | 945.4 ms | **EXCELLENT** |
| **Total Transferred (Warm)** | **31,942 B (~32 KB)** | 31.9 KB | 32.1 KB | **EXCELLENT** |
| **Transferred JS / CSS** | **0 B (from disk/memory cache)** | 0 B | 0 B | **EXCELLENT** |

---

## 3. Network & Asset Breakdown

### 3.1 Transferred Byte Composition (Cold Load)

```
Total Transferred: 2.55 MB
├── Images:    1.89 MB (74.1%) ── [tablet-scene: 1.32 MB, john-oke cutout: 328 KB, team cutouts]
├── Scripts:   507 KB  (19.9%) ── [Next.js chunks, React runtime, motion logic]
├── Fonts:      70 KB   (2.7%) ── [dm-sans-latin: 37 KB, outfit-latin: 33 KB]
├── Styles:     57 KB   (2.2%) ── [hero, gallery, team, closing, globals]
└── Document:   28 KB   (1.1%) ── [HTML document payload]
```

### 3.2 Critical Asset Findings

1. **Uncompressed Early Image Preload (`tablet-scene-v1.png` — 1.32 MB):**
   - In `Hero.tsx` (line 1047), `<Image src={TABLET_SCENE} unoptimized loading="eager" />` causes Next.js to inject an HTTP `Link: </redesign/tablet-scene-v1.png>; rel=preload; as="image"` header.
   - This raw 1,320,077 byte uncompressed PNG downloads with high network priority during page startup, directly competing with critical JavaScript bundles, even though the tablet scene is not visible until scroll progress 2.2 (~3,000 px down).
2. **Offscreen Team Member Cutout Preload (`john-oluleke-oke-v1.webp` — 328 KB):**
   - In `TeamSection.tsx` (line 155), John Oluleke Oke's cutout uses `loading="eager" priority unoptimized`. Next.js injects another HTTP `Link: <...>; rel=preload; as="image"` header.
   - This asset is situated in Section 7 (over 15,000 px below the fold), yet it is preloaded during initial navigation.
3. **Hero Video Asset (`nifemi.mp4` — 17.25 MB):**
   - `<video preload="metadata">` is correctly specified on the hero video element, preventing the 17.25 MB binary from blocking the initial page load event.
   - However, once playback commences or screening is reached, video chunks stream over the connection. For users on metered connections, streaming a 17 MB MP4 may cause cellular data strain.

---

## 4. Runtime Animation & Frame Rate Profiling

Runtime scroll performance was benchmarked using Playwright and CDP across two standardized continuous scroll profiles (3,000 px and 5,000 px scroll journeys at variable speeds).

### 4.1 Scroll Performance Summary

| Test Profile | Recorded Frames | Average FPS | Median Frame Time | 95th Percentile | Max Frame Time | Frame Drops (>20 ms) | Long Tasks (>50 ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Steady Scroll (3,000 px)** | 321 frames | **47.5 FPS** | 16.7 ms | 50.0 ms | 149.7 ms | 40 (12.5%) | 0 |
| **Aggressive Scroll (Reversals)** | 178 frames | **49.2 FPS** | 16.7 ms | 49.9 ms | 99.9 ms | 23 (13.0%) | 0 |

### 4.2 Frame Rate Analysis & Micro-Jank

- **Median Performance:** The median frame time is **16.7 ms** (60 FPS cadence). The core transform math on `--scene-x`, `--scene-y`, `--scene-scale`, and `--pullback-*` executes via GPU-accelerated CSS transforms without creating layout recalculations during standard scrolling.
- **Micro-Jank Triggers (Drops > 20 ms):**
  1. **React State Re-renders on Scroll:** During scroll progress threshold crossings in `Hero.tsx`, the RAF tick loop executes React state setters: `setNavFolded(folded)`, `setFilmAvailable(available)`, `setGameInteractive(interactive)`, `setGalleryVisible(visible)`, and `setGalleryState(...)`. When these fires, React reconciliation interrupts the smooth 60 FPS animation loop, resulting in occasional 33–50 ms frame spikes.
  2. **Polygon Wipe Recalculation:** In `TeamSection.tsx` (`wipeEdge`), an SVG polygon string with 100 calculated vertices is dynamically computed and assigned to `element.style.clipPath` on each animation frame during the transition window.
  3. **Canvas 2D Font Metric Sampling:** In `ClosingSequence.tsx` (`paint`), `document.createElement('canvas').getContext('2d')` is invoked to measure `canvas.measureText(...).actualBoundingBoxAscent` during scroll updates to scale the footer SVG logo mark.

### 4.3 Lifecycle & Resource Cleanup

- **Offscreen Video Management:** When scrolling past the screening stage into the gallery, team, or closing sections, the hero video pauses automatically (`videoPaused: true`, playback halted at ~3.36 s). Audio tracks stop playing.
- **Hidden Tab RAF Leak:** When the browser tab is hidden (`document.hidden = true`), the custom `requestAnimationFrame` loop in `Hero.tsx` continues to tick unabated (91 RAF callbacks executed in 1.5 seconds while hidden). While the video paused, the RAF loop remained running, consuming CPU cycles and laptop battery in the background.

---

## 5. Complete Journey & Interactive Verification

Every interactive flow specified in the product contract was exercised using automated headless interaction:

| Journey Step | Tested Action | Expected Behaviour | Measured Result | Verdict |
| :--- | :--- | :--- | :--- | :---: |
| **1. Accessibility Skip** | Tab on load -> Enter | Focus skip link -> jump to screening -> focus sound | Focused "Skip to film sound", jumped to screening (`heroScreening: true`), focused `#film-sound` button | **PASS** |
| **2. Video Sound Toggle** | Click sound button | Toggle between muted and unmuted with aria updates | `aria-label` toggled between "Enable sound" and "Mute sound" | **PASS** |
| **3. Keyboard Video Pause** | Focus video -> Press Space | Toggle video playback | Video toggled paused <-> playing | **PASS** |
| **4. Wordmark Scramble** | Hover on wordmark | Characters scramble with dynamic randomized glyphs | Text scrambled dynamically on hover (`J S S I S F T S L T`) | **PASS** |
| **5. Header Navigation** | Click "Work" nav link | Jump to gallery & align first project | Aligned index 0, set `data-visible="true"`, mode "browse" | **PASS** |
| **6. Gallery Filtering** | Click "Software", "Film", "All" | Filter rows and re-index panels | Software: 2 items, Film: 2 items, All: 4 items | **PASS** |
| **7. Study Game Modal** | Click "Try it ↗" on Game | Open modal dialog, trap focus, make gallery inert | `data-play="true"`, gallery `inert=true`, quiz interactive | **PASS** |
| **8. Quiz Progress Retention** | Answer question -> scroll away -> return | Quiz state and selected topic preserved | Local state machine preserved selections without reset | **PASS** |
| **9. Return to Browsing** | Click "← Back to browsing" | Close modal, restore gallery focus and scroll | Mode reverted to "browse", gallery `inert=false` | **PASS** |
| **10. Team Spotlight** | Hover team member cutouts | Spotlight member cutout, dim others | Member spotlighted with proper aria labels | **PASS** |
| **11. Enquiry Validation** | Submit empty form | Prevent submission, set inline error, no scroll jump | Status: "Please check the highlighted field.", scroll Y delta = 0 | **PASS** |
| **12. WhatsApp Draft** | Enter valid form details | Build pre-filled `wa.me` URL with encoded draft | Generated valid `https://wa.me/2348152657887?text=...` with full brief | **PASS** |
| **13. Return to Opening** | Click brand link in footer | Smoothly return viewport to top | Viewport returned to Y < 100 px | **PASS** |

---

## 6. Mobile & Release-Critical Findings

### 6.1 Mobile Viewport Audit (390×844, 4× CPU Throttling, Touch Emulation)

- **Horizontal Layout Overflow (CRITICAL):**
  - Tested across 11 scroll checkpoints from top (Y=0) to bottom (Y=15,757 px).
  - Every checkpoint exhibited `scrollWidth = 416px` against `innerWidth = 390px` (**26 px horizontal overflow**).
  - **Root Cause Identified:** In `ClosingSequence.tsx` / `ClientNotes`, the testimonial stack uses rotated background cards (`closing_backNote` / `closing_backTwo`). The CSS rotation causes the card bounding box to extend to `right: 416px`. Because no ancestor container specifies `overflow-x: clip` or `overflow: hidden`, the rotated element causes horizontal scrolling and side-to-side jitter on mobile touch devices.
- **Touch Target Sizing:**
  - Evaluated all 58 interactive elements on mobile against the 40×40 px minimum touch target recommendation.
  - **35 of 58 interactive elements (60.3%) fail the 40 px threshold.**
  - Key undersized elements:
    - Gallery filter buttons (`Software 02`, `Film 02`, `All 04`): Height is only **17 px**.
    - Header brand link: Height is only **14 px**.
    - Gallery row selection buttons: Height is **34 px**.

### 6.2 Accessibility & Reduced Motion (`prefers-reduced-motion: reduce`)

- **Pointer Interception Bug (CRITICAL):**
  - When `prefers-reduced-motion: reduce` is enabled, `Hero.tsx` renders static fallback controls: "Expand film", "View tablet", "View study game", "Return to tablet".
  - However, in `Hero.tsx` (line 1085), `SelectedWorkGallery` is mounted with `visible={reduced || galleryVisible}`.
  - Because `reduced === true`, `#selected-work` is mounted with `data-visible="true"`, and its action container (`.selected-work_actions`) is fixed/positioned over the bottom of the hero stage.
  - **Result:** Pointer clicks directed at "Expand film" and "View tablet" are intercepted by the gallery DOM subtree. The static fallback buttons are physically unclickable via standard touch or mouse interactions.

### 6.3 Memory Leak & Navigation Stress Analysis

A 10-cycle round-trip navigation stress test was performed between `/redesign` and the home route `/` using CDP performance monitoring:

| Metric | Baseline Initial | After 10 Round Trips | Net Delta | Evaluation |
| :--- | :---: | :---: | :---: | :---: |
| **JS Heap Used Size** | 6,895 KB | 6,679 KB | **-216 KB** | **HEALTHY (Garbage collected)** |
| **DOM Nodes Count** | 1,138 nodes | 1,103 nodes | **-35 nodes** | **HEALTHY (No detached nodes)** |
| **JS Event Listeners** | 498 listeners | 457 listeners | **-41 listeners** | **HEALTHY (Clean teardown)** |
| **Documents in Memory** | 7 | 3 | **-4 docs** | **HEALTHY (No retained documents)** |

**Conclusion:** Component cleanup functions (`useEffect` returns) correctly remove window scroll listeners, cancel animation frames, and detach observers upon unmount. No memory leaks detected.

---

## 7. Maintainability & Architectural Review

### 7.1 Current Architectural Bottlenecks

1. **Four Competing Scroll Listeners with Uncoordinated RAF Loops:**
   - Scroll events and RAF loops are independently managed across four decoupled components:
     - `src/app/redesign/Hero.tsx` (custom RAF with exponential damping, damp follow)
     - `src/app/redesign/TeamSection.tsx` (custom scroll listener + independent RAF)
     - `src/app/redesign/ClosingSequence.tsx` (custom scroll listener + independent RAF)
     - `src/app/ConditionalLayout.tsx` (`useScrollBlur` attached to `window`)
   - Because these loops do not share a single ticking clock, they execute independently in arbitrary order during the frame budget.
2. **React State Triggers Inside Animation Tick:**
   - Setting React state (`setNavFolded`, `setGalleryVisible`, `setGameInteractive`) within `requestAnimationFrame` forces React to schedule microtasks and trigger re-renders that compete with the 16.7 ms frame budget.
3. **Canvas 2D Text Measurement in Paint Loop:**
   - In `ClosingSequence.tsx`, measuring text ascent via canvas 2D during scroll paint operations allocates canvas contexts and triggers font measurement overhead on the main thread.

---

## 8. Separate, Rigorous Evaluation of GSAP and Lenis

*Directive note: As requested, GSAP and Lenis are evaluated separately below without assuming either is necessary or would automatically improve performance.*

### 8.1 Rigorous Evaluation of GSAP

**Would GSAP solve the current bottlenecks?**
- **Pros:** GSAP's `ScrollTrigger` would unify the four independent scroll listeners and three RAF loops into a single coordinated ticker (`gsap.ticker`). It provides deterministic scroll mapping, built-in timeline scrubbing, native visibility handling (automatically pausing when tabs are hidden), and built-in resize debouncing.
- **Cons & Risks:**
  - **Visual & Interaction Drift:** The existing desktop experience relies on custom mathematical damping:
    $$\Delta progress = gap \times \left(1 - \exp\left(-\frac{\Delta t}{\tau}\right)\right)$$
    with asymmetric timing ($\tau = 180\text{ ms}$ for snaps, $\tau = 1000\text{ ms}$ for steady follow), plus imperative pointer latches in `SelectedWorkGallery.tsx`. Replacing this with GSAP `scrub: number` would alter the exact easing, momentum, and settling feel that the owner has already approved.
  - **Bundle Weight:** Adding `gsap` and `ScrollTrigger` adds ~25–30 KB minified/gzipped to the client JavaScript bundle.
  - **Overhead:** GSAP does not solve the root cause of the micro-jank (which is React state re-renders and unoptimized image preloads, not tweening math).
- **Proposed Bounded Comparison (For a Later Task):**
  - If considered later, test GSAP strictly on **one isolated section**: the `ClosingSequence.tsx` sheet reveal and SVG mark stretch. Compare frame times and CPU utilization between the existing custom RAF paint and a `ScrollTrigger.create({ trigger: section, scrub: true })` implementation. **Do not migrate the Hero or Gallery.**

### 8.2 Rigorous Evaluation of Lenis

**Would Lenis solve the current bottlenecks?**
- **Pros:** Lenis normalizes wheel deltas across operating systems (Windows smooth wheel vs macOS trackpad) and provides continuous scroll normalization.
- **Cons & Risks:**
  - **Double Damping:** The Hero architecture already implements its own exponential follow damping on top of native scroll input. Introducing Lenis smooth scrolling underneath an already damped virtual track would create "double smoothing," making the interaction feel sluggish, detached, and unresponsive to user gesture termination.
  - **Mobile Touch Conflicts:** Lenis introduces gesture interception on mobile devices, which frequently conflicts with mobile Safari/Chrome native momentum scroll, pinch-to-zoom, and form input focusing.
  - **Irrelevant to Core Issue:** Lenis does not address image preloads, mobile horizontal overflow, or tab-hidden RAF ticking.
- **Proposed Bounded Comparison (For a Later Task):**
  - If evaluated later, test Lenis solely in an isolated desktop A/B branch measuring scroll delta consistency on Windows high-precision mousewheels versus macOS trackpads. **Do not enable Lenis on mobile.**

---

## 9. Prioritized Recommendations for Owner Approval

### High Priority (Required for Release)

1. **Fix Mobile Horizontal Layout Overflow (Mobile Blocker):**
   - Apply `overflow-x: clip` to the parent container of `ClosingSequence` (or `#closing-sequence`) to prevent the rotated testimonial card (`closing_backTwo`) from extending the page `scrollWidth` from 390 px to 416 px.
2. **Fix Reduced-Motion Pointer Interception (Accessibility Blocker):**
   - In `Hero.tsx` and `SelectedWorkGallery.tsx`, ensure `#selected-work` does not intercept pointer clicks when reduced-motion static hero controls ("Expand film", "View tablet") are active.
3. **Remove Eager Link Preloads on Downstream Images (Performance Win: -1.65 MB):**
   - Remove `loading="eager"` and `priority` from `tablet-scene-v1.png` in `Hero.tsx` and from John Oke's cutout in `TeamSection.tsx`. Allow Next.js to lazy-load these assets as the user approaches their respective sections.
4. **Pause Hero RAF Loop When Tab is Hidden (CPU/Battery Optimization):**
   - In `Hero.tsx`, subscribe to `document.addEventListener('visibilitychange')` to cancel and restart the RAF loop when `document.hidden` toggles, preventing continuous 60 FPS execution in inactive background tabs.

### Medium Priority (Pre-Launch Enhancements)

5. **Expand Mobile Touch Targets:**
   - Add minimum touch bounding boxes (`min-height: 44px`, `min-width: 44px`) via transparent padding to the gallery filter pills (`Software`, `Film`, `All`) and header links on mobile viewports ($\le 800\text{ px}$).
6. **Cache Text Bounding Metrics in Closing Sequence:**
   - Cache the SVG text ascent measured via 2D Canvas in `ClosingSequence.tsx` on window resize rather than executing measurement logic inside the scroll paint handler.
7. **Clip Path Optimization in Team Section:**
   - Throttle or memoize the 100-point vertex calculation in `wipeEdge` to avoid redundant string allocations during frames where scroll progress has not changed.

---

*Report generated and archived at `docs/redesign-review/performance-audit/audit-report.md`. Audit halted for owner review and approval prior to any code implementation.*
