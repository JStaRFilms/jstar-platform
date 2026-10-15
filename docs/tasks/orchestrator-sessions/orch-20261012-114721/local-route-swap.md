# Approved local homepage route swap

## Authorization

The owner explicitly approved the local route swap after the machine checks and phone review. This authorizes local source/layout/SEO changes and validation only. No staging, commit, push or deployment is approved. The sole writer is the current main agent.

## Objective

Render the accepted redesigned UI at `/`. Render the unchanged previous homepage at `/redesign`. Use real route content, not a redirect or another showcase URL.

## Scope

Swap the two page renderers. Keep Hero and its CSS/module/media paths in their existing directory, with `/redesign/` public asset URLs unchanged. Move the own-chrome layout exception to `/` and restore legacy global header/footer/mobile navigation/providers at `/redesign`, without adding new top padding to the old homepage.

Carry the old section-scroll/long-press/scroll-spy behaviour to `/redesign`. Keep public secondary-page destinations and canonical Home links intact. Update canonical title/description/indexing for the new root, with the legacy page no-indexed to avoid duplicate homepage content. Reuse the existing social image and production host already recorded in the root layout. Do not change auth, data endpoints, portfolio records, media/state, team/footer/enquiry or screenshot permissions.

## Definition of done

Both routes return the intended content directly. Root has only its own chrome, legacy has its previous chrome and section navigation, and metadata/canonical/robots/asset URLs are correct. Relevant types/lint, build and desktop/mobile navigation checks are run with actual results and environment limitations recorded. No unrelated dirty files or archives are modified.

## Expected artifacts

Narrow page/layout/navigation/metadata changes, `docs/features/HomepageRouteSwap.md`, source/status baseline and validation receipts under `docs/redesign-review/route-swap/`. Existing accepted Hero/gallery/player code remains unchanged.

## Validation boundary

Root-wide TypeScript includes archived workspace copies. Do not edit them or ignore current-source errors to make a build pass. Keep current preview caches and protected3460/5914/archived5912 intact. If an isolated build workspace is needed, copy current source/config, verify hashes and label its scope. No production configuration changes, new worktree, app testing or real enquiry submission is authorized.
