# Portfolio viewer integration

## Goal and authorisation
The owner authorised local source integration after approving the viewer direction and nine film cover cuts. Integrate functional selected-work viewers while preserving the gallery, hero/team/footer and existing StudyGame/Melo records. No publication, staging or deployment is authorised.

## Native YouTube fullscreen, 14 October 2026

The owner rejected even the remaining 44px fullscreen row. This supersedes that workaround below. The selected ready iframe now owns fullscreen, not the gallery shell. YouTube native controls and fullscreen are enabled with supported `controls=1` and `fs=1`; compact custom controls remain available, while no website controls/header/title/navigation appear in iframe-owned fullscreen. The ancestor viewer popover remains open behind it. No reload, crop, transform or branding concealment is used.

Fullscreen ownership checks include descendants for orientation, cleanup and Escape. Portrait films request portrait when the actual API permits it. Entry focuses the iframe; native/browser exit restores the compact popover, notes and original control focus. Same player, time and mute state survive. Aspect-ratio or encoded black bars remain legitimate source content; fullscreen does not promise stretching or unsupported rotation.

Focused browser checks measured the exact full 760x360 landscape and 390x844 portrait viewport with no reserved row, plus preserved instance/time/mute/focus and notes return. Orientation/SDK portions were labelled stubs. Fifteen preservation cases and two bounded real YouTube cases passed over ordinary private HTTPS, along with source-only TypeScript and focused lint. The real Forest player decoded its 360x640 source and naturally looped while its iframe owned the full display. No ad state was observed; other films/ads, official attribution and actual Android/Safari rotation are not certified. Receipts are under `docs/redesign-review/youtube-native-fullscreen/`.

An interrupted broad run produced an unusable receipt, and a later real setup found an exited preview process and HTTP502 before any checks. Both records are preserved, not counted as passes. Only the verified root5782 preview was restored. No protected preview, route swap, staging, commit, push or deployment occurred. The owner intends a future real `/` and `/redesign` UI swap only after validation and explicit go-ahead.

## Owner mobile follow-up, 14 October 2026

Actual Android feedback supersedes the earlier fullscreen header/strip treatment below. Native fullscreen now keeps its header transparent, with text/icon shadows rather than a full-width glass panel. Rotation is an accessible icon without visible label text. Software retains the device's orientation instead of automatically requesting landscape; a portrait phone stays portrait. The small rotation/exit controls remain available where the browser supports them, and only viewer-owned locks are released on exit.

YouTube fullscreen hides our header, title/ordinal and project navigation. The same complete iframe fills the area above one 44px external playback row, including the rotation icon when supported. At 760x360 the measured player changed from 736x200 at x=12/y=75 to 760x316 at x=0/y=0. No own control covers the iframe, and no branding, source letterboxing, playback parameter or player instance is changed. Compact viewer controls and project navigation return on exit.

The missing-details regression was reproduced by canceling a software return animation: notes stayed in `waiting`, hidden and inert. Media and notes animations now settle on completion or cancellation, guarded against stale animation/project callbacks. Reduced motion still restores directly. A canceled media return and a separately canceled notes slide both restored visible, interactive notes in focused tests. Normal 620ms media and 300ms notes motion remains unchanged.

Receipts are under `docs/redesign-review/owner-mobile-corrections/`. Eight asserted owner regressions, fifteen viewer preservation checks and two bounded real YouTube checks passed over ordinary private HTTPS. Ten whole-page preservation checks passed on ordinary loopback. TypeScript and focused lint passed. The separate toolbar-height proxy is labelled simulation, not actual phone certification. One fresh private whole-page attempt failed before hydration with the known dev-bundle parse error; its receipt is preserved. Complete HTTP/HTTPS bundle fetches matched disk and parsed, but no permanent delivery fix is claimed. No software screenshots or full Study Game app use occurred.

The current root preview is private3461 to loopback5782, with the verified local WMI-launched CLI recorded in `owner-mobile-corrections/root-server.json`. Do not use older exited process IDs to stop it. Protected3460/5914 and archived5912 were not changed. Physical toolbar/orientation retesting and release approval remain separate.

## Ambient fullscreen glass

The owner chose live native colour and neutral YouTube glass. `PortfolioMedia.tsx` samples the actual native film into one detached 24x12 canvas while fullscreen. Upper and lower frame averages set `--ambient-top` and `--ambient-bottom` on the existing viewer. No frame images leave the browser and no palette timeline or new media files are generated. Colours are darkened for fixed light controls; CSS eases background changes over 650ms. The control strip and floating navigation get glass highlights and backdrop blur. The latest native header uses shadows only, as described above. Native outer framing can take the tint without changing the video's pixels, source aspect or encoded black bars.

Sampling runs at most twice per second during playback. Pause stops the interval; decoded data and completed seeks can update once. Leaving fullscreen, reading, unmounting and source changes remove the variables and listeners. Hidden tabs stop work; errors and unreadable canvas frames fall back to neutral. Reduced motion disables sampling, including a live preference change. Software fullscreen remains app-only. Compact gallery/viewer styling is unchanged.

YouTube's remaining external fullscreen playback row uses neutral charcoal glass. The latest fullscreen layout hides our header, title and footer. There is no iframe pixel access, palette approximation, duplicate video, overlay or cropping. Its own thumbnail, controls and letterboxing are untouched.

`docs/redesign-review/verify-ambient-glass.cjs` checks real decoded scene colours and seeks, throttled canvas reads, stable pause, live reduced-motion changes, cleanup, quiz/Mars retention, player identity and note return. Its pixel counter delegates to the real canvas implementation; it does not stub colours. The final ordinary private HTTPS run passed four cases with zero page errors and no interception. Three reads occurred during 1.25 seconds of native playback; YouTube added none. Source-only TypeScript, focused ESLint, harness syntax and whitespace checks passed. Receipts and actual screenshots are in `docs/redesign-review/ambient-glass/`. Earlier failed setup and labelled bootstrap results are separate. Physical mobile/performance across devices and permanent cold-dev delivery remain unverified.

The private preview still uses port 3461 to loopback 5782. Main restored only its exited local process, now launcher 29496. Tailscale briefly reported NoState and later recovered without any authentication or Serve changes by this task. At the final read-only check, the separate 3460 route pointed to 5914. This task did not change that route or either protected preview workspace.

## Next viewer correction pass

The latest authorised packet is `docs/tasks/orchestrator-sessions/orch-20261012-114721/viewer-polish.md`. It supersedes the previous opaque layout and full-width viewer footer, not the site footer or gallery contracts below.

Compact viewers now use an 80% dark glass background with transparent shell ancestors. Desktop media fits the space below the heading and above floating navigation. The right-hand notes region scrolls independently; short notes and content-sized contributor drawers centre on the right. Narrow screens retain one stacked content scroll. Tracks are hidden on the viewer panes, drawers, contributor rail and sample, without removing scrolling. Hero locks both html and body overflow, saves the original gutter/padding and restores them on close.

Opening and project changes have a 360ms transition. Fullscreen layout and the 620ms same-node growth start synchronously before the popover leaves the top layer. A handoff display rule keeps the existing shell painted while neither popover nor fullscreen is active. Browser fullscreen changes, rejected requests and Escape restore the compact viewer. YouTube keeps its complete, unscaled iframe and compliant fade/external strips. Software fullscreen hides all viewer headings, brand, chrome, segment, tools and project navigation. The original sample or screenshot fills the viewport. Escape exits; the small exit target appears on focus/hover and remains discoverable on touch.

On native-film and software expansion, the original right-hand notes card slides right over 240ms while media grows. The media's stacking level stays above the notes. On return, notes remain hidden and inert until the actual 620ms media animation finishes, then slide back over 300ms. Browser-initiated exits and rejected fullscreen requests use the same sequence. Reduced motion restores notes immediately. YouTube retains its unscaled fade, with notes hidden during fullscreen so no card shows through the iframe; notes return after that fade finishes.

Native videos loop on the same media element. YouTube uses official `loop=1` and a same-video `playlist`, with no retry or ended restart loop. Explicit pause, reading/background pause, failure, disposal and stale callbacks stay authoritative. Forest declares portrait orientation from the observed 360x640 upload. Its portrait iframe fits available space, respecting YouTube's minimum player size. The source remains uncropped; very short layouts and differently encoded films can retain source letterboxing. Nifemi stays on the original 1280x720 full source with variable framing.

The notes-return follow-up passed four focused checks over ordinary private HTTPS with no interception and zero page errors. `docs/redesign-review/notes-return/results.json` records native-film and quiz growth/return, actual YouTube iframe identity and post-fade notes return, reduced motion, and 170 sampled timing frames. The same game node and selected Mars answer survive. Browser-initiated exit restores the popover before measuring the return. The separate compiled-bootstrap receipt is labelled; it is not the final ordinary-network run. Current-source TypeScript, harness syntax and whitespace checks passed. Physical-phone animation and orientation remain unverified.

Earlier polish receipts are in `docs/redesign-review/viewer-polish/`. Fifteen focused browser checks passed, including intermediate rAF geometry and six captured paint sequences, same quiz/answers/bookmark, independent keyboard scrolling, glass/right placement, unoccluded controls, native loop wrap, labelled SDK/orientation cleanup and reduced motion. Two real-SDK checks passed. Forest decoded at 360x640 for 51.181 seconds, ran naturally through one loop on the same iframe, then paused and disposed correctly. This is not a claim about all films or actual phone rotation.

The original polish checks encountered truncated cold dev layout delivery and used the explicitly labelled `--disk-layout` test transport. After the owner authorised a local restart and private Tailscale, a fresh normal HTTPS browser hydrated and opened/closed Melo with thirteen records and no page errors. The private preview is `https://johnsax.tailb6e2d3.ts.net:3461/redesign`, targeting loopback 5782. The protected 3460 route still targets 5912. During the subsequent notes-return check, the local preview process exited and the private route returned 502. That failed setup receipt is preserved separately. Preview process metadata is in `docs/redesign-review/viewer-polish/main-server.json`; motion checks are in `docs/redesign-review/notes-return/`. No permanent cold-delivery fix is claimed. Next configuration, archives and the protected owner preview remain unchanged.

## Previous owner correction pass

The owner now requests one-action unified playback, no Load player/native-first gate or instructional status prose, native edge-to-edge Cinema with overlays, and unified YouTube controls in minimal external edge strips. The last choice was explicitly confirmed. Preserve expansion/return motion, improve software 16:9 sizing, keep project arrows visible, rework sparse notes/profiles and increase readability. Best-effort mobile orientation must reflect browser support. These corrections supersede the earlier gate and sparse full-height layout decisions, not iframe branding/overlay limits or gallery/quiz preservation. No publication is authorised.

## Contributor logos

`ProjectContributor.imageKind` can mark an image as `logo`. The existing credit thumbnail and profile image then use contain sizing, with a dark profile plate for white/transparent artwork. Other portraits keep their original cover sizing. Winning Worship Way Christian Centre uses an owner-supplied logo, prepared without cropping as a 384x576 lossless WebP. Originals remain unchanged. `verify-everything-content.cjs` passed normal private HTTPS desktop and mobile checks for logo proportions, channel link and unchanged portrait fitting.

## Components and data flow
Static records in `src/content/selected-work.ts` feed Hero's filtered collection, committed selection and controlled gallery. `GalleryProject` discriminates software from native and YouTube films. Native `fullSrc` accepts a local path; YouTube uses `youtubeId`. Source remains a repository action and Visit website remains a separate product action.

Hero still owns scroll timing, filters, committed selection and modal entry/exit. `PortfolioViewer.tsx` renders the approved notes, contributor rail, drawers, product frame and bounded navigation. `PortfolioMedia.tsx` owns native playback and the official YouTube SDK adapter, prepared only for the selected open viewer. `portfolio-viewer.module.css` scopes the new viewer styles. The old homepage YouTube hook is not reused because its untyped API and deprecated parameters do not meet this viewer's requirements.

`gameFrame > gameCanvas > StudyGame` remains in its original React and DOM position. The viewer UI is a sibling of `gameCanvas`. A ResizeObserver measures the product slot and writes CSS coordinates for that existing canvas. Switching screenshots/sample, navigating projects and changing viewport or fullscreen only changes its geometry and input permission. The saved quiz-scroll bookmark is restored after slot resizing.

The same frame enters a manual popover for Studio Notes and browser fullscreen for Cinema. Fullscreen first hides the popover, because browsers reject fullscreen on a showing popover, then expands the same element. Exiting fullscreen restores the popover without replacing media. Missing screenshots and credits stay in review records or typed pending fields, not public notices. The broken full Study Game app was not accessed.

## Scope and data
Retain four records, rename the school display title to Melo without changing `school-management-system`, and append nine selected YouTube records in manifest order. This extends the visible sequence, not date/view sorting. Nifemi/Sharon remain self-hosted. Use approved separate covers and exact publication URLs. Omit the pending campus film, removed wedding/Baby Riddim and filler.

No server endpoint, CMS, database schema, persistence migration or new dependency is required. No external production operation is authorised.

## References
- [Gallery contracts](SelectedWorkGallery.md).
- [Contribution guide](PortfolioContributionGuide.md).
- [Design decisions](../Mockups/01_Public_Website/portfolio-design-decisions.md).
- [Content ledger](../Mockups/01_Public_Website/portfolio-content-ledger.md).
- [Roster](../Mockups/01_Public_Website/portfolio-youtube-shortlist.md).
- [Prepared notes/covers](../Mockups/01_Public_Website/portfolio-selected-film-notes.md).
- Native/software/YouTube prototypes: `studio-notes-linear.html`, `software-preview-refined.html`, `studio-notes-youtube.html` in that workshop directory.

## Acceptance
Left names select; selected right card/action opens. Previous/next follows the active filtered collection. Fullscreen retains the same player/sample and restores notes. YouTube controls, title and ordinal never overlap the iframe, branding or ads. Our Play control starts the selected player directly, with one queued start while it prepares. API starts do not promise official view attribution. Unknown credits are omitted, never invented.

Preserve original Hero film, eager tablet WebP, one scroll clock, adaptive catalog rows, `mobilePreviewLayout` agreement, quiz answers/DOM identity, focus return, reverse scroll, enquiry drafts and footer geometry. Do not alter the isolated tailnet owner preview or its build/process on port 5912.

## Integrated state

Thirteen records now ship in the requested order. The existing IDs remain stable, including `school-management-system` with display title Melo. The nine appended records follow the approved manifest order. All eleven film covers use their separate approved ten-second MP4s and posters. Nifemi's full source remains `/redesign/nifemi.mp4`; Sharon uses the accepted `/redesign/sharon-mobile-candidate.mp4`. Original exports and Hero's default film are unchanged.

Left names still select only. The displayed right card or action captures its project at activation. Both software records open notes; StudyGame starts with the one actual screenshot and offers two actions for the same persistent sample. Try app is unavailable. Melo has Visit website and provisional imagery, no Source or unverified demo.

Viewer arrows follow All, Software or Film in visible order and stop at the endpoints. Closing after viewer navigation aligns Hero to the current selected ID's filtered anchor before restoring focus. The initial opening ordinal is not replayed. Native media unloads on close/navigation and when the document is hidden. Covers retain their existing single-source, hidden-tab, offscreen and reduced-motion lifecycle.

Opening a selected YouTube viewer prepares its iframe without autoplay. Our Play control is available immediately. Before readiness, repeated presses collapse to one queued start for that instance. Notes, navigation, hidden-document events, readiness failure and cleanup cancel that queued start. Seek, mute and volume become available on readiness. Title, ordinal, controls and navigation remain outside the entire iframe in compact and expanded views. Genuine failures expose the exact publication link without automatic retries.

Detail reading pauses and hides the YouTube presentation, so no visible drawer backdrop covers its branding or player. Closing notes does not restart it. Expand and return fade the same iframe at its final, unclipped geometry rather than scaling or rotating it. Native films and software keep the 620ms zoom and a single 1.2-degree compact picture tilt. The persistent StudyGame canvas follows the software zoom, then re-aligns at completion; its visible area follows the scrollable product slot without covering the fixed viewer header or footer. Reduced motion skips these animations.

## Earlier integration verification

The earlier integrated browser run passed twelve checks with zero page errors. `docs/redesign-review/verify-portfolio-viewers.cjs` exercises the real thirteen-record roster at 1440 × 900, 1920 × 1080 and 390px phones at heights 844, 600 and 480. It checks select-only rows, captured preview-card opening, filters/ordinals/order, endpoint navigation, close-anchor/focus restoration, one quiz/frame/canvas identity, retained Mars answer and sample scroll, screenshot/sample/fullscreen/navigation/resize/reverse, exact native full sources and cleanup, full-height drawer alignment, confirmed roles, idle/paused/keyboard controls, fullscreen close and reduced motion. Hidden-document cleanup uses a labelled simulated visibility event. YouTube lifecycle/control/error tests use an explicitly labelled SDK stub for all nine exact IDs. Screenshots use CDP, avoiding unrelated font-readiness delays.

Commands actually run:

- `pnpm exec eslint src/content/selected-work.ts src/app/redesign/Hero.tsx src/app/redesign/SelectedWorkGallery.tsx src/app/redesign/PortfolioViewer.tsx src/app/redesign/PortfolioMedia.tsx`, passed.
- `pnpm exec tsc -p docs/redesign-review/tsconfig.portfolio-viewers.json --noEmit`, passed.
- `node --check docs/redesign-review/verify-portfolio-viewers.cjs`, passed.
- `node docs/redesign-review/verify-portfolio-viewers.cjs`, passed, twelve checks, zero page errors. Current receipt is `docs/redesign-review/viewer-integration/results.json`.
- `node docs/redesign-review/verify-portfolio-viewers.cjs --real-sdk`, an earlier run created the real `p1yqihuevu0` iframe and reached SDK readiness without starting playback. The latest separate cold-route rechecks failed before this test, with `Invalid or unexpected token` and no hydrated `data-font-ready` root. Current blocked receipt is `real-sdk-results.json`; one earlier cold-route failure is preserved as `real-sdk-hydration-failure.json`. These failures do not establish a player error. A bounded local HTTP check found the 14,014,088-byte layout chunk complete, identical to the disk file and parseable, so no delivery root cause is claimed.
- `git diff --check`, passed. `git diff --exit-code` for StudyGame, TeamSection, ClosingSequence, EnquiryForm, their team/closing CSS and `next.config.ts` was empty. Staging remains empty.

No full per-video YouTube playback is verified. Cross-browser fallback and actual screen-reader use were not checked. The initial root preview compilation exceeded a 120-second navigation deadline. Later cold navigations intermittently failed hydration; the successful twelve-check run reused one mounted page through resize and reduced-motion changes. No existing server was restarted to work around those failures.

Implementation files are `src/content/selected-work.ts`, Hero, SelectedWorkGallery, their scoped hero/gallery CSS, and the new PortfolioViewer, PortfolioMedia and portfolio-viewer CSS. The contribution guide, this feature document, focused typecheck configuration and focused browser harness are the documentation/validation changes. Existing dirty workshop files, `SelectedWorkGallery.md`, `verify-tablet.cjs` and supplied media assets were preserved.

Port 5782 had no root preview, so a new root development preview was started on loopback only, with launcher PID 69140. Its log is `docs/redesign-review/viewer-integration/dev-server.log`. The protected port 5912 owner preview and its isolated workspace were not modified or restarted. No dependencies, media encodes/downloads, commits, staging, deployment or external app operations were performed. Workshop-only restrictions in the design decisions, ledger, shortlist and selected-film notes are historical. The owner's explicit integration authorisation supersedes them, while their factual and media constraints still apply.

## Main focused review

The separate reviewer could not launch because the Takomi CLI timed out during its version check. No delegation retry or harness substitution was made. Main reviewed the diff and repaired two confirmed YouTube-specific defects: reading previously hid a playing iframe without pausing it, and the native fullscreen zoom also scaled the YouTube pane. The updated harness checks preserved iframe identity, paused reading/close behaviour and the absence of iframe zoom animation.

After those repairs, focused ESLint, the source-only typecheck, script syntax and scoped whitespace checks passed again. A fresh full twelve-check browser run passed with zero page errors. The earlier implementation-only receipt is preserved as `results-implementation.json`; `results.json` is the later passing run. One preceding cold navigation failed hydration before any checks. A bounded CDP diagnostic then reached hydration without a parse failure, and the subsequent normal harness passed. This does not prove that the intermittent development-server condition is permanently resolved. No server was restarted or protected preview changed.

Main visually inspected the integrated native-film and short-phone sample screenshots. No further confirmed blocking integration defect remained in this focused pass. Full real YouTube playback, cross-browser/screen-reader use and root-wide validation remain limitations, not invented pass claims. A main root-wide typecheck diagnostic exceeded its 75-second tool deadline without returning a result; the successful source-only check covers all current `src` files.

The root `tsc --noEmit --incremental false` command includes archived copies under `docs/redesign-review/performance-audit/recheck/`. Their old modes resolve against current aliases and their copied script globals collide. Those workspaces were not changed. `docs/redesign-review/tsconfig.portfolio-viewers.json` checks current `src` and `next-env.d.ts` without archived workspaces or generated development-route files. It inherits the root compiler options and changes no Next build setting.

## Correction verification, 12 October 2026

The correction harness now passes fourteen checks with zero page errors. It replaces the obsolete Load player/native-first assertions with delayed-SDK direct play, one queued start, queued cancellation on notes/navigation/hidden document, ignored stale callbacks and readiness after timeout. Errors provide the exact YouTube fallback link. Reading preserves iframe identity and does not restart playback.

Native footage's rectangle fills the actual fullscreen viewport, with header/title/ordinal/controls/navigation above it. `object-fit: contain` preserves source aspect and inherent letterboxing. Compact viewers also have no outer inset. The core keeps its footer outside the scrollable content, so arrows remain reachable at 390px widths and heights 844, 600 and 480. A long Samsung title is checked at 390 × 480, including non-overlapping expanded strips. Software has a 16:9 slot exceeding 500px height at 1920 × 1080. The same quiz node, Mars answer and saved scroll survive screenshot/sample, navigation, fullscreen, resize and reverse scroll.

Notes use 16px body text and links/credits of 14 to 15px. Drawer body text is 17px. Their heights follow actual content with a viewport cap. The Nifemi profile has only Model and TikTok, with no fabricated image or biography. John's existing photo and confirmed role remain. Screenshots were inspected for native compact/Cinema, sparse project notes and profiles, software at 1920 × 1080 and short phones, and short-phone long-title YouTube. The real paused YouTube Cinema screenshot shows its native title, central play and Watch on YouTube branding inside the complete iframe, with our controls outside it.

Mobile orientation uses actual native metadata, or the 16:9 software/YouTube presentation aspect, after fullscreen. A manual Rotate display action appears only when orientation lock/unlock methods are available and browser fullscreen is enabled. Rejections do not claim rotation. Requests are serialized, and cleanup unlocks only a successful viewer-owned lock, including a late lock after exit. The harness tests this with a labelled capability stub and an unsupported branch. Real mobile device rotation remains unverified.

Current receipts and screenshots are in `docs/redesign-review/viewer-corrections/`. `results.json` is the final fourteen-check stub run. `real-sdk-results.json` passes the real `p1yqihuevu0` SDK readiness and same-iframe fullscreen check without initiating playback. This is not per-video playback, autoplay-policy, ad/recommendation or official-view-count verification. No rate-limit retries were used.

Focused ESLint covering content, Hero, gallery and both viewer components passed without warnings. The all-src scoped typecheck, harness syntax, whitespace check and protected-source diff checks passed. The root-wide typecheck was not rerun because its archived-workspace failure is already documented. No protected owner workspace, port 5912 process, Next configuration, dependencies, media, StudyGame, TeamSection, ClosingSequence or enquiry code changed in this correction pass. Existing root port 5782 was used without restarting it. Staging remains empty.

Cold root navigation still intermittently failed before hydration and before any SDK, with `Invalid or unexpected token`. `cold-layout-parse-failure.json` identifies the failed dev layout chunk. A bounded local diagnostic then observed hydration, a complete 14,014,088-byte HTTP 200 layout chunk identical to disk, and successful Node syntax parsing. The final successful runs used the same loopback route with the harmless query `?viewer-corrections=4`; this is not evidence that the intermittent dev condition is fixed. Earlier failure receipts and the initial passing correction receipt remain beside the final results.
