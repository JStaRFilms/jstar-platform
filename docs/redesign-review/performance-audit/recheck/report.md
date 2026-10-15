# J StaR performance and release audit

Audit completed 9 October 2026. Application code, assets, animation timing and dependencies remain unchanged. No commit, deployment, real enquiry or WhatsApp message was made.

## Verdict

**Desktop:** The normal-motion journey works in the tested Chrome production build. Do not release it as fully ready yet. Reduced-motion users cannot reach the tablet through its pointer controls, and resizing while editing an enquiry can send them back to the gallery. Runtime performance varies substantially, so this audit does not certify consistently smooth playback on every desktop.

**Mobile:** Not ready for sign-off. Touch navigation, filtering and playable mode work at 390 × 844, but reduced-motion controls fail, the enquiry loses focus on a height change, and the throttled opening/tablet journey has substantial main-thread stalls. No real phone or Safari was available. The earlier horizontal-scroll blocker was not reproduced.

## Baseline and reproduction

- Commit `5986347139b2647d56f8f71389e8bae46fd71f14`, branch `website-redesign`.
- The completed experience is at `/redesign`. `/` still renders the older homepage. See `src/app/redesign/page.tsx:15` and `src/app/page.tsx`.
- Initial Git status included a modified `docs/redesign-review/verify-tablet.cjs` and untracked review/reference files. No tracked application/configuration changes were present. `baseline.json` preserves the full status and source hashes. `completion-baseline.json` confirms those source hashes still match and records asset hashes.
- Isolated production build in `build-workspace`, with copies of source/configuration and junctions to existing dependencies/assets. Next.js 15.5.7, Node 24.16.0, Windows, AMD Ryzen 5 4600H, 6 cores/12 threads. Production server used `127.0.0.1:5893`. The existing server on 5782 was left intact.
- `build.log` records successful compilation, type-check stage, page generation and build completion. **Lint did not pass.** `build.err.log` records a missing `eslint-plugin-react-hooks` in the isolated workspace. Workspace-root inference warnings also occurred. These do not invalidate the served production artifact, but this audit provides no clean lint result.
- Headless Google Chrome `154.0.8037.98` through Playwright/CDP. Desktop 1440 × 900 at device scale 1. Resize samples used 1920 × 1080 and 1440 × 640. Mobile loading used 390 × 844 at scale 2, touch/mobile emulation, 4× CPU slowdown, 150 ms network latency, 1.6 Mbps download and 0.75 Mbps upload. Also sampled 320 × 640 and a 390 × 500 height change.
- No physical device was available in the device inventory. An unbooted Android emulator was available but not used. Emulated touch and CPU slowdown do not reproduce a phone GPU, browser chrome, software keyboard or thermal behaviour.
- Three fresh-context first loads and three reloads per profile. Each transfer window ends 10 seconds after DOMContentLoaded. Incomplete media/images count bytes received so far, not their full file sizes. Mobile reloads can finish an asset that the preceding first-load window did not finish; they are not a fully populated-cache benchmark.
- Three untraced runs per desktop scroll profile. Slow scrolling used 160 wheel increments across the page with 60 ms waits. Aggressive scrolling used large jumps, direction reversals and returns to the top. Separate traces followed those runs. There was no Lighthouse run, real-user field measurement or INP measurement.
- The machine was not otherwise idle. The large spread and improving successive runtime samples limit comparisons. Headless RAF intervals measure callback cadence, not physical display FPS.

To reproduce against the saved build, from the repository root:

```sh
node docs/redesign-review/performance-audit/recheck/run-suite.cjs measure-clean
node docs/redesign-review/performance-audit/recheck/run-suite.cjs release-check mobile-lifecycle
node docs/redesign-review/performance-audit/recheck/run-suite.cjs section-traces
```

Run one suite at a time. The runner keeps its server alive and stops it in `finally`. Initial launch attempts failed before the server became ready; their empty results are not measurements. The isolated workspace contains links to local environment files and dependencies. Do not distribute it as evidence. Share the report, JSON results, screenshots and compressed traces instead.

## Loading measurements

Values are median, followed by minimum to maximum. All are local production **lab** results. Local TTFB excludes WAN latency.

| Metric | Desktop first load | Desktop reload | Mobile first load | Mobile reload |
| --- | --- | --- | --- | --- |
| Local server TTFB | 44 ms, 24.9 to 45.2 | 25.8 ms, 20.4 to 29.3 | 24.9 ms, 18.4 to 49 | 20.3 ms, 16.8 to 26.4 |
| FCP | 472 ms, 404 to 2572 | 108 ms, 100 to 152 | 2128 ms, 2028 to 2304 | 620 ms, 468 to 752 |
| Observed LCP | 472 ms, 404 to 2572 | 108 ms, 100 to 152 | 2128 ms, 2028 to 2304 | 620 ms, 468 to 752 |
| CLS in loading window | 0, all runs | 0, all runs | 0, all runs | 0, all runs |
| Transfer in window | 2.524 MB, all runs | 30.7 KB, all runs | 2.348 MB, 2.339 to 2.360 | 301.8 KB, 300.3 to 321.3 |

The desktop LCP candidate was the `Studios` text span. This is an initial-viewport measurement, not a timing metric for film, tablet or enquiry readiness. Evidence is `clean-measurements.json`; observers collect buffered LCP and session-window CLS before user interaction.

A representative desktop first load transferred 510,253 bytes of JavaScript, 1,889,854 bytes of images, 70,065 bytes of fonts and 25,801 bytes of CSS. The build's 137 KB “First Load JS” estimate is a different measure, not the browser transfer total.

The tablet image and founder cutout request started around 63 ms, alongside JavaScript at 67 ms, before the user entered either section. CDP recorded **Low** initial priority, not a verified high-priority preload. The two local WOFF2 files use `font-display: swap` in `study-game.module.css:1-15`. Loading CLS stayed zero; no font-driven layout jump was observed.

`assets.json` records dimensions, codecs and MP4 atoms. The tablet PNG is opaque RGB, 1672 × 941 and 1,319,653 file bytes. Team cutouts have alpha and total 3.61 MB for the eight current files. Preserve their transparency. The largest is Ifechukwude's 1254 × 1254 WebP at 850,984 bytes. Hero film is H.264/AAC, 1280 × 720, 26.602 seconds, 17.25 MB and approximately 5.19 Mbps. Both gallery excerpts have front-loaded `moov` atoms, as does the hero film. Preview sources attach only when eligible and detach offscreen. The hero uses metadata preload, not a verified full-film eager download.

## Runtime measurements and attribution

| Untraced desktop profile | Per-run p95 RAF interval, median and range | Intervals over 33.34 ms, median and range | Long-task count, median and range |
| --- | --- | --- | --- |
| Slow full journey | 83.3 ms, 33.6 to 133.4 | 13.3%, 8.1 to 20.9 | 18, 3 to 41 |
| Aggressive/reversing | 50.0 ms, 49.9 to 100.1 | 11.4%, 10.2 to 19.2 | 1, 0 to 11 |

The full-journey slow trace contains 5.416 seconds of `UpdateLayoutTree`, versus 0.402 seconds of layout and 0.376 seconds of paint. These event durations overlap other events and must not be added into a CPU total. Raster work ran on other threads. This evidence does not establish React rendering as the primary bottleneck.

Short, **single-run traced** section probes help locate the cost. They are not additional repeated baselines. They used eight small wheel increments followed by settling. Section probes used device scale 1; mobile probes used 4× CPU slowdown but unthrottled network to reduce delivery confounding.

| Section | Desktop p95 interval | Mobile p95 interval | Mobile longest style update | Mobile long tasks |
| --- | --- | --- | --- | --- |
| Hero/film | 16.8 ms | 66.7 ms | 64.5 ms | 33 |
| Tablet/game transition | 33.3 ms | 150.0 ms | 137.0 ms | 32 |
| Gallery | 33.4 ms | 66.6 ms | 50.5 ms | 17 |
| Team | 16.9 ms | 33.3 ms | 5.6 ms | 3 |
| Closing | 16.8 ms | 16.8 ms | 27.4 ms | 2 |

`section-traces.json` identifies the renderer main thread and each compressed trace. In the mobile tablet probe, repeated style updates involved 347 elements and consumed 2.672 seconds across the sample. Hero video reported zero dropped frames in that probe. The confirmed delay is main-thread style work, not evidence of a decoder bottleneck. The separate throttled touch journey did record some video drops, so media delivery/rendering remains a secondary consideration.

Hero's 1000 ms follow and faster 180 ms gallery/fast-travel follow are deliberate, `Hero.tsx:558-562`. Time spent following an input after scrolling stops is not itself a bug. The long tasks above are distinct browser work. No follow constants or transitions were changed.

## Confirmed findings, ranked by impact

### 1. Reduced-motion tablet controls receive gallery hits

**Release blocker for both viewport sizes.** With reduced motion enabled, load `/redesign`, click “Expand film”, then “View tablet”. The second control is visible and enabled but pointer input hits gallery actions on desktop or its wash on mobile. The static journey cannot continue by pointer.

Evidence: `mobile-lifecycle.json`, tests “reduced motion 1440” and “reduced motion 390”, with screenshots `mobile-fail-5.png` and `mobile-fail-6.png`. The failure is pointer interception, not unavailable media or a forced-click test.

Source: `Hero.tsx:1054-1067,1083-1086`, `selected-work.module.css:1-11,52-58,102-105`. The gallery is visible in reduced mode while its positioning overlaps the static controls after expansion.

Smallest proposed fix: correct reduced-mode positioning/stacking or pointer eligibility so the gallery does not cover active hero controls. Keep normal-motion CSS and timing unchanged. Test pointer, keyboard and touch through all static stages. Risk is low if confined to reduced mode; disabling all gallery input would be an incorrect fix.

### 2. Height changes during enquiry editing jump back to work

**Release blocker for resize behaviour; real keyboard impact remains unverified.** At 390 × 844, use “Start a Project”, tap email, then change the viewport to 390 × 500. Scroll moves from 13,681 to 4030, email loses focus, and its enclosing content becomes inert. Email ends 4558 px below the viewport. This is a lost interaction, not chosen easing.

Evidence: `release-check.json`, “mobile form resize focus displacement”, and `mobile-resize-recheck.png`. `mobile-lifecycle.json` reproduced displacement during a separate resize sequence.

Source: `Hero.tsx:644-664`. `wasBrowsing` tests only `target > 4.3`; that remains true after leaving the gallery. A height change calls `align`, which scrolls back to a committed project. Closing then makes the displaced form inert, `ClosingSequence.tsx:52-54`.

Smallest proposed fix: preserve gallery alignment on resize only while actually within its browsing interval. Outside it, recompute geometry without calling the gallery scroll action. Preserve focused enquiry controls and check height changes, rotation and a real software keyboard. Risk is medium because gallery resize alignment is intentional and must still work.

### 3. Opening/tablet style work exceeds the mobile frame budget

**Worthwhile performance fix; blocks a confident mobile performance sign-off.** Repeat the section probes and throttled touch journey. The tablet probe has 150 ms p95 intervals and style updates reaching 137 ms under 4× CPU slowdown. Closing/team samples are substantially cheaper.

Evidence: `section-mobile-tablet-game.json.gz`, `section-traces.json`, `clean-measurements.json` and `mobile-lifecycle.json`. Desktop degradation has high variability; no universal desktop FPS claim is justified.

Source: `Hero.tsx:420-546` writes many inherited custom properties, then reads section geometry at line 504. `SelectedWorkGallery.tsx:109-142` writes gallery variables and then reads row geometry at line 128. `ClosingSequence.tsx:41-80` also mixes writes with geometry reads. This ordering can force style/layout synchronisation. The traces confirm expensive style updates, but do not isolate the exact contribution of every write or component.

Smallest proposed next comparison: retain all progress math and output poses, cache row dimensions at resize and collect necessary geometry before writes. Then measure the same probes. Do not refactor every scroll owner or assume every property needs caching. Risk is medium; stale dimensions can break responsive panel alignment. Validate screenshots and reversing/settling behaviour against this baseline.

### 4. Downstream images compete with first-load resources

**Worthwhile loading fix, not a proven desktop release blocker.** Load with an empty cache and stay at the opening. Tablet and founder requests still start almost immediately. Together they transfer about 1.65 MB on desktop before those sections are visited.

Evidence: resource waterfall in `clean-measurements.json`; file data in `assets.json`.

Source: `Hero.tsx:1049-1050`, `TeamSection.tsx:287`. Both use unoptimized eager images. The tablet is also a readiness dependency, `Hero.tsx:756-772`.

Smallest proposed fix: defer the founder image until approaching team. For the tablet, first compare a smaller visually equivalent opaque rendition; any deferred load must start early enough to satisfy the existing readiness gate. Blindly switching the tablet to lazy loading risks stalling the pullback. Preserve alpha for team cutouts. Risk is low for founder loading, medium for tablet readiness or compression quality.

### 5. Film bitrate exceeds the sampled mobile connection

**Worthwhile delivery follow-up.** The hero's approximately 5.19 Mbps bitrate exceeds the 1.6 Mbps loading profile. Touch samples reach `readyState: 2` and record some video drops. That is evidence of limited playback headroom, not proof that all animation hitches are decoding failures.

Evidence: `assets.json`, media byte/timing records in `clean-measurements.json`, playback counters in `mobile-lifecycle.json`.

Source: `Hero.tsx:28,1012-1017`; media file `public/redesign/nifemi.mp4`.

Smallest proposed fix: compare a lower-bitrate mobile rendition of the same edit, dimensions/aspect ratio and duration, selected without changing playback controls. Risk is encoding-quality drift. Compare actual phone playback and picture quality before approval.

## Journey and release checks

- Keyboard skip reaches film sound. Muting and Space pause work. The corrected check confirmed a manual pause survives leaving/returning, and a seek near the end crosses the actual playback loop.
- Tablet pullback, study entrance, gallery filters, hover preview, scrolling, selection, film dialog, play focus trap, Escape and return-to-browsing were exercised. Film/software counts were two each, all four. Quiz completion count stayed at one through reversal, play mode, exit and re-entry. Team skip reached the final group; hover and keyboard focus revealed roles. Footer returned to `scrollY: 0`.
- Earlier `journey.json` has a bad quiz selector and an invalid loop check while paused. Those are harness failures, not product defects. `release-check.json` supplies the corrected checks. Its six checks completed without page errors. The mobile script recorded two expected product failures for reduced motion; they remain open findings.
- Mobile native touch moved forward and reversed without a scroll trap. Gallery filters, answer selection and back-to-browsing worked. At eleven checkpoints the root scroll width was 390 and forced horizontal scrolling stayed at zero. Body width reached 416 because of decorative geometry, but root clipping prevented document scrolling, `hero.module.css:34`. Do not fix an alleged horizontal scroll bug solely from body width.
- Opening and gallery screenshots have readable primary content at 390 px. Filter hit areas are approximately 17 CSS px high from `selected-work.module.css:22,84`. Taps worked in automation, but comfortable touch access deserves a focused follow-up. A blanket percentage of “failed targets” or WCAG failure is not justified without spacing/exception analysis.
- Empty-form and malformed-email validation worked without a desktop scroll jump. Simulated 500, 429 and invalid JSON responses retained the draft and showed failure messages. A simulated success displayed receipt. All four POSTs were fulfilled inside the browser route interceptor and never reached `/api/contact`. WhatsApp href included the encoded draft and configured number; it was inspected, not opened.
- Source review shows `/api/contact` validates, rate-limits, saves a contact, then attempts notifications, `route.ts:100-259`. Email failure does not invalidate the saved enquiry. `src/lib/email.ts:59-100` returns failure values, while the contact route does not inspect those results at lines 220-239. Production database access, inbox handling, verified sender/domain and notification delivery remain **unverified launch checks**, not claims of successful delivery.
- `/redesign` still has “Hero review” and `noindex,nofollow`, `page.tsx:7-11`. Appropriate for review, not for a public replacement homepage. Decide the launch route and metadata before promotion. Missing `metadataBase` also warned in this local build. No route promotion or SEO changes were made.

## Lifecycle, maintainability and claims not established

At opening, gallery, team and footer, settling for five seconds followed by a 1.5-second observation produced **zero application RAF callbacks**. Hero stops at rest, `Hero.tsx:594`; team reschedules only while following, `TeamSection.tsx:157-159`; closing schedules on events. Videos pause/detach when their sections are no longer eligible. The old claim of an always-running RAF loop is unsupported.

Headless tab switching did not change `document.hidden`. Therefore hidden-tab runtime is **not measured**. The hero and gallery have real visibility handlers, but source inspection alone does not certify their background behaviour. No overridden visibility property was used as evidence.

Ten SPA round trips to `/privacy-policy` and back left DOM nodes/listeners stable after the first cycle at 1080/476. GC-forced heap grew from 6.20 MB to 9.27 MB; the first round trip added shared-route code and later growth did not plateau completely. This is not enough to prove a leak or declare memory conclusively healthy. RAF callbacks on the other route cannot be assigned to unmounted Hero because that route mounts animated global chrome. Cleanup functions remove the redesign listeners, observers and frames. See the lifecycle tests in `mobile-lifecycle.json`.

Multiple scroll listeners are not automatically competing animation owners. The hero, team and closing largely own separate elements. No visual fight between them was reproduced. React updates mostly guard threshold changes; no measured render storm was established. Closing already caches canvas text metrics by dimensions and font readiness, `ClosingSequence.tsx:64-86`; the old recommendation to add that cache is obsolete. Team's polygon computation was not the dominant measured cost. File length and custom animation code are not findings.

## Owner approval queue

**Release blockers**

1. Restore reduced-motion pointer/touch progression.
2. Prevent enquiry focus/scroll displacement on viewport height changes, while preserving gallery alignment inside its section.
3. Before public promotion, confirm route/metadata and the enquiry delivery configuration. These are operational gates, not verified production defects.

**Worthwhile follow-ups**

- Bound style/geometry work in the opening/tablet journey without changing its poses or follow timing.
- Reduce/defer early downstream image bytes with explicit tablet readiness testing.
- Compare a mobile film rendition and verify on a physical phone.
- Check filter touch hit areas without moving the approved desktop layout.
- If memory growth persists in a longer controlled run, take heap snapshots before proposing a cleanup fix.

**Optional experiments**

- **GSAP:** Not justified as a migration by these results. The measured problem is style invalidation/read-write work. If native batching fails, compare only the tablet transition driver using identical progress values and poses. Compare traces, bundle transfer and reversal/settling screenshots. A new ticker alone may not reduce browser style work and could alter approved timing.
- **Lenis:** No reproduced native-scroll inconsistency justifies adding it. If hardware-specific wheel behaviour is reported later, compare one desktop input profile on mouse and trackpad while retaining current follow math. Do not enable mobile gesture interception. Additional smoothing risks changing the approved feel and does not address the blockers above.

**Recommended next task:** approve a narrow interaction-fix task for findings 1 and 2 only, with normal-motion desktop screenshot/transition regression checks and reduced-motion/touch/resize acceptance tests. Keep performance experiments separate. Then repeat mobile playback and keyboard checks on a real phone before release.

All audit-owned test/server processes were absent at completion, recorded in `completion-baseline.json`. The existing 5782 session and unrelated user files remain untouched. Stop here for owner approval.
