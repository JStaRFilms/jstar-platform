# Current-checkout final QA

## Result

No confirmed in-scope product-code regression remains in the checks completed here. No product source, content, asset or dependency changed during QA. Device, screen-reader and release sign-off remain open.

The test target was the shared root checkout on `website-redesign`, not the older isolated footer build. HEAD was `3905c036ac993e32da265ab5246d3eddf384b227`. The 25-file source fingerprint was `70ce07e8d986cf7655da3ef0c850b143f835a1cdf0192ddecdbad9ae3352a344` throughout. The thirteen approved projects, including two native films and nine YouTube films, stayed in their approved order.

## Checks completed

- All-current-`src` scoped TypeScript passed. Its existing configuration excludes documentation, archived workspaces and backups. Root-wide archived-copy typing was not used as a release claim.
- Focused ESLint passed for content, Hero, gallery, viewer, media, team and closing components. Content, approved IDs/roles/actions, local asset existence and source whitespace assertions passed.
- Fifteen viewer checks passed through ordinary private HTTPS. These covered catalog/filter/ordinal selection, keyboard last-project access, same-node quiz/player state, notes and focus return, scroll-lock restoration, native media lifecycle, fullscreen transitions and reduced motion. Responsive cases included 390x844, 390x600, 390x480 and 1920x1080. YouTube and orientation cases in this group used labelled stubs.
- Two bounded real-SDK checks passed through ordinary private HTTPS. Books and Bills reached player readiness and retained its iframe through fullscreen; playback was not started for that film. Forest decoded at 360x640 with a 51.181-second duration, completed a natural loop in the same iframe, paused on request and disconnected on close. No ad state appeared during the observed Forest interval. This does not verify unserved ads, every film, all end states, rotation on a real device or official view attribution.
- Ten whole-page checks passed on ordinary loopback HTTP after preview recovery. They covered reduced-motion keyboard/touch controls, forward/reverse scrolling, fixed-quiz progress retention, enquiry focus/drafts through resizing, gallery anchor/selection retention including project index 12, and team/footer resizing without a return to the gallery.
- Navigation, enquiry accessibility-tree names, draft retention and footer composition passed at 1440x900, 390x844 and 320x480 on loopback. Work selected the first real project. Studio reached its approved intro at progress .4, after the entry wipe. The desktop logo was centered at 200px; mobile was right-aligned at 80px. Desktop and stacked mobile lettering matched the approved compositions. No exposed interactive control lacked a name in the inspected enquiry accessibility tree. This was not an actual screen-reader session.
- Three fresh cache-disabled loopback contexts and three fresh cache-disabled ordinary private HTTPS contexts hydrated with no page errors or script parse failures. Compared local script responses matched their current disk bundles. The tablet WebP remained eager and decoded at 1672px natural width. Private font/hydration readiness took approximately 4.7, 11.5 and 4.8 seconds. These are dev-preview observations, not production performance scores.

No test visited the full Study Game app, created software screenshots, followed external product/profile links, submitted an enquiry or changed a database. API submission safety guards were active. No disk-layout transport, document/compiled-app response replacement or certificate bypass was used in passing browser checks. YouTube SDK responses were simulated only in the explicitly labelled stub group.

## Failures and classification

The original failed receipts remain beside the passing results.

1. A legacy drawer test measured notes during their approved return animation. Settled notes and drawer aligned at x=942.890625px. The new QA copy waits for the actual `shown` phase; media keyframes and intermediate geometry still receive checks.
2. An old sparse-brief height assumption did not fit the owner-approved Books story. The QA copy checks viewport bounds and internal scrolling instead of shortening content to meet an arbitrary 450px draft limit.
3. The older whole-page quiz test skipped the now-required sample action and targeted an inert game. The current flow explicitly opens the fixed sample before answering. The full application stays unavailable.
4. The new navigation probe initially expected the beginning of the team wipe. Source inspection confirmed `jumpToIntro()` intentionally lands at progress .4. The final test checks that approved destination.
5. One private bootstrap attempt produced `Invalid or unexpected token` before tests began. Later, recorded preview processes were absent and Tailscale temporarily lost state/DNS. The first background root restart was not durable and later exited; a detached breakaway root process replaced it. Final ordinary private HTTPS cold-context checks passed. The original parse error's root cause is not proven, and no permanent cold-load fix is claimed.

These findings justified changes to QA copies and preview recovery, not product-code changes. The stalled delegated reviewer was interrupted at the owner's request. It supplied no accepted findings; this report does not claim an independent review pass.

## Preview and preservation

Current preview: `https://johnsax.tailb6e2d3.ts.net:3461/redesign`.

The active root CLI PID is 17944, started at 2026-10-14T13:08:37Z with the exact root Next dev command, loopback address 127.0.0.1 and port 5782. See `current-root-server.json` and revalidate its command before stopping it. The historical `viewer-polish/main-server.json` still records exited PID 29496 and was deliberately not overwritten.

Tailscale connectivity recovered without agent configuration changes, and the final ordinary private HTTPS check returned 200. Its status still reported a DNS configuration permission warning; this QA did not repair that system setting. The existing 3461-to-5782 and protected 3460-to-5914 mappings remained in place. The protected PID30340 was already absent when inspected; this QA did not restart that preview or modify its workspace. No Funnel, public deployment, new worktree, top-level thread, staging, commit or push occurred.

`final-scope-verification.json` recorded no source hash changes, no protected-record changes, no added/removed tracked dirty entries and nothing staged. Unrelated work and archived receipts stayed untouched.

## Remaining sign-off

Use `owner-device-checklist.md` on a physical phone. Desktop emulation cannot certify browser toolbar movement, touch playback performance, iOS Safari fullscreen/rotation or VoiceOver/TalkBack use.

Real contact delivery needs separate authorization. A new production build of the combined checkout was not run in this phase; the earlier isolated footer build is not evidence for the combined portfolio. These checks do not authorize moving `/redesign` to the main route, merging, pushing or deploying.

## Receipts

- `baseline.json`, `static-results.json`, `final-scope-verification.json`
- `portfolio-dom/results.json`, `portfolio-dom/real-sdk-results.json`, `portfolio-dom/real-forest-loop-events.json`
- `interaction-dom/interaction-after.json`, `navigation-a11y-results.json`
- `cold-bootstrap-local-results.json`, `cold-bootstrap-results.json`, `cold-bootstrap-dns-failure.json`
- `drawer-reproduction.json`, `drawer-classification.md` and preserved initial-failure receipts
- `current-root-server.json`, `root-context-server-exited.json`, `private-preview-health.json`
