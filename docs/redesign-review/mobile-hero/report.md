# Mobile hero review

The mobile opening now uses three lines and a two-line supporting sentence. The film enters at 75vw, crosses the lower wordmark and expands to the visible viewport. The same video continues into the tablet. Desktop timing and typography remain on their existing CSS path.

## Why the strip appeared
The sticky stage and expanded film were both sized with `100svh`. On Chrome, the small viewport stays short when the browser bars retract, leaving a strip below the film. Scroll progress also divided by `stage height × 2.7 − window.innerHeight`, so a toolbar-only height change could change the denominator while the stage stayed fixed. On mobile, the stage and expanded film now follow `100dvh`; an independent `100svh` meter supplies the scroll denominator. A visible-viewport resize repositions the tablet camera without seeking or replacing the video. This explains the reported failure, but the precise toolbar transition still needs the owner's phone.

## Checks
- Isolated production build, isolated application TypeScript check, focused ESLint and `git diff --check` passed. No new package or animation engine.
- Chrome mobile emulation at 360×760 measured the opening lines at x=24 and widths 214, 237 and 227px. At mid-entry the film frame was 270×152px; at full-screen it was 360×760px. A synthetic resize to 360×680 left its frame at 360×680px. The denominator changed from 1292 to 1156px because this test resizes the whole emulated viewport, including `svh`; it does not simulate Chrome's toolbar alone.
- Chrome emulation at 320×560 and 760×360 kept the copy and work link visible. Forward, reverse and a direct jump back to the opening completed without a runtime error. The tablet film window remained aligned in the checked still.
- The idle run sampled a staggered glitch and a wave peaking at 3.99px. Scrolling cleared both; return waited before restarting. A simulated hidden document and reduced-motion setting showed neither automatic effect. This is scripted visibility, not an OS background test.
- The film played muted and looped. After a deliberate pause at 1.46s, tablet entry and return kept the same time, mute and pause state.
- The existing focused interaction suite passed all ten checks, including desktop forward/reverse, reduced-motion controls, enquiry draft/focus on resize, gallery selection on resize and team/footer boundaries. It did not submit an enquiry.

## Spacing revision
The owner found too much unused space in the opening and tablet scenes. On portrait phones up to 480px wide, the three opening lines now use about 78%, 86% and 83% of the 360px screen. The existing headline and copy grow as well. The tablet camera is larger and centred on its screen, keeping the film registered to the mask without new content.

At 360×740, the opening copy ends at y=532, with the work link starting at y=662. The tablet copy ends at y=243 and the portrait extends from y=318 to y=612. At 320×560, the opening copy ends at y=453 before the link at y=482; the portrait stops at y=470. Checks also covered 390×844, 760×360 and 1440×900. Tablet film alignment was within one CSS pixel, the isolated build and typecheck passed, and the same ten focused interaction checks passed with no page errors. These are Chrome emulation results, not an S10+ observation.

Current stills: [opening](spacing-opening-360.png), [mid-entry](spacing-mid-entry.png), [full-screen film](spacing-fullscreen.png), [tablet](spacing-tablet-360.png), [short opening](spacing-opening-320.png) and [short tablet](spacing-tablet-320.png). Measurements are in `spacing-results.json` and `spacing-checks/interaction-after.json`. Earlier captures and the [silent forward/reverse recording](forward-reverse.mp4) predate this spacing change.

## Owner pass on Galaxy S10+ Chrome
1. Open the refreshed tailnet-only preview at `https://johnsax.tailb6e2d3.ts.net:3460/redesign?hero=mobile-spacing-20261010` on the phone. The query string avoids a stale page entry.
2. Let the opening rest through two idle cycles. Scroll during a glitch, return, then try Reduce Motion.
3. Scroll to the full-screen film. Hide and reveal Chrome's toolbar with ordinary scroll gestures, then reverse through the entrance and tablet. Watch for a lower strip, a jump or a change in playback time.
4. Rotate once and check the short landscape opening. Keep an unsent enquiry draft while opening the keyboard and rotating; visit a gallery project and resize. Do not submit the form.

No physical S10+ was available here. Browser emulation cannot certify toolbar behaviour, autoplay policy or thermal performance on that device. No commit, push or public deployment was made. The existing private Tailscale Serve route was refreshed and verified over HTTPS.
