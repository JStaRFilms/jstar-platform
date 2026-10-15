# Owner mobile viewer corrections

## Agent setup

Build follow-up in session `orch-20261012-114721`. Execute directly in the current shared root checkout as sole writer. The portfolio thread has handed off and will not edit product files. Do not launch another writer or restart Genesis.

Read `src/content/about-company.ts`, `src/content/selected-work.ts`, `src/app/redesign/PortfolioViewer.tsx`, `PortfolioMedia.tsx`, `Hero.tsx` and their styles. References are `docs/features/PortfolioViewerIntegration.md`, `DesktopHeroRedesign.md`, the content ledger/selected-film notes and `content-finalisation-handoff.md` in this session.

## Objective

Apply the owner's final staff-credit correction and repair the mobile fullscreen/viewport problems reported after machine QA. Screenshots show an opaque full-width native header, absent compact notes after software fullscreen return and a cramped YouTube player surrounded by website chrome.

## Scope

- Monjolaoluwa Aminu is canonical staff JS002, using the existing portrait and verified personal channel on Books, Fear and Meet. Fear credits her as director and John as co-director. Preserve Books project lead and Meet host/presenter/planning/scripting/self-filmed room-scene roles. Keep studio executive duties in profile context.
- Reproduce notes stuck after fullscreen exit, including cancellation/orientation/viewport changes. Restore notes after the current return completes without replaying or replacing quiz/player state.
- Do not force software fullscreen into landscape. Keep manual/device rotation available and replace the visible Rotate display text with an accessible icon.
- Remove the native fullscreen header's full-width glass panel. Use shadows for its text/icons, preserving compact styling and playback controls.
- Give YouTube's complete iframe more of the fullscreen viewport, especially short landscape. Remove unnecessary website header/title/navigation space; keep any custom playback controls outside the iframe. Do not crop, transform, cover branding or change platform behaviour to hide it.
- Investigate toolbar-height snapping before choosing an implementation. Keep the single native-scroll clock, tablet alignment and real orientation/keyboard resizing. A gradient is only a possible gap treatment, not permission for a new visual design.
- Update narrow behaviour docs, focused tests and QA addendum. No changes to other contributors, project order/media, source assets or unrelated code.

## Dependencies

The bounded whole-site QA and content handoff are complete. The owner has now supplied actual Android feedback. The canonical staff record was read before edits. The identity-only correction and source checks are completed; fullscreen/viewport work remains in progress.

## Definition of done

The reported notes-return defect is reproduced and fixed with a focused regression check. Software no longer auto-forces landscape. Rotation controls have accessible icon labels. Native fullscreen header has no full-width background. Short-landscape YouTube layout maximizes player space without iframe overlap/cropping. Toolbar handling has measured evidence and any physical-device limitation is explicit. Relevant lint/types and focused state/focus/motion checks pass. Report exact checks, preserved dirty work and remaining owner device sign-off.

## Expected artifacts

Narrow source/style changes, content ledger/film notes/handoff corrections, focused receipts under `docs/redesign-review/`, and a QA addendum. Keep original failed/historical receipts.

## Constraints and review

Preserve all thirteen project IDs/order/media, original hero film, eager tablet WebP, quiz DOM/answers/scroll, native and YouTube instance state, notes/drawer focus, enquiry drafts and accepted team/footer geometry. No full Study Game app use or screenshots, invented software images, dependencies, external data mutations, staging, commits, pushes or deployment. Do not touch protected 3460/5914 or archived 5912 workspaces. Existing root5782/private3461 are the test target; revalidate process identity before restart. Review the final diff against these boundaries, not speculative redesign ideas.
