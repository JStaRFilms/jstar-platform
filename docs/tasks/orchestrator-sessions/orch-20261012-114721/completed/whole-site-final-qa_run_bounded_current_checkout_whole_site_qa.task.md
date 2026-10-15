# Current-checkout whole-site final QA

## Objective
Take over the owner's bounded final QA phase after portfolio content finalisation. Test the current shared root checkout, including the thirteen approved projects and viewer integration. Do not substitute the older isolated footer preview for this source.

## Ownership and baseline
Session: `orch-20261012-114721`. Parent QA thread: `32fd2181-4ba5-4f6b-91bd-2d216540f9b0`. Checkout: `C:/CreativeOS/01_Projects/Code/jstar-platform`, branch `website-redesign`. The portfolio thread is settled and no longer edits. The main QA agent is the only product-code writer. Read-only reviewer work may run alongside inspection, without browser or file mutations.

Portfolio and content changes are uncommitted. Record current tracked/untracked state and source hashes before validation. Preserve unrelated dirty files, archived workspaces, assets and planning documents. Existing `build-viewers` sign-off limitations remain in place unless this phase supplies evidence to resolve a specific one.

## Required references
- `content-finalisation-handoff.md` in this session.
- `docs/features/PortfolioViewerIntegration.md` and `PortfolioContributionGuide.md`.
- `docs/Mockups/01_Public_Website/portfolio-content-ledger.md` and `portfolio-selected-film-notes.md`.
- Current `src/content/selected-work.ts`, `Hero.tsx`, `SelectedWorkGallery.tsx`, `PortfolioViewer.tsx`, `PortfolioMedia.tsx` and their styles.
- Existing viewer, notes-return, ambient-glass and content harnesses and receipts.

## Scope
1. Verify the process in `docs/redesign-review/viewer-polish/main-server.json`, root loopback port 5782 and tailnet-only HTTPS port 3461. Check identity and health before any restart; do not restart an unverified process.
2. Run current-source scoped TypeScript, focused lint, content assertions and whitespace checks. Root-wide TypeScript includes archives; report that boundary rather than modifying archives or relaxing valid checks.
3. Test forward/reverse native scrolling and explicit Work, Studio and contact destinations; preserve original hero film, eager tablet, team/footer geometry, enquiry drafts and the single scroll clock.
4. Test the thirteen-record roster, order, filters, ordinals, committed selection, larger catalog windowing, same-node viewers, focus/keyboard/close and fullscreen return, notes completion timing, reduced motion and responsive sizes.
5. Check accessible names, focus order/traps, drawer reachability and reduced-motion equivalents. Distinguish browser accessibility-tree inspection from a real screen-reader test.
6. Check fresh ordinary root loading, media/network lifecycle and bounded real YouTube samples. Keep SDK-stub, simulated visibility and disk-layout results labelled. Do not claim cold-load root causes resolved or all films/ads/end states/official view attribution verified without actual evidence.
7. Ask the owner for physical-phone feedback when the required device is not available through existing access.

## Hard exclusions
No staging, commit, push, public deployment, database mutation or real enquiry. No full Study Game app access, testing, screenshots or fixes; Try app remains unavailable. Do not create or capture owner-deferred software screenshots. Existing fixed quiz/demo state may be checked through DOM assertions, without visiting the full app or producing new software imagery. Melo is Visit website only, without Source/open-source promotion or an invented demo. Do not redo the content interview or reinterpret approved credits.

Do not create a new worktree or top-level thread. Do not change or replace the protected HTTPS3460 route, its current5914 build/process, or the older5912 archived preview. This packet supersedes older session preview references only for the new root5782/HTTPS3461 QA target.

## Definition of done
- Every executed check identifies the current source fingerprint, target, mode and transport.
- The bounded matrix is run or has an explicit access/permission/environment limitation.
- Only reproduced, in-scope correctness/accessibility regressions receive narrowly scoped fixes and focused retests.
- No confirmed unresolved code blocker is described as passing; unrelated or unverified findings remain separated.
- A human-readable QA report, machine-readable results and owner real-device checklist are written without changing approved content or release state.

## Expected artifacts
`docs/redesign-review/final-qa/` holds a source/status baseline, current-root test receipts, approved QA evidence, confirmed findings and a final report. Any temporary harness adaptations live here and do not overwrite archived harnesses or assets. The session task records execution IDs and outcomes. Final response states blockers, checks actually passed and outstanding owner sign-off.
