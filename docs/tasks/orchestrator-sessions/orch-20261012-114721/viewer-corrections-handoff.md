# Viewer correction handoff

## Result
Implemented the approved correction packet on `website-redesign`. No prototype, cut approval, new dependency or external publication. Main's focused review is complete. It found no remaining confirmed blocking correction defect.

Our Play button directly starts the selected YouTube player. Opening prepares only that iframe without autoplay. A pre-ready click queues one start; notes, hidden documents, navigation, failure and disposal cancel it. Stale callbacks and late readiness cannot start background playback. Genuine errors offer the exact published YouTube link, without retry loops or view-count promises.

Native Cinema's video rectangle covers the browser viewport. Header, title, ordinal, playback controls and bounded project navigation are overlays; source aspect and inherent letterboxing remain. Clicking the native footage toggles both play and pause. Compact viewers have no outer inset. The viewer footer stays outside scrollable content for every media type, including short phones.

YouTube has narrow external title/control/navigation rows and a complete, unrotated iframe. Expand and return fade that same iframe at its final geometry, never scale, crop, mask or cover it. Native/software retain zoom and one 1.2-degree compact picture tilt. The persistent quiz canvas follows software zoom and scroll geometry without covering the fixed header/footer. Reduced motion skips animations.

Software has a 16:9 slot, over 500px high at 1920 × 1080. Notes and drawers follow actual content, with 16px note body and 17px drawer body text. Nifemi's profile contains only Model and TikTok, without a photo or bio. John retains his actual photo and approved role. Pending/instructional/debug/loading prose is absent from normal public viewer UI; unknown facts remain in review records or pending data.

Orientation uses native metadata or the declared 16:9 software/YouTube presentation, with automatic attempts on mobile-sized/coarse-pointer fullscreen and a manual action when supported methods are present. Requests are serialized and only the viewer's successful lock is unlocked, including late completion after exit. Unsupported browsers do not get fake sideways CSS. Actual device rotation is not verified.

## Exact files changed in this pass

Source:
- `src/app/redesign/PortfolioMedia.tsx`
- `src/app/redesign/PortfolioViewer.tsx`
- `src/app/redesign/portfolio-viewer.module.css`
- `src/app/redesign/hero.module.css`, viewer-only inset, canvas tilt and software-scroll clipping rules
- `src/content/selected-work.ts`, public copy only; IDs, roster, cuts, sources and contributors preserved

Validation and documentation:
- `docs/redesign-review/verify-portfolio-viewers.cjs`
- `docs/features/PortfolioViewerIntegration.md`
- `docs/features/PortfolioContributionGuide.md`
- `docs/Mockups/01_Public_Website/portfolio-design-decisions.md`, current correction note above historical decisions
- This handoff
- New receipts/screenshots under `docs/redesign-review/viewer-corrections/`

Hero TSX, gallery TSX/CSS, StudyGame, team, ClosingSequence and enquiry were not edited by this correction pass. Their pre-existing uncommitted integration remains. No protected owner workspace/port 5912, Next configuration, archives, media, dependencies, backend or database changed. Existing loopback port 5782 was used without restart. No staging, commit, push or deployment.

## Commands and receipts

All passed:
- `pnpm exec eslint src/content/selected-work.ts src/app/redesign/Hero.tsx src/app/redesign/SelectedWorkGallery.tsx src/app/redesign/PortfolioViewer.tsx src/app/redesign/PortfolioMedia.tsx`, no lint warnings
- `pnpm exec tsc -p docs/redesign-review/tsconfig.portfolio-viewers.json --noEmit`, all current src; also run after each TypeScript edit
- `node --check docs/redesign-review/verify-portfolio-viewers.cjs`
- `git diff --check`, only existing CRLF conversion notices
- Protected-source `git diff --exit-code`, empty; `git diff --cached --stat`, empty
- `GALLERY_URL='http://127.0.0.1:5782/redesign?viewer-corrections=4' node docs/redesign-review/verify-portfolio-viewers.cjs`, fourteen checks, zero page errors
- Same command with `--real-sdk`, one real SDK readiness/fullscreen check, zero page errors, no initiated playback

`docs/redesign-review/viewer-corrections/results.json` is the final fourteen-check receipt. It covers real roster/filter/selection/focus/reverse behaviour, identical quiz DOM/answer/scroll, native sources and full viewport, surface and keyboard playback, idle controls, zoom/return and reduced motion, delayed SDK/direct queued starts and cancellations, stale errors/readiness timeout, exact nine YouTube IDs, fallback, external strip geometry, visible arrows, 16:9 software, 390px phones at 844/600/480 heights, long Samsung title at 390 × 480, and labelled orientation capability/delayed cleanup/unsupported tests.

`real-sdk-results.json` verifies actual `p1yqihuevu0` readiness, enabled unified controls and the same iframe across browser fullscreen. It does not verify playback or channel view attribution. Real screenshots show the native title, central play and Watch on YouTube branding, with custom controls outside the iframe.

Earlier failures are preserved, including `cold-hydration-failure.json`, `cold-hydration-recheck.json`, `cold-layout-parse-failure.json`, `sample-geometry-failure.json`, `short-sample-overlay-failure.json`, `fractional-arrow-failure.json` and the harness selector failure. `results-initial-pass.json` retains the initial fourteen-check correction pass before extra timeout, long-title and delayed-orientation assertions were added. `local-layout-diagnostic.json` records the bounded local layout-delivery diagnostic.

## Screenshot inspection

Inspected actual saved PNGs, not just rectangles:
- `native-nifemi.png` and `native-cinema-sharon.png`, readable upright chrome, preserved film tilt and edge-to-edge native rectangle with overlays
- `notes-nifemi.png`, `profile-nifemi-model.png`, `profile-nifemi.png`, readable, content-sized pale drawers with only approved facts
- `sample-1920x1080.png` and `sample-390x480.png`, large desktop quiz and short-phone scroll without covering Back or arrows
- `youtube-390x480.png`, `youtube-cinema-390x480.png`, `youtube-long-title-cinema-390x480.png`, external strips and reachable navigation
- `youtube-notes-sparse.png`, short factual drawer and hidden, paused iframe
- `real-youtube-notes-1440x900.png` and `real-youtube-cinema-1440x900.png`, actual SDK/native branding exposed

Black frames in labelled stub screenshots are not movie footage. The real readiness screenshots were taken without starting playback.

## Main focused review and real Play check

Main read the correction code and the fourteen-check receipt, visually inspected native Cinema, the compact Nifemi profile, large desktop software sample and real YouTube Cinema screenshots, and reran focused ESLint, the all-src scoped typecheck, harness syntax and scoped whitespace checks. All passed.

One bounded check then opened the selected Books and Bills viewer using the real SDK, with no player stub. Its iframe prepared automatically, no Load player button existed, and one click on our Play control started playback. Native iframe video decoding showed 1280 × 534 at advancing time, duration 422.041 seconds. Our Pause control stopped it, with zero page errors. The exact receipt is `docs/redesign-review/viewer-corrections/real-play-main.json`. This tests actual start/decode/pause for that film, not full-length playback of all nine videos or channel view attribution. No server restart or publication occurred.

## Limits

Cold root dev navigation intermittently failed before hydration or any SDK. CDP identified `/_next/static/chunks/app/layout.js` as the failed parse. A bounded diagnostic subsequently reached hydration and observed HTTP 200, a complete 14,014,088-byte layout chunk identical to disk, and successful Node syntax parsing. No delivery root cause or permanent fix is claimed. The final harness reused one mounted page across viewport/reduced-motion changes and used a harmless route query; no server restart.

Root-wide typecheck includes archived copied workspaces and was not rerun or repaired. The passing scoped check covers all current src. Full real YouTube playback for all nine films, ad/recommendation states, actual mobile rotation, cross-browser behaviour and screen-reader use remain unverified. No YouTube rate-limit retries were made.
