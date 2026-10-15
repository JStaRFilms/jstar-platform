# Scoped interaction fixes

## Scope

Fix findings 1 and 2 from `report.md` only, against audit baseline `5986347`. The only application source changes are `Hero.tsx`, `hero.module.css`, and `ClosingSequence.tsx`. Existing unrelated review files remain untouched. No commit, push, deployment, real enquiry, or external message was made.

## Reproduced failures

The saved production build reproduced both failures before any application edit:

- At 1440×900, Expand film followed by an ordinary View tablet click hit the gallery actions. At 390×844, the corresponding tap hit the gallery wash. `elementFromPoint` confirmed the obstruction and the ordinary click/tap timed out. The control's containing static stage includes both the hero and gallery, so bottom positioning placed it in the second viewport.
- With enquiry email focused at 390×844, shrinking to 390×500 returned to a project anchor, lost focus, and made enquiry content inert. The first reproduction matched the audit's 13,681 → 4,030 scroll displacement. The saved repeated matrix landed at 4,780 instead, another gallery project anchor. In both cases the draft remained in memory but was inaccessible. `interaction-before.json` records the repeated matrix; `release-check.json` remains the original audit receipt.
- Before-fix team/footer resize probes also returned to the gallery. These are manifestations of the same unbounded resize eligibility condition, not added implementation scope.

## Exact fixes

### Reduced-motion controls

`hero.module.css` now anchors tablet, game, and sound controls to the first static viewport rather than the combined hero/gallery stage's bottom. A reduced-motion mobile override retains the mobile sound-control offset without stretching its hit area across the tablet button. Gallery positioning, visibility, and input remain intact. Normal-motion CSS is unchanged.

After the fix, View tablet receives its own hit at `scrollY: 0`, with the gallery below it at 900 px on desktop and 844 px on mobile.

### Resize eligibility and active enquiry editing

`Hero.tsx` uses the recorded pre-resize gallery browsing start and the last project's anchor to decide whether to align a project. Alignment requires browse mode and a height change inside that interval. A one-pixel tolerance accommodates integer scroll rounding at boundary anchors. Geometry is still recalculated outside the interval, without a gallery scroll action.

Removing that action alone exposed ordinary document shrink clamping: the active enquiry could be left in the footer. `ClosingSequence.tsx` therefore captures a focused enquiry control on resize. After upstream section geometry updates, its existing paint restores the completed reveal and brings that control into view before it can become inert. This runs only for an already-focused enquiry control. It does not freeze dimensions, reset the form, or change scroll animation timing.

The final email resize check moves to the new enquiry geometry at `scrollY: 8105`, keeps email focused and non-inert, preserves `resize@example.invalid`, accepts further typed text, and returns to the tall enquiry geometry when restored to 844 px.

## Verification

`interaction-after.json` records ten passing checks and no page errors:

- Reduced motion at 1440×900 and 390×844: Expand film → View tablet → View study game → Return to tablet → Return to screening → Return to opening. Desktop uses ordinary clicks, mobile uses ordinary taps. Both also complete the sequence through Tab/Shift+Tab and Enter. Gallery navigation and filtering remain usable afterward.
- Enquiry email draft/focus retention at 390×844 → 390×500 → 390×844, including continued editing. No form was submitted. Tests abort non-read network requests and WhatsApp navigation.
- Desktop gallery selection survives 900 → 640 height changes. First, middle, and last anchors remain aligned within one pixel.
- Mobile gallery selection survives 844 → 500 height changes at first, middle, and last anchors, using taps.
- Team and footer height changes stay beyond the gallery on desktop and mobile.
- Normal desktop opening, screening, tablet, and quiz states are captured before/after. Forward/reverse travel and a completed quiz answer survive reversal. The quiz and returned-opening screenshots are byte-identical across builds. Tablet captures retain the same composition, with differing live video frames. No follow constants, normal-motion transition styles, media loading, or quiz ownership changed.

Checks run:

- Production build: compilation, type-validation stage, generation, and build completion passed. Logs are `interaction-build.log` and `interaction-build.err.log`.
- Explicit application `tsc --noEmit` in the isolated source workspace passed, recorded in `interaction-typecheck.log`.
- Repository-focused ESLint for Hero and ClosingSequence passed.
- Both verification scripts pass `node --check`; `git diff --check` passed.
- Root-wide TypeScript invocation was blocked by duplicate script declarations from the audit's nested build workspaces. The isolated application check avoids those evidence copies without changing repository configuration.
- Build-integrated lint remains blocked by the isolated workspace's missing `eslint-plugin-react-hooks`, the same setup failure recorded by the audit. This is distinct from the passing repository-focused lint. No dependency/configuration fix was made.

## Evidence and rerun

- `interaction-before.json`, `interaction-after.json` and their run logs.
- `interaction-before-*.png`, `interaction-after-*.png` for reduced controls, enquiry height changes, gallery alignment, team/footer, and representative normal-motion states.
- `verify-interaction-fixes.cjs` contains ordinary-input checks and assertions, with no forced clicks.
- Run `node docs/redesign-review/performance-audit/recheck/run-interaction-tests.cjs after` against the built `interaction-fix-workspace`. Use `before` for the unchanged saved audit build. The runner uses port 5893 and stops its server in `finally`; run suites serially.

The new isolated workspace is ignored and contains local dependency/asset/environment links. Do not distribute it. Share this report, the result files, and screenshots instead. Original audit evidence is unchanged.

## Remaining limitations

These are headless Chrome checks. Synthetic viewport changes are not a real phone's software keyboard or browser chrome, and no Safari/physical-device sign-off is claimed. No performance improvement or universal FPS result is claimed. The first audit's hidden-tab, overflow, and text-measurement recommendations were not implemented.
