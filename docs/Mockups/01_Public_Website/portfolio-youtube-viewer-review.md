# YouTube Studio Notes review

## Deliverable and scope

[studio-notes-youtube.html](studio-notes-youtube.html) is the standalone YouTube adaptation of the approved Studio Notes viewer. It uses the nine owner-selected video IDs and prepared local posters. It does not change the live gallery, its content records, the native-film prototypes or the existing StudyGame.

Project notes use the descriptive drafts in [portfolio-selected-film-notes.md](portfolio-selected-film-notes.md). Motivations, formal briefs and actual production credits remain unconfirmed. The prototype does not populate the contributor rail with illustrative staff or call a publisher a production collaborator.

The dropdown and previous/next controls traverse the nine selected films in manifest order. This is a Film-only review, not a newly approved final All/Software/Film catalog ordering. Its arrows stop at the ends for review; final endpoint looping is still undecided.

## YouTube-specific adjustments

- The official IFrame API and iframe load only after the explicit Load player action. No iframe or SDK request is made on initial page load.
- Native first play is retained. External play/pause, seek, mute and volume unlock after the player reports playback. No audible autoplay or promise that an API-triggered view counts.
- `controls=0`, `playsinline=1`, `rel=0`, `fs=0` and an HTTP origin when available are the supported parameters used. No deprecated branding-hiding parameters are present.
- The title, ordinal, custom control bar and project navigation remain outside the iframe in compact and fullscreen layouts. The bar no longer overlaps the footage. YouTube controls its own title/branding, ads and recommendations.
- Fullscreen expands the existing screen and player. Leaving it restores the note panel without destroying the iframe or resetting position. There is no clipping/shutter effect on the embedded player. Native-film zoom/overlay styling is not copied over YouTube footage.
- Expanded reading pauses and hides the entire playback pane while preserving its instance. The full-height drawer remains aligned to the notes and flush with the viewer's right edge, or spans the viewer on mobile. It does not blur or place a backdrop over a visible YouTube iframe. This reading region is nonmodal, with close/Escape and focus restoration; no false `aria-modal` claim is used.
- Idle controls hide only while playing, after 1.8 seconds. A keyboard wake target outside the iframe brings the bar back and moves focus to its play/fullscreen control. Native iframe keyboard events do not bubble to the parent, so this target is needed rather than relying only on parent keydown.
- Switching projects destroys the previous player, clears polling and ignores late callbacks. Hidden-tab handling pauses playback; it does not automatically restart it. Errors offer the exact publication link without automatic retries.
- Inline chat is a layout-only preview, not an embedded-playback test. The standalone page has the real player path. Serve it through HTTP for a meaningful live connection check rather than relying on a file origin.

## Checks actually run

`docs/redesign-review/verify-youtube-studio-notes.cjs` injects an explicitly labelled player stub. It tests the page's adapter and DOM behaviour, not YouTube's real decoding, ads or buffering.

Passed:

- Nine records, decoded posters, displayed ordinals and bounded previous/next.
- No initial iframe; first-play gating, API play/pause, seek, mute and volume through the stub.
- Actual browser fullscreen while preserving the same stub iframe and playback position. Title, controls, header and footer rectangles do not overlap the settled iframe.
- Full-height reading drawer, mobile width, paused/hidden playback pane, Escape and restored focus.
- Project destruction and rejection of stale player events.
- Idle fading and actual Tab navigation from the blank test iframe through the keyboard wake target into the play button.
- No horizontal overflow at 1100, 728 and 390 pixels; reduced-motion transition suppression; zero page errors.
- Node script syntax and focused whitespace checks.

The initial stub incorrectly accepted only a string host ID, while the prototype supplies a DOM element. Correcting the stub fixed that harness error without changing the player call. A fullscreen check then exposed vertical centring and an in-flight rotation; the expanded layout now stretches the player pane and does not animate that transform. The drawer check was corrected to await its opening animation before testing settled edges. The final focused run passed, with its screenshot at `C:/Users/johno/AppData/Local/Temp/youtube-viewer-check-Ut3H4O/notes.png`.

## Real YouTube connection check

A single bounded check served the standalone document from a temporary loopback HTTP server and explicitly loaded the first selected project, `p1yqihuevu0`.

The real SDK loaded, created one iframe and fired onReady. No page errors were reported. Native play was not clicked, and no other selected videos were attempted. This establishes the SDK/ready connection path only, not successful full playback, per-video embed availability, audio, mobile platform behaviour, view attribution, ads or recommendations. The temporary server was stopped after the check. Earlier rate-limited watch requests were not retried.

## Next work

The nine cover cuts are already owner-approved; do not require another selection round. Remaining work is confirming project stories and actual credits, checking real playback where permitted, and explicitly authorising live integration. Missing facts must stay pending. Follow [the contribution guide](../../features/PortfolioContributionGuide.md) rather than treating this prototype or the test stub as production implementation.
