# Next viewer correction handoff

## Result
Implemented the authorised packet on `website-redesign`, as sole source writer. No prototype or new proposal. Read the full packet and previous handoff first, applied vibe-build and unslop, inspected the supplied contact sheet, then checked the actual handoff lifecycle and new browser paints.

The fullscreen gap came from hiding a popover before fullscreen had taken over. The same shell now stays displayed during that gap. `flushSync` establishes expanded layout and starts the 620ms same-node growth before `hidePopover` and `requestFullscreen`, rather than animating after a browser resize. Return, rejected requests and browser fullscreen changes restore the compact view. Software gets Escape handling even when focus is on its sibling canvas. Orientation waits for the actual fullscreen event, so the earlier pre-handoff layout update does not swallow the lock request.

Compact viewers use 80% dark glass with transparent shell/backdrop ancestors. Desktop left media fits available height and width; the right notes region scrolls independently. Short notes and drawers centre on the right, with 18px note body and 19px drawer body text and soft gradient/glass edges. No text masks or invented profiles. Narrow screens keep the stacked scroll. Html and body overflow/gutter/padding are saved and restored. Tracks disappear only inside the viewer, drawers, rail and sample.

The full-width PortfolioViewer footer is gone. Ordinal and arrows float in separate controls with a reserved content boundary. Brand and Back remain at the top. Software drops In use. Fullscreen hides viewer brand, title, ordinal, navigation, segment, tools and decorative browser chrome. The same app or screenshot fills the viewport. Its own existing app UI remains, including the StudyGame header. Escape exits; a small exit target appears on focus/hover and is visible at low opacity on coarse pointers. No duplicate app, portal or DOM move.

Native films loop on their existing video elements. YouTube uses official `loop=1` and a same-video `playlist`, with no retry/ended restart loop. Direct/queued one-action Play, explicit pause, reading/background pause, genuine errors, disposal and stale callback cancellation remain. Forest declares portrait from the supplied real 360x640 observation. Its complete iframe respects YouTube minimum size and the available desktop height. The slim external controls have enough width even when the portrait player is narrow. No iframe overlay, crop, mask or branding/ad blocker. Nifemi remains on the original 1280x720 full source; its variable framing is not cropped.

## Exact files changed

Source:
- `src/app/redesign/PortfolioViewer.tsx`
- `src/app/redesign/PortfolioMedia.tsx`
- `src/app/redesign/portfolio-viewer.module.css`
- `src/app/redesign/Hero.tsx`, only viewer html/body lock and restoration
- `src/app/redesign/hero.module.css`, only viewer transparency, continuous handoff display and sample scrollbar rules
- `src/content/selected-work.ts`, typed YouTube orientation and Forest declaration only

Documentation:
- `docs/features/PortfolioViewerIntegration.md`
- `docs/features/PortfolioContributionGuide.md`
- `docs/Mockups/01_Public_Website/portfolio-design-decisions.md`
- This handoff

Tests and evidence scripts:
- `docs/redesign-review/verify-portfolio-viewers.cjs`
- `docs/redesign-review/viewer-polish/diagnose-delivery.cjs`
- `docs/redesign-review/viewer-polish/inspect-paints.py`

New receipts, PNG paints, contact sheets, logs and recording are under `docs/redesign-review/viewer-polish/`. Previous `viewer-corrections/` and `viewer-integration/` receipts remain untouched. These are local review artifacts, not staged files.

No source change to SelectedWorkGallery, StudyGame, TeamSection, ClosingSequence, EnquiryForm, their gallery/team/footer styles, Hero film, eager tablet, mobilePreviewLayout or native scroll clock. Preserved the 13 IDs/order, approved covers, filters/selection/focus/reverse/resize, quiz answers/bookmark and existing dirty integration. No protected 5912 workspace/process, Next configuration, archived copies, dependencies, approved media, Funnel/backend/database or full study-app operations. No source encode/download, staging, commit, push, deployment or server restart. The MP4 below contains only captured test paints, not re-encoded source media.

## Commands and results

Passed:

```sh
pnpm exec eslint src/content/selected-work.ts src/app/redesign/Hero.tsx src/app/redesign/SelectedWorkGallery.tsx src/app/redesign/PortfolioViewer.tsx src/app/redesign/PortfolioMedia.tsx
pnpm exec tsc -p docs/redesign-review/tsconfig.portfolio-viewers.json --noEmit
node --check docs/redesign-review/verify-portfolio-viewers.cjs
git diff --check
GALLERY_URL='http://127.0.0.1:5782/redesign?viewer-polish-diagnostic=1' node docs/redesign-review/verify-portfolio-viewers.cjs --disk-layout
GALLERY_URL='http://127.0.0.1:5782/redesign?viewer-polish-diagnostic=1' node docs/redesign-review/verify-portfolio-viewers.cjs --real-sdk --disk-layout
python docs/redesign-review/viewer-polish/inspect-paints.py
ffmpeg -y -hide_banner -loglevel error -safe 0 -f concat -i docs/redesign-review/viewer-polish/transitions.ffconcat -vf 'fps=30,format=yuv420p' -c:v libx264 -crf 22 -movflags +faststart docs/redesign-review/viewer-polish/fullscreen-entry-return.mp4
```

`lint.log` and `typecheck.log` are empty successful receipts. `whitespace.log` contains only existing LF/CRLF conversion notices. A separate seven-file scan found no trailing whitespace in the new/untracked viewer, harness and docs. Protected-source `git diff --exit-code` and `git diff --cached --stat` returned empty, recorded in `protected-source.log` and `staging.log`.

`results.json` is the final fifteen-check browser receipt with zero page errors. It covers opening/project animation, rejected fullscreen, lock/style restoration, fitted desktop picture, independently keyboard-scrolled notes, centred-right profile/glass, portrait control fit, filtered ordinals, focus/close-anchor/reverse, same quiz/frame/canvas and Mars answer, scroll bookmark, app/screenshot takeover, 390px viewports at 844/600/480 heights, 1920x1080, unoccluded tools, native actual loop wrap, direct/queued SDK starts and pause/error/disposal/stale readiness, labelled orientation capability/delayed cleanup/unsupported branches, reduced motion and real CDP-dispatched touch swipes through the stacked content while the document stays locked. Touch dispatch is browser automation, not a physical-phone claim.

`real-sdk-results.json` passed two checks. Books and Bills reached readiness and retained its full iframe through real browser fullscreen with external controls. Forest decoded 360x640, duration 51.181 seconds, naturally reached its end and wrapped on the same iframe using the official loop parameters, then our Pause stopped it. Reading/return did not resume it, and close disposed its iframe. `real-forest-loop-events.json` records the native child-video events across that natural run. This is one real film, not all nine or a view-attribution claim. The subsequent tiny portrait-bar width correction passed the final stub geometry/touch regression run; the natural playback result preceded that CSS-only adjustment.

Earlier accelerated Forest probes did not establish a seek-driven wrap. Their receipts are retained, including the pre-play duration assumption, range-step mismatch, missed short-end probe and idle-control click failure. The successful final check observes one natural 51-second run and wakes controls before Pause. No real Forest seeking claim or unrelated seek implementation change is made. Stub seek tests still pass. CDP synthetic scroll gestures also failed to deliver the expected swipe in this setup; the final test uses actual bounded touchStart/touchMove/touchEnd dispatch and passes. Failure receipts remain, rather than being replaced with pass claims.

## Paints, recording and visual inspection

`paint-results.json` checks all 274 captured CDP paints across sample, screenshot and native entry/return. No almost-entirely-white paint occurred. Native and screenshot captures had a sampled white fraction of zero; the pale app content reached 36.99% white, not a blank browser frame. The geometry receipts assert intermediate sizes, continuous shell display/visibility and real growth/return, not only settled boxes. Capture cadence is not a 60fps performance benchmark or a guarantee that every physical display refresh was sampled.

Recording: `docs/redesign-review/viewer-polish/fullscreen-entry-return.mp4`, 1440x900, 30fps, 7.63 seconds. It joins the captured entry/return sequences with their original capture durations. Individual PNG paints and timestamp/rAF receipts remain in the matching `*-frames/` folders and `*-geometry.json` files.

Visually inspected the supplied original contact sheet and these new captures:
- `native-entry-contact.jpg`, `native-return-contact.jpg`, continuous movie growth/return without the original white gap
- `sample-entry-contact.jpg`, `sample-return-contact.jpg`, same answered quiz through app-only takeover and return
- `screenshot-entry-contact.jpg`, `screenshot-return-contact.jpg`, unobstructed screenshot and restored compact chrome
- `native-nifemi.png`, `centred-right-profile-1440.png`, readable compact film/profile and glass
- `independent-panes-1440x600.png`, notes scrolled while left footage and actions remain fitted
- `forest-fitted-1440x600.png`, complete minimum-size player with a readable, contained external bar
- `sample-1920x1080.png`, large proportional 16:9 sample
- `sample-only-fullscreen.png`, `screenshot-only-fullscreen.png`, no viewer rows occupying the app/image space
- `sample-390x480.png`, scrollable short phone with reachable product actions and floating navigation
- `youtube-cinema-390x480.png`, complete iframe and external edge strips
- `forest-portrait-390x600.png`, `forest-fullscreen-390x600.png`, labelled stub geometry
- `real-forest-portrait-1440x900.png`, real Shorts branding and source framing fully exposed

Black stub frames are not film playback evidence. Mobile portrait compact views can need the one stacked scroll to reach all controls/content, especially when YouTube's minimum iframe size exceeds the remaining space. That is not content hidden beneath a footer.

## Main focused review

Main inspected the current fullscreen handoff, document lock/restoration and looping code, the fifteen-check receipt, independent-pane and centre-right profile screenshots, app-only fullscreen and sampled native entry/sample return contact sheets. Main reran focused ESLint, the all-current-src scoped typecheck, harness syntax, scoped whitespace and protected-source checks; all passed. No additional confirmed requested-behaviour code defect was found in this focused review.

Main's separate ordinary HTTP cold-loading check exceeded its 55-second process deadline without returning a result. It did not use the disk-layout route and is not a passing normal-delivery receipt. Read-only listener checks were inconclusive: a socket connection was accepted, but process lookups did not identify a stable listening PID. No process was stopped or restarted. Final ordinary-preview sign-off remains held, independently of the passing labelled runtime/paint checks. A low-resolution GIF of the recorded transitions and actual UI screenshots were published for owner inspection.

## Owner-authorised preview restart and private Tailscale

After the preceding normal-loading limitation, the owner authorised restarting only port 5782 and using private Tailscale. Main verified old launcher PID 69140 and its Next server child PID 12736, then stopped only those processes. New loopback launcher PID is 32096; `main-server.json` records the exact command and workspace. The protected 5912 launcher PID 79948 was excluded from the stop operation.

Main added a new private Serve route at `https://johnsax.tailb6e2d3.ts.net:3461/redesign` to `http://127.0.0.1:5782`. `main-tailnet.json` confirms existing Web routes are unchanged, port 3460 still proxies to 5912, and Funnel is not enabled for the new route. No public deployment or commit occurred.

The first ordinary browser request exceeded its navigation deadline during initial compilation. Server logs then showed `/redesign` compiled in 101.7 seconds and returned HTTP 200. After compilation, direct loopback and Tailscale HTML checks returned HTTP 200. A fresh browser over the new private HTTPS URL, with normal networking and no bundle interception, hydrated, exposed thirteen records, opened and closed Melo, and reported zero page errors. `main-normal-preview.json` is that passing smoke receipt. This clears local owner-review readiness, not a permanent diagnosis of all earlier intermittent delivery or a full fifteen-check normal-transport rerun.

## Notes-return follow-up, todo 21

The owner requested that the right notes card slide out of the growing media's way and wait until contraction finishes before returning. Main made a localized correction in `PortfolioViewer.tsx` and `portfolio-viewer.module.css`. Native/software notes move right over 240ms, remain hidden/inert during the 620ms return, and reenter over 300ms from the media animation's actual completion callback. Media stacks above the notes. The same notes, player and quiz nodes remain in place. YouTube notes do not show through its fullscreen fade, and no iframe scaling or clipping was added. Reduced motion restores notes immediately.

The focused review caught an outgoing animation's end-frame snap and a browser-initiated exit measuring a hidden popover. The note animation now holds its endpoint until the phase commits; browser exit paints/restores the popover before measuring contraction. Final ordinary private HTTPS checks passed native Nifemi, persistent quiz/Mars retention, the actual Forest iframe and reduced motion, with zero page errors and 170 timing samples. The labelled compiled-bootstrap run also passed. Current all-src TypeScript, harness syntax and whitespace checks passed. Focused ESLint passed during implementation. Receipts and returned screenshots are under `docs/redesign-review/notes-return/`.

The initial preview process had exited; its replacement using inherited captured output did not become reachable. Main stopped only the verified owned 19640/47008 pair and restored the same loopback preview with file-backed background output. Current launcher PID is 68204. `main-server.json` is the current process record, not the older 32096 entry above. The private route remains 3461 to 5782. Protected 5912/3460 was not changed. No staging, push, database changes or public deployment occurred. Earlier failed setup and compiled-bootstrap receipts remain labelled; normal delivery is not claimed permanently repaired.

## Limits and handoff to main

Normal cold dev HTTP delivery remains blocked intermittently. `truncated-layout-diagnostic.json` captured HTTP 200 with only 1,507,328 bytes against the current 14,014,088-byte disk layout bundle and a parse failure. Other attempts received a complete matching bundle. No transport root cause or repair is claimed.

The final runs explicitly use `--disk-layout`, a test-only Playwright route that serves the current compiled `.next/static/chunks/app/layout.js` after syntax validation. It does not replace source, change Next settings or mutate the dev server. Other app resources and the real YouTube iframe use their normal servers. Earlier complete-buffered runs and cold failures are preserved. These passing runtime checks do not mean ordinary cold navigation is fixed.

All-current-src typecheck passed. Root-wide archived-copy validation was not rerun or repaired. Actual phone orientation, physical-device touch, cross-browser fullscreen, screen readers, all-film playback/ad/recommendation states and real Forest seeking remain unverified. Source letterboxing and editorial loop discontinuities remain source properties; no new cut or encode was made.

No confirmed requested-behaviour blocker remains in the focused runtime checks. Main should perform the planned single focused review, with the cold-delivery limitation kept separate from this viewer patch.
