# Redesign review records

This directory keeps the reports, test programs and structured results from the website redesign. The accepted site now renders at `/`; the previous homepage is at `/redesign`. Older reports and scripts describe the review URLs and source revisions they actually tested. They are historical evidence, not claims that every old command targets the current homepage.

## Current evidence

- `route-swap/report.md`: direct homepage/legacy routes, metadata, desktop/mobile navigation and isolated production-build checks.
- `youtube-native-fullscreen/report.md`: native iframe-owned fullscreen, state return, labelled browser stubs and bounded real YouTube checks.
- `owner-mobile-corrections/report.md`: staff identity, animation cancellation, toolbar-height simulation and the earlier fullscreen treatment. The YouTube fullscreen report supersedes its external-control-row design.
- `final-qa/current-root-20261014/report.md`: earlier whole-site checks, assumptions corrected in tests and physical-device limits.
- `commit-scope/proposal.md` and `commit-scope/commit-result.json`: the approved 54-file application commit, `68b3101`.

Performance, gallery, team, content and failed-test records remain in their original folders. A failed receipt is not a pass. A labelled SDK/orientation stub or modified bootstrap transport is not evidence for real-device behaviour or ordinary network delivery.

## Capture cleanup

The owner requested retaining useful mockups, orchestration records, reports and JSON, while removing generated clutter. On 15 October 2026, 728 untracked generated captures, console logs, compressed response dumps, stale process markers and comparison-test artifacts were removed. The deletion list, byte sizes, hashes and reasons are in `cleanup-20261015/plan.json`; the applied result is in `cleanup-20261015/result.json`.

Historical reports may still name screenshots or recordings that were removed by this cleanup. Their written observations and structured measurements are preserved. Removing a capture does not establish a new test result. The interrupted NUL-only receipt was not valid JSON and was never counted as a pass; its hash and removal reason remain in the cleanup record.

Useful reports/checks were copied from protected preview workspaces into `archived-checks/`. The copies preserve their original bytes. Those historical scripts may depend on the original local workspace paths, installed Chrome/Playwright or existing local credentials. Do not run a process launcher or assume a previous PID still identifies the same process without checking.

## Local-only archives

The owner chose to retain original/reference film exports, local preview-process records and 18 copied preview workspaces on disk, with exact rules in `.git/info/exclude`. Those rules are local to this checkout, not a shared ignore of application source. The paths are listed in `cleanup-20261015/plan.json`. They are intentionally absent from a clean clone.

No dependency directories, environment-file links, build caches or copied application workspaces were added to Git. The protected copies were not modified. Their ignored TypeScript copies can still affect a root-wide local typecheck that scans the entire disk tree; a clean clone does not contain them.

The comparison-only `/redesign/film-comparison` route and its unused 5.24 MB candidate were explicitly removed at the owner's request. The live original Nifemi hero film was not changed. `docs/Mockups/01_Public_Website/portfolio-motion-covers.html` now links the already tracked, approved Sharon playback encode rather than a local-only master export.

## Release limits

These records do not authorize a push, deployment, real enquiry submission or further image capture. The documented intermittent dev cold-load issue, hosting/domain configuration, email-result handling and real delivery checks remain separate from artifact cleanup.
