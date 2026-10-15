# Proposed website commit

## Approval requested

Commit the 54 files below on `website-redesign`, starting from `3905c036ac993e32da265ab5246d3eddf384b227`. This proposal is not staging or commit authorization. Nothing is staged. A commit would not authorize a push, deployment, real enquiry submission or screenshot capture.

Suggested commit message:

```text
feat(site): promote redesigned homepage and integrate portfolio viewers
```

## What belongs together

These changes complete the accepted portfolio integration and mobile/fullscreen corrections, restore the desktop footer logo, and make the new UI the actual `/` homepage. The previous homepage moves to `/redesign`, with its navigation and layout behaviour preserved. The original hero film stays unchanged.

The three new viewer files are required imports, not optional experiments. The 22 media files are used by the static portfolio records and total 27.87 MiB. Sharon's accepted mobile encode is its runtime film; the original larger export is not needed by the website.

## Exact file list

### Source, 18 files

```text
src/app/ConditionalLayout.tsx
src/app/layout.tsx
src/app/page.tsx
src/app/redesign/ClosingSequence.tsx
src/app/redesign/Hero.tsx
src/app/redesign/PortfolioMedia.tsx
src/app/redesign/PortfolioViewer.tsx
src/app/redesign/SelectedWorkGallery.tsx
src/app/redesign/closing.module.css
src/app/redesign/hero.module.css
src/app/redesign/page.tsx
src/app/redesign/portfolio-viewer.module.css
src/app/redesign/selected-work.module.css
src/components/layout/Header.tsx
src/components/layout/MobileBottomNav.tsx
src/components/layout/MobileNavItem.tsx
src/content/selected-work.ts
src/hooks/useSmartNavigation.ts
```

### Required media, 22 files

```text
public/redesign/contributors/winning-worship-way-logo.webp
public/redesign/gallery-books-and-bills-10s.mp4
public/redesign/gallery-books-and-bills-poster.jpg
public/redesign/gallery-brushes-of-gold-10s.mp4
public/redesign/gallery-brushes-of-gold-poster.jpg
public/redesign/gallery-everything-10s.mp4
public/redesign/gallery-everything-poster.jpg
public/redesign/gallery-fear-women-10s.mp4
public/redesign/gallery-fear-women-poster.jpg
public/redesign/gallery-forest-sequence-10s.mp4
public/redesign/gallery-forest-sequence-poster.jpg
public/redesign/gallery-meet-monjolaoluwa-10s.mp4
public/redesign/gallery-meet-monjolaoluwa-poster.jpg
public/redesign/gallery-nifemi-10s.mp4
public/redesign/gallery-samsung-vivid-colors-10s.mp4
public/redesign/gallery-samsung-vivid-colors-poster.jpg
public/redesign/gallery-sharon-10s.mp4
public/redesign/gallery-welcome-to-church-10s.mp4
public/redesign/gallery-welcome-to-church-poster.jpg
public/redesign/gallery-worship-medley-10s.mp4
public/redesign/gallery-worship-medley-poster.jpg
public/redesign/sharon-mobile-candidate.mp4
```

### Feature and content documentation, 14 files

```text
docs/Mockups/01_Public_Website/portfolio-content-ledger.md
docs/Mockups/01_Public_Website/portfolio-design-decisions.md
docs/Mockups/01_Public_Website/portfolio-media-manifest.json
docs/Mockups/01_Public_Website/portfolio-selected-film-notes.md
docs/Mockups/01_Public_Website/portfolio-youtube-shortlist.md
docs/Mockups/01_Public_Website/portfolio-youtube-viewer-review.md
docs/features/AdvancedNavigationSystem.md
docs/features/ClosingSequence.md
docs/features/DesktopHeroRedesign.md
docs/features/HomepageRouteSwap.md
docs/features/MobileBottomNavigation.md
docs/features/PortfolioContributionGuide.md
docs/features/PortfolioViewerIntegration.md
docs/features/SelectedWorkGallery.md
```

Keep the content records so future changes do not invent credits, change approved cuts or mistake selected publications for generic channel picks. Their historical workshop/QA references are not runtime inputs. The route-swap feature document records the current `/` versus `/redesign` meaning. Older records still describe their original review URLs and local-only evidence.

## Exclude and leave on disk

- All new `docs/redesign-review/` scripts, receipts, captures, logs and copied workspaces, including this scope proposal. These are local QA artifacts, not application dependencies. The changed tracked `docs/redesign-review/verify-tablet.cjs` stays unstaged too. It still targets the former review URL and is not a current release test.
- New `docs/tasks/orchestrator-sessions/` records and local orchestration state. Previously tracked planning history remains untouched.
- Untracked `docs/Codereview/` files, reference videos and HTML design alternatives/prototypes.
- `src/app/redesign/film-comparison/FilmComparison.tsx`, its CSS and `page.tsx`. This is the unlinked comparison-only route, not the homepage or accepted native player.
- `public/redesign/nifemi-mobile-candidate.mp4`, `sharon-playback-candidate.mp4` and `sharon.mp4`. Together these unused/comparison-only exports are 98,505,479 bytes. The approved original Nifemi film is already tracked and remains unchanged.
- Secrets, environment files, dependency folders, generated build caches, archives and unrelated work.

No excluded file should be deleted, reset or blanket-staged. Do not use `git add .` or `git add -A`.

## Verification performed for this review

`manifest.json` records the exact candidate paths and SHA-256 hashes, plus the excluded inventory. `verification.json` records the checks.

- 531 local source imports and 41 relevant public asset URLs resolve to tracked files or this exact candidate set. No missing dependency was found.
- All current source files still match the prior successful production build. Its source/config copies and build limits are recorded in `route-swap/build-status.json`.
- Prior production and private-HTTPS desktop/mobile route checks passed. This review compared their source hashes; it did not run another build or browser session.
- No tracked archive TS files exist. The earlier root-wide TypeScript collisions came from untracked copied QA workspaces. Keep them out of the commit rather than changing TypeScript/Next configuration.
- The index is empty. No source, content or media file was changed by this review.

This is a file-scope and dependency review, not a replacement independent product-code review. The owner-stopped reviewer remains stopped.

## Still separate from committing

Screenshots remain deferred. Real enquiry delivery requires permission. Intermittent cold dev bootstrap delivery is not certified fixed. Physical Safari/screen-reader/toolbar/rotation checks have the previously recorded limits. No deployment target has been approved by this proposal.

## On approval

First recheck HEAD, index and every candidate hash. If anything changed, stop and show the difference. Stage only the approved explicit paths and inspect the staged diff before committing. Leave every excluded file and existing unrelated change intact. Report the resulting commit ID, with no push or deployment.
