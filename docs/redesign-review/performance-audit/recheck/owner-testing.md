# Phone testing handoff

Private preview with the roomier mobile hero: https://johnsax.tailb6e2d3.ts.net:3460/redesign?hero=mobile-spacing-20261010

Film comparison: https://johnsax.tailb6e2d3.ts.net:3460/redesign/film-comparison

Connect the phone to the same Tailscale tailnet first. Keep the host computer awake, online and connected to Tailscale. This is a local production build behind Tailscale Serve, not a public deployment. The comparison page is separate from the redesign and has no link from the homepage. Its videos load only after you select one; changing selection starts the other from the beginning. The redesign still uses the original film.

## Short pass

- Play the redesign film with sound off and on. Pause it yourself, enter the tablet, then return. Check that it stays paused at the same position. Let it loop. On the comparison page, play each version at the same player size and note any softness, banding or stutters. The candidate is not the default.
- Start an enquiry. Enter a disposable draft, focus the email field, open the software keyboard and rotate the phone. Confirm the field stays visible, focused and editable. **Do not submit** or open WhatsApp.
- Browse the gallery with taps, change a filter, select a project and try the quiz. Check controls near screen edges and note any hard-to-hit target.
- Scroll slowly into the tablet and team. Then make a fast scroll forward, reverse it, and stop midway. Watch for empty images, jumps, frozen video or lost selection.
- Turn on the phone's Reduce Motion setting, reload, and use touch to progress through film, tablet and game, then return to opening. Turn it off afterward if you want to compare the standard motion.

## Failure log

No owner-reported phone failures yet. For each report, add a separate entry with:

- Device model and OS version:
- Browser and version:
- Portrait or landscape; Wi-Fi or cellular:
- Page and selected film, if relevant:
- Starting point and exact reproduction steps:
- Expected result and actual result:
- Approximate time, screenshot or recording path/link:
- Does it reproduce after a fresh reload?

Do not place credentials, contact details or real enquiry contents in screenshots or recordings. This folder is an internal record, not a web-served directory.

The preview now runs from `127.0.0.1:5899` through the dedicated Tailscale Serve HTTPS port 3460. The superseded local processes on ports 5897 and 5898 were stopped. The current production server's PID is in `owner-preview/server.json`; logs are next to it. When testing is finished, disable only this route with `tailscale serve --https=3460 off`, then stop that recorded server process. Other Serve routes are unrelated.
