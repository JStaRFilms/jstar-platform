# Owner correction QA addendum

## Changed

The current shared root checkout contains the owner's corrections. No staging, commit, push or deployment occurred.

- Monjolaoluwa Aminu uses canonical staff ID JS002, the original `/team/monjola-aminu.jpg` portrait and her verified personal YouTube channel on Books, Fear and Meet. Fear credits her as director, while John's co-direction is unchanged. Books remains Project lead; Meet retains host/presenter, collaborative planning/scripting and her self-filmed room scene. The studio executive role is profile context. All other contributors, thirteen-project order and media are unchanged.
- Fullscreen media and notes-return animations settle on completion or cancellation. Current-animation guards and project changes prevent stale callbacks from leaving new notes hidden. Normal motion durations remain unchanged.
- Software no longer automatically requests landscape. It retains the device orientation, so a portrait phone stays portrait, with a manual rotation icon available when supported. Successful viewer-owned locks are released on exit. This does not claim that every browser supports rotation.
- Native fullscreen headers have no full-width background, border or backdrop blur. Text and rotation icons use shadows. Compact viewer appearance and native playback controls remain in place.
- YouTube fullscreen hides our header/title/ordinal/project navigation and retains one 44px playback row outside the complete iframe. At 760x360 the iframe now occupies 760x316 at x=0/y=0, versus 736x200 at x=12/y=75. The same iframe survives return with time and mute state retained. YouTube's own UI and encoded letterboxing are not hidden or cropped.
- Mobile hero composition uses the stable small-viewport meter for film/tablet geometry and typography. The dynamic stage still covers the viewport; a subtle dark gradient fills newly exposed bottom space. Real viewport/orientation changes still remeasure. Desktop geometry and the single scroll clock are retained.

## Actual checks

Source fingerprint: `c36685f5776a1b375e91a2e582093dfdb7435828aece81543a9c8f1b8a2c2bd0`.

Passed:

- Canonical staff/portrait and exact content-diff assertions. This compares all thirteen records and permits only the three approved identity/story/leadership changes. The Books profile browser check verifies full name, portrait source, executive context and personal channel over ordinary private HTTPS.
- All-current-src scoped TypeScript, focused ESLint and syntax checks for the four new/adapted harnesses. Source/doc whitespace checks are clean.
- Eight asserted owner regression cases over ordinary private HTTPS. They cover no automatic software rotation, accessible icon/manual rotation, canceled media and notes-slide return, transparent native header, browser-initiated native return with the same element at eight seconds, short-landscape YouTube bounds, and retained iframe/time/mute/notes on return.
- Fifteen viewer preservation cases over ordinary private HTTPS. Same quiz/Mars answer/scroll, fullscreen motion, native media, keyboard/focus, filtered ordinals, all thirteen IDs, last-project access and responsive/reduced-motion behaviour passed. YouTube lifecycle and orientation cases use labelled stubs.
- Ten whole-page preservation cases on ordinary loopback HTTP. These cover reduced-motion keyboard/touch controls, enquiry drafts/focus through resizing, forward/reverse quiz progress, selection anchors including project index 12, and team/footer resizing.
- Two bounded real YouTube checks over ordinary private HTTPS. Books reached readiness without starting playback and retained its iframe through fullscreen. Forest decoded at 360x640, naturally looped once through its 51.181-second source, then paused and disconnected correctly. No ad state was observed; unserved variants and official view attribution are not verified.
- A labelled toolbar-height proxy held the small-viewport meter at 600px while the visible viewport changed 600 to 700 to 600. Film bounds stayed x=0/y=0/390x600, tablet Y/scale and scrollY stayed unchanged, and the dynamic stage/gradient covered the extra 100px. This is simulation, not certification of actual Android browser-toolbar animation.

The before reproduction recorded software requesting landscape and notes remaining `waiting`, hidden and inert after a canceled return. The after reproduction restored `shown`, visible and interactive notes. Source-specific failure and successful receipts remain separate.

## Limitations and preserved failures

A fresh private toolbar setup and a fresh private whole-page setup failed before hydration with `Invalid or unexpected token`. Neither reached its behaviour checks. Those receipts are preserved. A subsequent ordinary private toolbar run passed, and the whole-page matrix passed on loopback. A bounded HTTP/HTTPS diagnostic fetched the complete 14,014,088-byte layout script, identical to disk and parseable by Node. No disk-layout fulfilment or app-script replacement was used. This does not establish a permanent cause or fix for the intermittent dev bootstrap condition.

The initial toolbar sample also caught a pre-scroll settled frame. The current proxy waits for the actual screening and settled state before measuring. That sampling receipt is preserved, not presented as a product failure.

Actual Android toolbar/rotation/notes return still needs an owner retest. Safari, real screen-reader use, all films/ads/end states, a combined production build and real enquiry delivery are not certified. No full Study Game app use, software screenshots, external profile navigation or real enquiry submission took place.

## Scope and preview

`scope-verification.json` confirms the source did not change after testing, no unexpected other source changes, the approved content hash and portrait hash unchanged since the identity checks, clean whitespace, empty staging and final private HTTPS200.

Code changes are limited to `selected-work.ts`, Hero and its CSS, PortfolioViewer, PortfolioMedia and viewer CSS. Requested ledger/film notes/handoff and the existing hero/viewer feature docs were updated. The Books name assertions were updated, and all other new QA copies/receipts are under the review folders. Earlier source work, archive copies, protected team/footer/enquiry files, original hero film and eager tablet assets remain intact.

Preview: `https://johnsax.tailb6e2d3.ts.net:3461/redesign`. The exited root preview was restored only on loopback5782 using a local WMI-created process, CLI PID34444. Verify its exact command in `root-server.json` before stopping it. No Tailscale configuration or protected3460/5914/archived5912 workspace changed.

## Owner retest

Refresh the current preview on the Android phone. Check toolbar collapse/reappearance in the hero, native and YouTube fullscreen, the rotation icon, and exit back to visible notes. Check the fixed sample's answer/scroll retention; do not use the unavailable full app. The full-name staff profiles are visible on Books, Fear and Meet. Send any remaining failure with project name and a short recording.
