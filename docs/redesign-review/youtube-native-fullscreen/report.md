# Native YouTube fullscreen correction

## Result

YouTube now uses iframe-owned fullscreen. The video iframe occupies the entire viewport; the website adds no control row, header, title, ordinal or navigation to that fullscreen layer. Supported native controls/fullscreen are enabled. Compact controls remain available.

The same iframe/player retains time and mute state. Portrait films request portrait where supported, without stretching/cropping source content or hiding YouTube branding. Browser/native exit restores compact notes and focus. Native-film and software fullscreen remain shell-owned.

## Checks run

- All-current-src scoped TypeScript and focused Hero/Viewer/Media ESLint passed. Harness syntax passed.
- Two focused browser cases passed over ordinary private HTTPS. Landscape measured exactly 760x360 and portrait 390x844 at x=0/y=0, with the iframe as `document.fullscreenElement` and no visible website playback row. The same player/iframe, time63, mute, popover, focus and interactive notes survived exit. SDK and orientation capability were labelled stubs; real browser fullscreen was used.
- Fifteen viewer preservation cases passed over ordinary private HTTPS with no page or parse errors. These include thirteen-record selection/order/filter/ordinals, same quiz/answer/scroll state, native media, keyboard/focus, responsive/reduced-motion and orientation-owned cleanup. YouTube lifecycle cases are labelled stubs.
- Two bounded real-SDK cases passed. Books reached readiness and retained the iframe through true fullscreen without starting playback. Forest decoded at 360x640 for 51.181 seconds, played and naturally looped while its iframe owned the full 1440x900 display, then returned, paused and disposed correctly. The test asserted that the website controls were hidden in fullscreen. The legacy `externalControls:true` receipt field describes the compact control availability, not a fullscreen row. No ad state appeared in the observed interval.

Actual phone/Safari rotation, every film/advertisement/end state, official view attribution and permanent cold-dev delivery are not certified. Source/device aspect mismatch can still produce letterboxing. Do not crop/stretch the player to disguise it.

## Preserved setup failures

The initial exit check observed browser exit before the queued fullscreen-change handler completed. The current check waits for both compact expanded-state=false and notes shown; that initial receipt is preserved.

An interrupted preservation run left a nulled/incomplete JSON receipt. It is not a pass. A subsequent real-player setup received HTTP502 because root port 5782 had no listener, before any checks. Its receipt is separate. The exact root preview was restored with local WMI CLI PID24868; final passing runs used ordinary private HTTPS without app-response replacement or certificate bypass. Revalidate process identity before stopping it. The pre-existing intermittent dev-bootstrap follow-up remains open.

## Scope and next step

Source changes are limited to Viewer, Media, viewer CSS and Hero's descendant-fullscreen cleanup/Escape checks. No content, media, staff portrait, quiz, team/footer/enquiry, dependency, Next configuration or protected-preview change was intended. Current source fingerprint is `a349b7c7713771539d54b622d70cc15721ac5cedfb968765b92b8f00997a4734`.

No software screenshots or full Study Game app use occurred. No route swap, staging, commit, push or deployment occurred. The owner's future intent is new UI at `/` and previous homepage at `/redesign`, as a real route swap after explicit go-ahead. Screenshots remain deferred.

Refresh `https://johnsax.tailb6e2d3.ts.net:3461/redesign` on the phone and retest landscape/portrait fullscreen and return. Device approval and release approval remain separate.
