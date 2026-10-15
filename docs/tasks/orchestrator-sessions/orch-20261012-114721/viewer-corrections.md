# Correct portfolio playback and viewer layout

## Objective
Apply the owner's latest correction pass to the integrated portfolio. The owner rejected the extra YouTube loading/native-first steps, instructional prose, padded Cinema, missing arrows, squashed software media, tiny type and oversized empty detail/profile panels. They explicitly selected unified controls with minimal reserved edge strips for YouTube.

## Prime context
Read the current PortfolioViewer.tsx, PortfolioMedia.tsx, portfolio-viewer.module.css, Hero.tsx viewer ownership/sample geometry and hero.module.css, src/content/selected-work.ts, docs/features/PortfolioViewerIntegration.md, the current contribution/design docs and verify-portfolio-viewers.cjs. Current source is an uncommitted completed implementation plus main's two YouTube fixes. Do not overwrite those changes or the protected owner preview.

## Scope
- Remove Load player and native-first playback gating. Prepare the selected YouTube iframe when its viewer opens, without autoplay or loading all gallery embeds. The same Play control can start YouTube directly. One click before readiness queues playback for that active instance; failures remain recoverable, no stale queued start on navigation/hidden notes and no retry loops. Do not promise official view attribution.
- Remove implementation/instructional status prose, normal Loading/Playing messages and public Credits pending/Still to confirm clutter. Keep real project copy, accurate credits and concise genuine errors. Unknown facts stay in review docs/data or are omitted, never invented.
- Native Cinema fills the browser viewport, with title/ordinal/header/controls/project navigation over the footage. Remove CSS-introduced top/bottom/side gaps and compact viewer's outer margin/inset; preserve actual media aspect and inherent source letterboxing rather than cropping the film.
- YouTube uses the accepted minimal edge strips for unified controls/title/project navigation OUTSIDE its iframe. Do not cover branding, ads, recommendations or native player with custom UI; no crop/mask/click blocker. Native film can use full overlays.
- Native video surface toggles play and pause, not play-only. Keep keyboard controls usable.
- Preserve deliberate zoom/tilt expand and return motion. Native/software must retain it; YouTube needs a compliant non-distorting, unclipped motion treatment rather than silently discarding movement. Respect reduced motion.
- Keep previous/next reachable without scrolling past a tall YouTube layout, including long titles and short screens. Follow the existing active filtered sequence and bounded endpoints; preserve idle reveal/accessibility.
- Software picture area is 16:9 and appropriately large at desktop widths, not a fixed 34vh strip. Use available space, and keep viewer navigation useful at the bottom rather than a dead footer zone.
- Rework only viewer notes/drawers/profile proportion and typography. Use readable body/link/credit sizes and content-aware surfaces for short material. Short profiles should not stretch two facts across a blank full-height panel. Keep actual identity, role and links; do not invent biographies or photos. Preserve the established green/pale visual language and horizontal credits where applicable. The owner's sparse-content correction supersedes the earlier rigid full-height/fixed-height requirement where it produces empty panels.
- Mitigate jagged tilted edges without masking/cropping YouTube or throwing away tilt. Avoid doubled transforms and tilted fine text/rules where possible.
- Mobile fullscreen: best-effort auto orientation from real media aspect, a manual rotate action where supported, and unlock this viewer's own lock on exit. Use precise capability checks. Unsupported Safari/browser cases must not crash or falsely claim device rotation. Do not fake it with a sideways CSS page.

## Preserve
Gallery design, roster/covers and original hero film, one clock, persistent StudyGame DOM/answers, shared mobilePreviewLayout, filter/selection/focus/reverse, team/footer/enquiry and protected port5912 workspace remain unchanged. The footer in scope is the viewer's own footer, not ClosingSequence's approved site footer. No broken study app testing, new media encodes/downloads, backend/dependency/database, staging/commit/push/deploy, network exposure or existing process restart.

## Expected artifacts
Narrow source/CSS/data-copy changes, updated correction-specific focused checks/receipts and documentation of the new decisions and remaining real-device/YouTube limits. Public text uses unslop.

## Verification
Focused lint/all-src scoped typecheck/syntax/whitespace. Browser checks of one-action queued/direct YouTube play, active-instance cleanup/errors/reading pause, no instructional public text, native surface play/pause, native full-viewport rectangle and overlays, YouTube edge-strip geometry, visible project arrows for all types, full expand/return node/time preservation and motion/reduced motion, 16:9 software slot and same quiz answers/scroll, short phones and readable content-aware drawers. Inspect actual screenshots, not only DOM assertions. Test orientation capability/cleanup with a labelled stub; do not claim real mobile rotation without a device test. Root-wide archived-workspace and cold-route dev hydration limits are known; report, do not clean unrelated workspaces or falsely report a pass.

## Definition of done
Requested behaviours work, focused checks pass and no confirmed blocking regression remains. Main performs one focused review. Do not stop after proposing more prototypes or require cut approval again.
