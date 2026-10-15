# Local homepage swap verification

## Result

The owner-approved local swap is complete. `/` directly renders the accepted new UI. `/redesign` directly renders the previous homepage. Both return 200 without a redirect.

No staging, commit, push, deployment, Tailscale configuration change, screenshot capture, full Study Game app access or real enquiry submission occurred.

## Source changes

- `src/app/page.tsx` renders the existing Hero and imports its existing transition CSS.
- `src/app/redesign/page.tsx` renders the old eleven sections in their original order. Its render body is byte-identical after newline normalization to the pre-swap root.
- `ConditionalLayout.tsx` moves the own-chrome exception to `/`. The previous homepage keeps global header/footer/navigation/providers without new top padding.
- `Header.tsx`, `MobileBottomNav.tsx`, `MobileNavItem.tsx` and `useSmartNavigation.ts` move previous-homepage section scrolling and scroll spy to `/redesign`. Other route destinations stay the same. Home links on secondary pages return to the new UI.
- Root layout sets the metadata base to the existing production host, `https://www.jstarstudios.com`. The new root has public studio title/description, canonical root, index/follow and its own Open Graph metadata. The legacy page has its own canonical/title/Open Graph URL and noindex/follow.

All existing public asset paths remain unchanged. There are no changes to the accepted Hero/gallery/player code, thirteen portfolio records, team/footer geometry, portrait rendering, enquiry data flow or schema.

## Checks

| Check | Result | Receipt |
| --- | --- | --- |
| Current-source TypeScript | Passed | static-results.json |
| Focused route/layout/nav lint | Passed | static-results.json |
| Temporary current-source production build | Exit0, compile/type generation passed | build-status.json, build.log |
| Desktop/mobile production route checks | Four cases passed | production-route-results.json |
| Desktop/mobile private HTTPS3461 route checks | Four cases passed | private-https-route-results.json |
| Same previous-homepage render body | Passed | scope-verification.json |
| Protected UI/content/style hashes | 24 unchanged | scope-verification.json |
| Production build source vs current root | 388 unchanged | scope-verification.json |
| Whitespace and staging | Exit0, staging empty | scope-verification.json |

Browser checks cover metadata, direct route content, correct chrome/padding, legacy short-press section scroll, desktop long-press page navigation, Home links returning to the new root, new Work first project, Studio .4 intro, retained unsubmitted enquiry draft and footer back-to-top. No page errors occurred in the final production or private checks.

## Build scope

The build used a tool-managed temporary workspace recorded in `build-status.json`, with all current `src`, unchanged package/config files and linked public/dependency/env paths. It did not copy historical workspaces. All 388 source hashes match the root. Next build's integrated lint was disabled; focused lint ran separately and passed. The temporary production server used loopback5793 and was stopped after checks.

Next reported a workspace-root/lockfile inference warning. No tracing configuration or lockfiles were changed. This is not a claim that root-wide `pnpm build`, with archived TS copies included, was run. Root-wide archive handling remains a release-packaging decision. No current-source errors were suppressed.

## Preserved failed checks

`route-results-initial.json` preserves the initial dev run. Next normalized root canonical/OG URLs without a trailing slash, so the test now compares parsed URL values. A legacy desktop context also observed the pre-existing `Invalid or unexpected token` bootstrap issue. It hydrated enough for section navigation, but was correctly recorded as a failure.

`production-route-results-initial-selector.json` preserves a test-selector mistake. The new own navigation also has the accessible name Main navigation. The check now excludes the actual legacy `.glassmorphism-header` instead of incorrectly prohibiting any named navigation. Product code was not changed to satisfy these test assumptions.

Final production and ordinary private checks passed. Successful checks do not prove permanent cold-dev bootstrap reliability.

## Preview

New UI: `https://johnsax.tailb6e2d3.ts.net:3461/`

Previous homepage: `https://johnsax.tailb6e2d3.ts.net:3461/redesign`

Only the absent root5782 preview was restored, using the existing guarded WMI launcher. PID17540 and its exact command are in `root-server.json`; the earlier record is preserved as `root-server-before-launch.json`. Revalidate identity before stopping it. Protected3460/5914 and archived5912 previews were not touched.

## Remaining decisions

Screenshots are still owner-deferred. Real enquiry delivery needs separate permission. Actual Safari, screen-reader and phone toolbar/rotation behaviour are not certified by emulation. The owner accepted the prior Android UI follow-up, but no additional device claims are made here.

Review the exact release/commit scope next. No untracked archives, unrelated dirty work or generated QA/build files should be blanket-staged. Commit, push and deployment require explicit approval and a confirmed target.
