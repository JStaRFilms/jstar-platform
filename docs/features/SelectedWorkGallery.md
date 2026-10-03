# Selected work gallery

## Scope and sources

Append Selected Work to `/redesign` after the existing study-game hold at progress 4.3. Keep the approved left-hand names and right-hand presentation stack. Four projects ship in this order: Adaptive Study Game, School management system, Nifemi, Sharon. Keep a finite natural gallery end. Continue can take visitors directly into the mounted team's wipe from any gallery project. Do not duplicate team or enquiry content in the gallery.

Build starts with this document, then `DesktopHeroRedesign.md`, `Hero.tsx` and its CSS. The session packet and `master_plan.md` under `docs/tasks/orchestrator-sessions/orch-20261002-065526/` govern scope. The complete supplied gallery HTML, CSS and MJS, study-game HTML, CSS, MJS and quiz data, study-canvas HTML, implementation brief and tablet handoff were read from the owner's outputs directory. Existing `StudyGame.tsx`, quiz data, game CSS, route composition, `src/content/portfolio.ts` and the platform PRD were also read.

The prototype is a composition reference, not an input or timing contract. Do not copy its 145ms clock, iframe, four mounted media panels, click-to-open rows, hard-coded `04`, filter reset during reverse scroll, wheel forwarding or team teaser. Main has already inspected the prototype in Chrome. This document does not claim new browser verification.

This is local frontend work for anonymous visitors, consistent with PRD FR005 and public-site performance/access requirements. No API route, backend, database schema, persistence store, CMS, dependencies, production changes or homepage integration.

## Ownership decision

Keep Hero as the single scroll/timing and presentation owner. Add a controlled `SelectedWorkGallery` component for catalog, filters, caption, bounded ordinary panels and end marker. Hero retains its existing film and the single StudyGame subtree at the same React position. Gallery never renders a game, accepts game children, creates an iframe or moves the game into a portal.

This needs a small extension of Hero's existing paint/measure loop, not another scroll engine. A separate gallery sticky track would simplify catalog isolation but would force duplicate quiz visuals or a cross-track handoff. Reject it. Likewise, hoisting game state and rendering another game would preserve some answers but lose DOM focus, details state and scroll position. DOM identity is a requirement.

Hero owns:
- Native page-scroll measurement, the one bounded animation clock, track height, resize alignment and the existing film lifecycle.
- Gallery filter, committed ID, transient preview IDs, viewer/play mode and explicit selection transactions.
- The persistent game frame, its placement, inert/input state, top-layer play presentation, external Back to browsing control and focus restoration.

Gallery owns:
- Semantic project buttons and filter buttons, six-row catalog window, ordinary panel neighbourhood and caption rendering.
- Local pointer rearm bookkeeping and event reporting. It receives scroll-settled state from Hero rather than scheduling its own animation clock.
- Ordinary preview video refs and their load/play/pause cleanup under Hero's visibility/mode permission.

StudyGame keeps its current `interactive: boolean` prop and all internal state. No reset-on-visibility effect, key change or new navigation state enters the quiz.

## Exact integration contracts

The implemented types and four static records live in `src/content/selected-work.ts`. They are separate from the shared `PortfolioProject` schema. Hero owns filter, committed ID, `pointerId`, `focusId` and browse/play/film mode. It supplies the filtered records and filter totals to `SelectedWorkGallery.tsx` through discrete props.

A project can also use `presentation: { type: 'static-image', src, alt }` for an existing screenshot or artwork. Both the source and meaningful alternative text are required. The gallery renders an unoptimized Next Image inside the same bounded panel neighbourhood, with fill sizing and scoped `object-fit: contain` to avoid cropping. The selected static image exposes its alternative text; neighbouring presentations remain hidden from assistive technology. This adds no app instance or generated artwork. The four shipped records, including the provisional school cover, are unchanged.

`GalleryHandle` exposes `paint`, `disarm` and `focusCatalog`. `GalleryFrame` carries entrance, continuous collection position, circular panel position, filtered count, settlement, media visibility and stage dimensions. The same exported `panelPose` computes ordinary-panel and persistent-game coordinates. The gallery has no animation clock. Its CSS is `selected-work.module.css`.

Use a ref handle only for per-frame CSS writes. React props hold the latest discrete frame snapshot at entrance/visibility/settlement changes; do not rerender the catalog on every animation frame. `paint` must not select projects or open anything. It paints the same position Hero uses to place the game. Hero publishes state only when IDs or discrete flags change. No external store or general motion framework.

Derive `filteredProjects` once per filter/data change. Derive `displayId = focusId ?? pointerId ?? committedId`. All IDs resolve within that same collection. Counter, caption, highlighted preview and front panel describe `displayId`; mark the committed row separately with `aria-current="true"`. Counter uses the displayed filtered ordinal and filtered total. Hover changes neither committed ordinal nor page distance.

`onSelect` commits and aligns page scroll, but never opens a viewer. `onAction` is separate: the study action enters play, Nifemi opens the full-film viewer, Sharon can open a clearly labelled excerpt viewer, a verified details link navigates, and unavailable destinations produce no fake action. Capture the displayed ID at activation. Actions commit that ID before opening. `onContinue` starts the mounted team's wipe from the current gallery selection, then lands at the start of Meet the Team without travelling through the remaining projects.

## Geometry and one clock

Preserve all existing formulas through 4.3, including original stage dimensions, scene registration, swipe and reveal. The current track is `831svh`. Keep its original denominator exactly:

- `H = stage.clientHeight`, `D = H * 2.7 - window.innerHeight`.
- Raw target `p = max(0, (scrollY - trackTop) / D)`.
- Earlier scene geometry, quintic stage easing, `elapsed = min(delta, 64)`, ordinary 1000ms follow, `elapsed / 900` travel cap and `0.0001` settlement tolerance are unchanged. Once the game is fully expanded, crossing the gallery boundary uses 180ms follow and `elapsed / 250`. Scrolling within the original 4.1 to 4.3 game hold still uses its original response.
- The existing playable hold remains 4.1 through 4.3. Do not shorten it to fund the gallery.

Use the appended ranges below. All pixel distances derive from the filtered count `N` and current viewport, not the original four-item fixture.

| Interval | Distance | Behaviour |
| --- | --- | --- |
| Existing journey | `4.3 * D` | Unchanged |
| Gallery entrance | `0.75 * H` | Same quiz shrinks into the first stack presentation; catalog appears |
| Browsing | `max(0, N - 1) * 0.5 * H` | Half a viewport per project transition |
| Final rest | `0.35 * H` for `N > 1` | Last project remains readable |
| Exit | `0.5 * H` for `N > 1` | Release into end marker |

Track height is `H + 4.3 * D + entrance + browsing + rest + exit`. This preserves earlier absolute scroll destinations while extending only the tail. For zero/one item or reduced motion, omit browsing/rest/exit pin distance. Retain a finite entrance for normal motion, then release. Reduced motion presents an unpinned static catalog after the existing static hero.

Let `browseStart = trackTop + 4.3 * D + 0.75 * H`. Continuous raw collection position is `clamp((scrollY - browseStart) / (0.5 * H), 0, N - 1)`. Scroll commits the nearest ordinal from the followed collection position, with half-step thresholds. This keeps the name and counter from advancing ahead of the visible entrance. Clear both previews on every browsing scroll, even if the ordinal did not change. Paint a continuous position from the same followed Hero progress. Both list position and panel travel consume this one collection position. A hover temporarily fronts the preview panel without changing that position or rearranging collection order.

Native scrolling remains continuous while the visitor moves. After the page's `scrollend`, a 180ms quiet interval settles fractional browsing positions to the nearest project using Hero's existing alignment transaction and panel follow. Browsers without `scrollend` use scroll inactivity instead. Pointer-held input postpones settlement until release; new scroll input cancels it. Settlement applies only between the first and last browsing anchors, never during the quiz entrance, final rest, exit, reduced motion or a viewer. Active pointer and keyboard previews are not replaced. Timer and input listeners are cleaned up with the existing motion owner.

Extend Hero's target ceiling by `appendedDistance / D`. Do not replace its denominator with total track height. Entrance uses a cubic ease-out through the existing clock, so shrinking starts promptly rather than behind a quintic ease-in. Pointer and keyboard previews use a 90ms circular-phase follow inside that same RAF loop. They take the nearest arc and can be redirected immediately. No CSS transform transition or second RAF competes with scroll. The loop stops when scene and panel travel settle, pauses for a viewer and cancels on teardown.

After entrance starts, the quiz becomes inert immediately and stays inert during browsing, even when it is the displayed project. The earlier `progress >= 4.1` condition must gain an upper bound at 4.3 and a play-mode override. Reverse restores input only in the existing fully readable hold. Film concealment and the earlier player intent remain unchanged.

Explicit selection writes committed state and scroll destination in one transaction. Normal motion uses `window.scrollTo` with instant native positioning. Within the gallery, align the scene progress to that destination while retaining the current panel phase. The same clock turns the fan toward the requested project, without clearing a preview back to the old scroll position. Suppress scroll-derived selection during that alignment transaction, then reconcile at its exact destination. No wheel cancellation or continuous page-scroll locking in browse mode.

## Interaction arbitration and filtering

1. Page scroll wins. Clear transient previews and disarm pointer preview as soon as scroll starts. Incidental pointerenter from rows moving under a stationary pointer does nothing.
2. Pointer rearm requires both settled paint and a deliberate coordinate change of at least 4 CSS pixels after settlement. Store the settlement coordinates. A synthetic zero-delta move or old movement during scroll cannot rearm. Touch does not hover.
3. Keyboard focus remains independent of the pointer latch. A new keyboard focus action can preview while pointer preview is disarmed. Scroll clears an existing focus preview without blurring its row. It does not automatically restore that preview on settlement.
4. Leaving the name list clears the corresponding pointer/focus preview and returns to committed content. Pointer exit does not erase keyboard preview while a row still has focus. Focus leaving the list clears focus preview.
5. Name click, Enter or Space commits the target ID and aligns to `browseStart + index * 0.5 * H`. It does not open, play or reset the quiz. Reduced motion selects without scrolling choreography.
6. Filter change clears previews, preserves committed ID if present in the new collection, otherwise commits its first item. Resize the track and align to that ID's new ordinal in the same layout transaction before the next scroll measurement. Keep focus on the filter. Suppress pointer preview until settled and deliberately moved again.
7. Filters survive reverse scroll and re-entry. If a filtered collection excludes the study project, keep the same game for entrance continuity, then conceal it by entrance end; it is not a hidden extra filtered panel or counted project.
8. Empty results show `0 / 0`, no panel or project action, and Continue. A single result shows `1 / 1`, no artificial scrolling between projects and no browse pin. Do not ship duplicates to exercise these cases.

## Bounded catalog and presentations

The catalog renders the collection's buttons in a clipped six-row window, as permitted by the approved implementation contract. The catalog heading moves slightly higher, the small redundant section/edition labels are removed, and the live `01 / N` counter follows the list rather than staying at the bottom of the viewport. Rows are sized so five or six fit without moving the right-hand project presentation. It does not create a nested scroll area. Hero's continuous position translates the list by `clamp(position - 2, 0, max(0, N - 6))` row heights. A keyboard-focused ordinal temporarily controls that translation so the button stays fully visible. Hover does not shift the window. Only the window's rows participate in Tab order; arrows and Home/End reach the whole collection. Narrow layouts use smaller rows, still capped at six visible names.

Use ordinary buttons inside a labelled navigation region, not an incomplete ARIA listbox. Arrow Up/Down and Home/End move focus across the full filtered collection; activation commits it. Page scroll clears previews and moves row focus with `preventScroll` to the persistent catalog container. Explicit selection suppresses its own alignment scroll event. Leaving the catalog restores the committed window. No project button unmounts merely because the window moves.

Keep a fixed circular presentation order derived from the filtered collection. At each whole phase, the front project is followed by the next projects in that order, wrapping the presentation fan at the end. Interpolate successive ranks so the whole fan turns, rather than swapping selected pairs. Explicit jumps and previews take the nearest arc. Native page scroll remains finite and does not wrap. Mount at most three ordinary panels from the current phase neighbourhood, plus the persistent game if it falls among the first four ranks. The persistent game is the one exemption: it remains mounted but is concealed and inert outside entrance, its neighbourhood or play. No second screenshot/live game substitution. Gallery reserves its study panel position; Hero paints the existing game into that rectangle in the shared stage coordinate system.

Preserve the reference proportions: desktop catalog at 4.5vw left, about 13vh top and 33vw wide, beneath the gallery brand and navigation header; front panel at 44vw/32vh, scaling toward 0.53 from its full-size entrance; caption near 78vh. Treat these as composition anchors, not permission to change earlier quiz geometry. Short screens and narrow widths must keep controls, six-row window and caption readable without horizontal overflow. Use the existing self-hosted study fonts for gallery Outfit/DM Sans, not the prototype's Google Fonts import.

## Explicit play with the same mounted game

Hero's existing `gameFrame > gameCanvas > StudyGame` stays in place throughout. On the gallery Play action:

- Commit `adaptive-study-game`. If necessary select All before alignment, then save its aligned browsing destination and invoking action element.
- Freeze browsing updates and pause all preview/hero media. Lock page scroll only for this explicit modal mode, recording/restoring the previous body styles and scroll position.
- Present that same `gameFrame` in the browser top layer using a manual popover on the existing element. Add the popover attribute only for play, call `showPopover`, and use a labelled `role="dialog"` with `aria-modal="true"`. This avoids ancestor clipping/stacking without a portal or React reparenting. Verify target Chrome support before Build; unsupported-browser treatment must retain the same DOM, not duplicate the game.
- Override frame/canvas transforms to readable viewport-sized layout with `--game-mini: 0`. Keep `gameCanvas` as its own scroll area. Save and restore its `scrollTop`, since changing layout size can clamp it. Enable `interactive` only after presentation is ready.
- Keep an external Back to browsing button inside the game-frame shell but outside StudyGame. It remains visible while game content scrolls. Put focus there initially. Trap Tab within this shell and inert the background siblings, never an ancestor containing the game.
- Back and Escape call one exit path: disable input, hide the popover, restore browsing geometry and page styles/position, resume measurement without replaying stale ticks, and restore focus to the invoking action with `preventScroll`. If that element is unavailable, focus the committed row or catalog container.

Top-layer presentation changes CSS/attributes only. StudyGame never unmounts, changes parent or receives a new key. Preserve topic, question, partial answer, order sequence, feedback, scores, review-details expansion and game scroll state. Hero's current root Escape handler must defer to an active viewer/play exit and must not return to the opening. Route teardown closes the top layer and restores locks/inert state.

## Film and media lifecycle

Only the active, visible film preview may have a video source attached and play. Neighbour panels use posters. Attach `src` on eligibility, use muted loop/playsInline and detach with pause, remove `src` and `load` on exit. No hidden metadata preload for every project. Pause on background tab, gallery exit, filter removal, play/viewer entry and teardown. Handle rejected autoplay without spinning retries. Reduced motion uses posters and explicit playback only.

A film viewer is a separate native dialog. It uses verified full content when available, otherwise only the supplied excerpt with an explicit excerpt label. It commits its project, pauses previews, locks/suspends browsing and restores focus and position on close. Nifemi's full viewer source is `/redesign/nifemi.mp4`, not the excerpt. Do not create a second hero player or transfer the hero player's mute/playback intent to a gallery preview. A viewer element exists only while open, pauses and unloads on close, and never autoplays audible media. Resume eligible muted previews only when back in visible browse mode; manual pause choices must not be cancelled by automatic lifecycle changes.

## Content ledger and open uncertainties

| ID | Presentation and confirmed destination | Limits |
| --- | --- | --- |
| `adaptive-study-game` | Existing StudyGame; shared portfolio entry provides `https://github.com/JStaRFilms/Adaptive-Study-Game` | Gallery title is Adaptive Study Game. The playable demonstration is the supplied fixed quiz, not a Gemini-backed live app. Do not claim adaptive generation in this embedded demonstration. |
| `school-management-system` | Clearly labelled provisional school cover | No verified product image, demo, repository or case-study destination found. Keep neutral school-management copy and a visible provisional note. Omit a misleading Explore link. |
| `nifemi` | Supplied `gallery-nifemi.jpg` and `gallery-nifemi.mp4` for preview; approved full `/redesign/nifemi.mp4` | Preview clip is not the full piece. Exact YouTube URL, credits, role and public clearance remain unverified. |
| `sharon` | Supplied `gallery-sharon.jpg` and `gallery-sharon.mp4` for preview | Full destination unknown. Do not invent a YouTube link or treat excerpt as full film. Label any explicit playback action Watch excerpt until full content is approved. |

The four supplied gallery derivatives were copied unchanged into `public/redesign/`: `gallery-nifemi.jpg`, `gallery-nifemi.mp4`, `gallery-sharon.jpg`, `gallery-sharon.mp4`. Their originals remain untouched. School art remains a labelled cover study. Prototype film dates/descriptions are not verified editorial facts; omit dates, roles and outcome claims pending confirmation. Do not pull the entire portfolio/social feed into this collection.

Missing school assets and Sharon full link do not block selection or browsing. They block factual imagery/full-film destinations. Do not broaden this pass into asset research, case-study writing or content administration.

## Build sequence and acceptance

1. Add scoped project data and controlled catalog/panels. Verify filtered ID derivation and six-row/three-panel limits with four, temporary twenty and single-project fixtures.
2. Extend Hero's one clock and append count-based ranges. Verify the original denominator, 1000ms follow, rate cap and all absolute destinations through 4.3 against the existing hero/tablet/software checks.
3. Wire selection/filter transactions and pointer/focus arbitration. Test stationary-pointer scrolling, deliberate rearm, leaving the list, keyboard preview, click alignment and reverse/filter preservation.
4. Add same-frame play and full/excerpt viewing with media/focus cleanup. Test DOM node identity before entrance, through filters, during play and after return. Complete a quiz round, preserve partial ordering and submitted feedback, reopen results/details and reverse back to the earlier quiz hold.
5. Run focused lint, TypeScript and whitespace checks, then browser checks at 1440×900, 1920×1080, a short desktop viewport and a narrow touch viewport. Verify reduced motion with zero long gallery pin, posters by default, selection/filter controls and explicit play/Back access.

Blocking regressions include changed earlier geometry/timing, duplicate or remounted game, input in a miniature quiz, title activation opening a viewer, stationary pointer overriding scroll, stale filtered counter/range, twenty mounted videos, unloaded background cleanup missing, inaccessible modal exit, infinite gallery pin or invented destination/claim. Check normal scroll reaches the finite end and reverse retraces entrance without wheel capture. A twenty-item fixture must scale distance by nineteen transitions while keeping bounded DOM/media. A single-item fixture must not consume nineteen or three transitions. Fixtures stay in tests/review tooling, never shipped duplicate projects.

## Implementation checkpoint

Build added `SelectedWorkGallery.tsx`, `selected-work.module.css` and `src/content/selected-work.ts`, and extended only Hero and its scoped CSS. The reduced catalog is a static section after the original static hero; films default to posters. Its study entry has a text cover and Try it uses the same mounted app. Normal motion keeps the live app in the stack. Both modes stop at a plain end marker before team content.

TypeScript, focused ESLint and whitespace checks passed. A standalone Chrome smoke on port 5782 confirmed native popover support, one game/frame DOM identity, inert browsing, readable explicit play, Back/Escape exits, preserved partial choice, project selection, filtered count/ID preservation, Nifemi's full viewer source, finite Continue and reduced-motion play. Layout smoke at 1440×900 and 390×844 found zero horizontal overflow. These checks do not replace the parent's detailed reverse, focus, pointer, media, 20/single-project and recording pass. No server restart, dependency, commit or staging change was made.

### Review selectors and fixture mounting

- `[data-gallery]` exposes `data-filter`, `data-mode`, `data-committed-id`, `data-displayed-id`, `data-pointer-id`, `data-focus-id`, `data-count`, `data-reduced`, `data-visible`, `data-settled`, `data-position`, `data-panel-position` and `data-pointer-armed`. Individual presentation nodes also expose `data-panel-depth`.
- `[data-gallery-count]` on the track exposes `data-denominator`, `data-browse-start`, `data-gallery-entrance`, `data-gallery-browsing`, `data-gallery-stride`, `data-gallery-rest` and `data-gallery-exit`. Values are CSS pixels; reduced ranges are zero.
- Buttons use `[data-project-id]`, `[data-project-index]`, `[data-filter-button]`, `[data-project-action]` and `[data-gallery-continue]`. Panels use `[data-panel-id]` and `[data-panel-index]`. Counter and boundary are `[data-gallery-counter]` and `[data-gallery-end]`.
- Persistent app nodes are `[data-study-frame]` and `[data-study-canvas]`. The explicit exit is `[data-back-to-browsing]`; the frame matches `:popover-open` in supported Chrome. Film viewing uses the native `dialog` and its video.
- Hero accepts optional `projects?: readonly GalleryProject[]`. Temporarily mount `<Hero projects={fixture} />` from local review/test tooling for a generated 20-item collection, a single item or an empty collection. Import the type from `src/content/selected-work.ts`. Use unique IDs and one study-game presentation when testing the live app. The shipped page still renders `<Hero />` with four approved records; no debug URL or duplicated fixture ships.

Chrome is the verified target. Browsers without the popover API retain the same frame with fixed modal CSS and the same lock/focus logic, but that fallback has not been browser-tested. School product imagery and Sharon's full destination remain unapproved.

## Verification appendix, 2026-10-02

Status: the reduced-motion blocker is resolved. The affected browser checks pass; independent review is still pending. No production implementation was changed by verification.

`docs/redesign-review/verify-gallery.cjs` runs synchronous Playwright against the existing preview on port 5782, using installed Chrome and the external Playwright module. CDP screenshots do not wait for fonts. Browsers close in `finally`. Detailed DOM, media, range and control rectangles are in `gallery-verify-results.json` in the same directory.

### Original blocker, now resolved

The original reduced-motion check at 1440 by 900 found that selecting Adaptive Study Game left its static cover underneath the neighboring school-management panel. The row, caption and counter described the study game, but its cover had `z-index: auto` while the school panel had `z-index: 7`. Center-point hit testing confirmed the occlusion. The test temporarily enables hit testing on presentation elements, without changing paint order, then restores their inline styles.

Historical evidence remains in `gallery-verify-reduced-study-occlusion.png`, `gallery-verify-failure.png` and `reducedOcclusion` in the original JSON. The assertion failed in 2.582 seconds; that focused run took 13.887 seconds including navigation and cleanup. The coder then set `.staticStudy` to `z-index: 10`. The targeted recheck below confirms the selected cover is now in front. The original receipt was not rewritten to turn that failure into a pass.

### Passed checks before the blocker

Times below are actual check durations, not estimates. Resumed runs retained earlier receipts rather than replaying the whole quiz matrix.

| Check | Seconds | Evidence |
| --- | ---: | --- |
| Hydration, single quiz topology, range and original timing/reveal constants | 6.272 | Original denominator 1530px at 1440 by 900; browsing 2700px, entrance 675px, rest 315px, exit 450px |
| Earlier software hold, entrance/reverse and selected-answer identity | 39.889 | Same quiz/frame/canvas nodes, Mars retained, immediate entrance inertness and reverse input restoration |
| All four forward/backward and rapid direction | 65.259 | Seven settled visits, correct committed ID/counter and bounded ordinary panels/media |
| Hover departure and stationary pointer arbitration | 9.613 | Scroll wins, zero/two-pixel movement stays disarmed, six-pixel in-row movement rearms without exit/reentry |
| Independent focus preview, scroll clearing and selection | 46.100 | Arrows/Home/End, Enter commits, scroll moves focus to catalog, title selection opens no viewer and scrolling continues |
| Filters and reverse persistence | 40.570 | Preserve Sharon in Film, choose first software when excluded, correct counter/range, filter focus and reverse/re-entry |
| Explicit play lock, Back/Escape and feedback | 49.003 | Wheel does not move page, focus remains in shell, action focus/page position restored, selected/submitted Mars retained |
| Partial ordering and results/details continuity | 103.777 | Mercury/Venus partial order retained, completed 400-point round, expanded review retained through browse/filter/reverse; nonzero canvas scroll 227px restored |
| Preview/viewer lifecycle | 22.985 | At most one sourced/playing preview, neighbors unsourced and paused, opened viewer unloads preview; Nifemi full source, Sharon excerpt label/source; detached viewer paused/unloaded |
| Continue and natural finite release | 28.524 | End marker focus, native final wheel release, offscreen previews unloaded, reverse returns to playable earlier hold |
| Four-item settled geometry | 4.982 | 1920 by 1080, 1440 by 640, 390 by 844; controls within viewport, no horizontal overflow or nested catalog scroll |
| Twenty-item fixture | 67.940 | Nineteen viewport transitions, 17100px at 900px height; six fully visible rows; keyboard End/Up/Home stays visible; at most three ordinary panels and one preview source; only two unique fixture preview URLs requested |
| Twenty-item viewport geometry | 41.587 | Same three viewports; six readable rows including current title/label; bounded panels and media |
| Single and filtered-single/empty fixture | 38.784 | 1 / 1, zero browsing/rest/exit; Software remains single; Film gives 0 / 0, no panel/action and working Continue |
| Reduced-motion controls/play | 2.388 | Zero appended pin ranges, no preview sources, keyboard selection and same-node play/Back work. This did not establish correct presentation paint order |
| Runtime errors and byte-restoration receipt | 3.348 | No page errors in the checked runs; fixture source restored |

Fixtures used a temporary synchronous data override in `src/app/redesign/page.tsx`, not a shipped dev route. The original file was saved as a Buffer and restored byte-for-byte in `finally`. The twenty-item fixture had one study game, one school cover and eighteen uniquely identified films. Separate runs used one study item. No fixture content or page diff remains. The first query-based override and an early restore navigation hit development-route readiness timeouts; moving the browser off the route before writes and warming compilation resolved those tooling failures. An initial wait incorrectly required the intentionally hidden pre-gallery section to be visible; it was corrected to wait for attachment and settlement. None of these harness corrections changed a product assertion.

Focused ESLint on Hero, SelectedWorkGallery and selected-work content, `pnpm exec tsc --noEmit --incremental false`, `node --check docs/redesign-review/verify-gallery.cjs` and `git diff --check` passed. Existing staging and prior review images were not modified. The preview server was not restarted.

### Recording and remaining work

`gallery-verify-journey.mp4` was recorded only after the initial core matrix passed, before visual review found the reduced-motion blocker. It contains entrance, scroll browsing, explicit name selection, same-game play with the retained Mars answer, submitted feedback, Back and reverse to the earlier hold. NVENC was available on the GTX 1650. Encoding used `h264_nvenc`; ffprobe confirmed H.264, 1280 by 800, 24fps and 44.666 seconds. Recording/encoding took 70.018 seconds. The four-second contact sheet `gallery-verify-journey-sheet.png` was inspected along with the viewport screenshots. The clip is evidence of the normal-motion journey, not a clean acceptance sign-off.

### Targeted recheck after the fix

`node docs/redesign-review/verify-gallery.cjs --reduced-only` passed in 12.632 seconds, with zero runtime errors. It checked 1440 by 900 and then resized the same mounted page to 390 by 844. Only affected reduced-motion behavior was rerun. No normal-motion, twenty-item or full quiz matrix was repeated, and no fixture source was created.

| Affected check | 1440 by 900, seconds | 390 by 844, seconds |
| --- | ---: | ---: |
| Selected study cover in front, within viewport; zero entrance/browse/rest/exit pin and unsourced paused previews | 2.964 | 0.301 |
| Home/End/arrows/Enter selection; filter ID/first-item/counter/focus behavior; film posters decoded and previews remain unsourced/paused | 5.390 | 1.038 |
| Same-game explicit play; Back and Escape; trapped focus, restored action focus/page position and visible selected cover after return | 1.127 | 0.820 |

The zero-error and prior-artifact byte-preservation check took 0.009 seconds. Results are separate in `gallery-verify-reduced-recheck.json`. The original `gallery-verify-results.json` and normal-motion MP4 are byte-for-byte unchanged. Current CDP screenshots are `gallery-verify-reduced-fixed-1440x900.png`, `gallery-verify-reduced-fixed-390x844.png`, and the corresponding `film`, `play` and `return` images. The selected-cover, decoded-poster and return screenshots were read and inspected. Poster readiness is bounded to 15 seconds; screenshots still do not wait for fonts.

An intermediate repeat navigation timed out waiting for the narrow route to become ready. The final check reused the mounted route and exercised viewport resize instead. This changed no product assertion. Browser cleanup ran on both attempts. Syntax and whitespace checks passed. No server restart, staging change, production edit or modification of earlier receipts/images was made by this recheck.

Independent review remains the next step. Cross-browser fallback, screen-reader use and background-tab lifecycle were not rerun. `--reduced-only` preserves the earlier matrix and recording; `--from-fixtures` is only appropriate when unrelated implementation has not changed. Use a full run after broader changes.

### Static-image support checkpoint

A focused temporary `Hero projects` fixture used the existing `/portfolio/thumbnails/adaptive-study-game.png`, with a typed static-image record between the study game and Nifemi. TypeScript accepted the fixture. At 1440 by 900, normal and reduced motion both decoded the image, retained its source and meaningful alt, used `contain`, and matched the panel's approximately 742 by 400.15 CSS-pixel bounds. The selected image was accessible, two ordinary panels remained mounted, no preview video had a source, and there was no horizontal overflow or runtime error. No earlier matrix or recording was repeated.

The first fixture navigation timed out on gallery readiness. Its cleanup restored the route. The subsequent focused run passed, and cleanup again restored `page.tsx` byte-for-byte from its saved Buffer. Fixture data exists only in ignored local review tooling, not in the shipped route or content records.

### Owner-recording motion corrections

The owner supplied `E:/Videos/Screen Recordings/Screen Recording 2026-10-02 103822.mp4`. Main inspected its 19.267-second contact sheet and handled the fixes directly, without subagents.

- Restore the prototype header, desktop catalog at 18vh, larger spaced names and a complete four-card fan. Larger collections still mount at most three ordinary panels plus the same game.
- Use a fixed circular presentation order and the nearest arc for previews and explicit jumps. All cards turn in order. Native scrolling still has a finite end.
- Stop writing full-screen game geometry after entering the gallery. Refresh no longer calls resize for every selection. Clearing a preview on activation retains the current phase instead of briefly fronting the old committed project.
- Start the entrance with cubic ease-out and use the faster gallery response when crossing from the fully expanded game. Scroll-derived selection follows the visible collection position, not a raw target ahead of it. Keep the half-viewport project stride.
- Preserve the saved game-scroll bookmark when a smaller layout clamps its physical scroll position. The measured results view reopened at its saved 245px after the earlier full-screen layout temporarily clamped it to 137px.

The focused ordering check passed all four circular orders, hover departure, click and native-scroll selection, same-node play/Escape/reverse and retained Mars. It sampled 750 frames and 1920 geometry writes at 1440 by 900. Maximum visible game width was 742px throughout gallery browsing; no viewport-sized or origin-position game write occurred. A 600px wheel gesture produced entrance progress 0.272 after the sampled 150ms while the first project remained committed. Receipt: `docs/redesign-review/gallery-refinement/gallery-ordering-results.json`.

Fourteen matrix checks also passed, including partial ordering, completed results/open review, focus and pointer arbitration, filters, preview/viewer cleanup, finite release, 1920 by 1080, 1440 by 640 and 390 by 844 geometry, twenty-item range/window/media checks, and single/empty cases. The twenty-item browsing range is now 8550px at 900px height, not the historical 17100px above. Passed receipts are retained, with their origins stated, rather than rerunning the core quiz after each tooling failure.

The first long command exceeded its deadline after twelve actual PASS lines, before its final receipt. Main removed only the generated fixture inserts and verified the restored route against the original bytes. The harness now saves checkpoints and a fixture backup. Resumed checks passed the remaining twenty-item and single-item checks. Repeated reduced-motion navigation in that same browser could not hydrate: CDP captured an `/_next/static/chunks/app/layout.js` script containing only a 4782607-character prefix of the generated 13995172-character file. With the owner's permission, main restarted only the local Next.js preview on port 5782, without cache deletion or production changes.

The independent reduced-only run then passed all seven checks at 1440 by 900 and 390 by 844 in 7.178 seconds, including cover paint, filters, posters, play, Back/Escape, focus restoration and zero runtime errors. See `gallery-refinement/gallery-verify-reduced-recheck.json`. A separate NVENC recording passed in 52.131 seconds. `gallery-refinement/gallery-verify-journey.mp4` is H.264, 1280 by 800 at 24fps, 24.958 seconds long. Its inspected contact sheet is `gallery-refinement/gallery-motion-contact.jpg`; it shows the updated gallery fan, selections, same-game play and return. Recording receipt: `gallery-refinement/gallery-motion-recording.json`. The video was captured before a one-line reduced-motion-only correction that makes its circular panel position follow preview selection; the normal-motion clip is unaffected.

The aggregate matrix receipt in `gallery-refinement/gallery-verify-results.json` remains marked blocked because that earlier combined attempt could not hydrate for reduced motion. It retains fourteen passed normal/count/layout checks, not a false all-green result. The separate reduced-motion and recording receipts are passed. The earlier MP4 and receipts remain unchanged as historical evidence. Final focused ESLint, `pnpm typecheck`, script syntax and `git diff --check` passed. The temporarily modified `page.tsx` is byte-identical to its original. Remaining approved school imagery/destination and Sharon's full-film destination are still missing. No team section, push or deployment was added.
