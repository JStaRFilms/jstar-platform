# Opening/tablet rendering comparison

## Cause and scope

The current interaction-fixed production baseline still spends most sampled mobile main-thread time in style updates, not layout: a separate 390 × 844, 4× CPU trace recorded 3,365 ms of `UpdateLayoutTree` against 42 ms of `Layout`. Seventy of 71 style updates were nested inside animation-frame callbacks, and the repeated update reached 347 elements (maximum 153 ms). This reproduces the audit's problem area with the two interaction fixes in place. The trace does not assign every millisecond to one CSS property.

`Hero.paint` wrote inherited animation variables to the route root, which also contains the gallery, team and enquiry. It then read the track rectangle. `SelectedWorkGallery.paint` read row geometry every frame after hero and gallery writes. These are plausible causes of broad invalidation and synchronous style work; the comparison below tests their combined, narrowly scoped change rather than claiming separate attribution for each operation.

## Candidate retained

- `Hero.tsx`: write animated properties on the sticky hero stage rather than the route root, except `--nav-fold`, which now lives on its consuming header. Read the track rectangle before paint writes. The same progress values, properties, follow constants (1000/180 ms), poses and visibility decisions are retained. Team and closing no longer inherit per-frame hero animation values.
- `SelectedWorkGallery.tsx`: measure the first row only when the stage width/height or project count changes. Rows have an explicit CSS height (`--row-height`); this cache invalidates for viewport changes and filtering, and retains the existing 64 px fallback. The gallery still paints its pose every frame.

No styles, media sources, loading rules, quiz logic, selection rules or enquiry-resize handling were changed. This is one candidate; no second tuning pass was made.

## Production-build measurement

Local headless Chrome, mobile emulation at 390 × 844, device scale 1, touch enabled, 4× CPU slowdown, unthrottled local network. Both production builds used the same machine and assets. Starting from the tablet/game checkpoint, each run settled for four seconds, applied eight 35 px wheel steps 70 ms apart, advanced 360 px, reversed 400 px, and settled for 1.5 seconds. Six **untraced** runs alternated baseline/candidate in order B-C-C-B-B-C; each figure is the median of three, with minimum–maximum in parentheses. `comparison.json` has the individual runs.

| Metric, per sampled sequence | Baseline | Candidate |
| --- | ---: | ---: |
| Style recalculation duration | 3,363 ms (3,073–3,961) | 2,755 ms (2,651–3,133) |
| Layout duration | 35.4 ms (35.0–36.5) | 46.1 ms (45.1–47.5) |
| p95 RAF callback interval | 116.8 ms (100.0–216.6) | 100.0 ms (83.7–133.4) |
| Intervals over 33.34 ms | 94.7% (89.7–97.8) | 59.4% (54.2–75.9) |
| Long tasks | 37 (36–40) | 21 (16–34) |
| Longest task | 154 ms (133–268) | 127 ms (116–143) |

A separate **single diagnostic trace per build**, not included in those medians, saw the repeated style-update scope decrease from 347 to 168 elements; maximum update fell from 153 to 88 ms. Traced style total was 3,365 → 2,355 ms. Layout rose (42 → 67 ms traced, also visible in the untraced samples), and the candidate executes more callbacks and style updates because individual callbacks finish sooner. The change reduces broad style work and long tasks, but does not eliminate expensive frames. The style-duration ranges overlap slightly and the callback intervals are noisy. These are local lab observations, not a guaranteed device speedup or physical display FPS. Trace totals overlap enclosing events and must not be summed into a CPU total.

Evidence: `baseline-trace.json`, `candidate-trace.json`, their `trace-*.json.gz` files, `comparison.json`, `baseline-tablet.png`, and candidate normal-motion screenshots from `interaction-after-normal-*.png`. The isolated `candidate-workspace` is ignored and contains local links; do not distribute it.

## Experience and checks

Representative opening, film, tablet, quiz, reverse-to-quiz and settled return screenshots were compared with the interaction-fixed baseline. The quiz and reverse-to-quiz captures are byte-identical; opening/tablet composition is visually unchanged while live film frames and raster output vary. The focused production-build verifier passed all ten checks with no page errors: ordinary mouse/touch and keyboard reduced-motion progression; enquiry focus/draft through height changes; desktop/mobile gallery boundary alignment and selection; team/footer resizing; normal-motion forward/reverse travel and quiz-state retention. It did not submit a real enquiry. Results/screenshots are `interaction-after.json` and `interaction-after-*.png` in this directory.

Candidate production build succeeded (`build.log`). Isolated application `tsc --noEmit` passed (`typecheck.log`), focused repository ESLint passed, both scripts passed `node --check`, and `git diff --check` passed. Root-wide TypeScript still fails on duplicate declarations from copied audit workspaces; this is not an application type error. Build-integrated lint still reports the audit workspace's missing `eslint-plugin-react-hooks` (`build.err.log`), distinct from passing repository lint.

The commit `66bda4a` contains **only the previous interaction fixes**, as separately requested. This rendering candidate remains uncommitted and unpushed. No deployment, production-service change, enquiry submission or external message occurred. No physical-phone, Safari or throttled-network claim is made.
