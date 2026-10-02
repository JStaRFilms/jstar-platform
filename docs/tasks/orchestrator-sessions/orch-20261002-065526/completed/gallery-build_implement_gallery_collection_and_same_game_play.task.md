# Task 03: Implement gallery collection and same-game play

## 🔧 Agent Setup (DO THIS FIRST)
### Workflow to Follow
Build from approved composition and contract.
### Prime Agent Context
Read `docs/features/SelectedWorkGallery.md`, this session master plan, `docs/features/DesktopHeroRedesign.md`, `src/app/redesign/Hero.tsx`, scoped CSS, StudyGame and quiz source. Read original gallery-preview.html/css/mjs and study-game source in `C:/Users/johno/Documents/Codex/2026-09-30/https-www-jstarstudios-com-https-www/outputs/`.
### Optional Skill / Context Overlays
unslop; frontend-ui. Main read creative motion, performance and concept evaluation references fully; preserve one clock, finite count-driven ranges, bounded media and cleanup.

## Objective
Implement approved Selected Work immediately after playable quiz, preserving SAME StudyGame subtree and all earlier motion.

## Scope
Route-local Hero extension, controlled gallery and scoped CSS, typed project data following `src/content/` pattern with no shared schema mutation, copied four gallery film derivatives. Minimal focused docs updates. No commits/staging, new dependencies, team/enquiry or unrelated production changes.

## Requirements
- Preserve pre-gallery denominator/timing/ranges through 4.3. Append gallery entrance and count-based browsing/rest/finite release. Quiz shrinks right live, page darkens, catalog appears and bounded tilted neighbours gather behind it. Native reversible scroll, same clock 1000ms, no extra RAF/scroll smoothing/800ms chase.
- Filtered collection controls names/media/counter/range from same position. Each project readable. Approx 5–6 names visible at desktop, active centred/clamped, keyboard focus fully visible. List vertically moves with collection; use clipped translated list, NOT independent scroll area. Rendering all buttons in bounded clipped window is acceptable if simpler than slice churn; media must be bounded. Max three ordinary neighbouring panels, no hidden video downloads.
- Scroll commits, clears previews, overrides incidental hover. Pointer previews rearm only after settled + deliberate >=4px movement without requiring leave/reentry. Keyboard focus independent, never coupled to pointer gate. Preview never rewrites scroll. Leaving restores committed. Names click/Enter/Space commit + instant scroll alignment, NEVER open. Project action separate.
- Filters preserve current ID if included else first and synchronously align updated range; counter uses filtered ordinal/total. Single matching project no extra browsing pin; zero graceful. Continue exits into plain end boundary, normal scroll releases after final. No team teaser.
- Same StudyGame frame remains mounted once. Browsing inert pointer/key/scroll; Try it commits, readable top-layer play of same DOM, external visible Back control, locks gallery only explicit play, focus trap and Escape returns to browsing not opening; restore same collection/project and quiz state. Topic/answers/score/results preserved, explicit replay/topic resets unchanged. Reduced mode static catalog with all actions/play/filter, no long zoom/pin.
- Only active visible film preview has source/play, paused unloaded when hidden/offscreen/dialog/play/background. Reduced defaults posters. Nifemi action full approved `/redesign/nifemi.mp4`, Sharon excerpt action clearly labelled; school cover provisional/no fabricated action. No claimed dates or roles without verified source.

## Definition Of Done
Working entrance/reverse, browse/selection/filter/play and finite exit in Chrome; no earlier regressions, duplicate game, fake data, browser exceptions or inaccessible exits. Lint/types pass. Provide DOM/data attributes sufficient to assert active/committed/displayed/filter/mode/settled and dynamic range, not production telemetry. Test fixture injection may be via optional projects prop/test-only mounting with generated collection, not shipped duplicated content/debug URL. Ensure 20-project and single tests possible without rewriting animation.

## Expected Artifacts
Gallery component/CSS and content module, narrow Hero/CSS update, four copied gallery preview assets, feature docs updated to actual implementation, bounded smoke evidence.

## Constraints
Current branch website-redesign and prior code db5b88b. Preserve ALL staging and unrelated files including previous session docs and original videos. Do not start/restart server unless truly blocked; preview 5782 responds. No MCP browser. Existing Playwright path available, use 15–25s readiness and post-hydration CDP; do NOT wait repeatedly on fonts or run long all-topic suite for each tweak.

## Dependencies
contract and approved-design.

## Verification
Parent will independently run required comprehensive browser/20/single/reduced checks and recording, then one focused reviewer. Builder should run proportional checks and report exact changed files, any uncertainty and how to inject fixtures.

## Builder checkpoint
Implementation complete, pending parent verification and recording. Hero appends count-driven ranges to its unchanged denominator and 1000ms clock. The controlled catalog uses a clipped translated six-row window and at most three ordinary neighbours. Try it presents the same mounted game frame with a manual popover, visible Back, focus trap and Escape exit. Typed static content and four unchanged preview copies are in place. School remains provisional; Sharon opens only a labelled excerpt.

Checks run: `pnpm typecheck`, focused ESLint on Hero/gallery/content, `git diff --check`, standalone Chrome same-game/play/filter/viewer/reduced smoke, and 1440×900 plus 390×844 layout smoke with zero horizontal overflow. Parent still owns the detailed 20/single, pointer/keyboard, reverse, media and recording checks. Optional `Hero projects` prop supports temporary fixture mounting without a shipped debug route. See `docs/features/SelectedWorkGallery.md` for selectors and the actual architecture. No dependencies, server restart, commit or staging changes.
