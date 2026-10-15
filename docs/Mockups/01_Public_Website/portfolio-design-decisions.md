# Portfolio design decisions

## Next authorised viewer correction

`docs/tasks/orchestrator-sessions/orch-20261012-114721/viewer-polish.md` is the current source packet. Desktop left media fits the viewport while right notes scroll independently. Short panels centre on the right with readable type and soft glass edges. Compact backgrounds use roughly 80% opacity with transparent ancestors and backdrop blur. Scrollbars have no visible tracks, but content stays scrollable. Top brand/Back stays; bottom ordinal/arrows float without a footer slab. This concerns PortfolioViewer, not ClosingSequence.

Opening and project transitions now accompany pre-handoff fullscreen growth/return on the same media and quiz nodes. Software fullscreen is app/screenshot-only, without our rows or decorative chrome. Native Cinema still uses black/opaque media and overlays. YouTube retains only the approved external strips, its full iframe and a compliant fade, never a crop, mask or branding blocker.

Native films loop on the same element; YouTube uses its official same-video playlist loop. Forest's actual upload is 9:16 portrait, observed at 360x640 with duration 51.181 seconds. Nifemi's existing full website source remains 1280x720 and is not blindly cropped. No new source encode, download, profile facts or gallery redesign is authorised. Tests, transition paints and the real Forest natural-loop receipt are under `docs/redesign-review/viewer-polish/`. Normal cold dev delivery and actual phone orientation remain separate limits.

The earlier decisions below are historical where this packet differs.

## Owner correction, 12 October 2026

The owner authorised source integration, then corrected the viewers after using them. The earlier workshop-only boundary, native-first gate, fixed-height sparse notes and full-height sparse profiles below are historical. The correction packet is `docs/tasks/orchestrator-sessions/orch-20261012-114721/viewer-corrections.md`.

Current decisions are direct unified Play, selected YouTube preparation without autoplay, no public loading/instructional/pending copy, viewport-filling native Cinema with overlays, and YouTube controls/title/navigation in minimal external strips. The complete YouTube iframe stays exposed. Expand and return use a non-distorting fade for YouTube, while native films and software retain zoom and compact tilt. Footer arrows stay outside scrollable viewer content. Software uses a large 16:9 picture. Notes and profiles follow their actual content, with readable text and no invented biographies or photos. Orientation is best-effort browser locking, not sideways CSS. Actual mobile-device rotation and full per-video YouTube playback remain unverified.

The gallery, original Hero film, approved covers, StudyGame ownership, team, ClosingSequence footer and enquiry stay unchanged. Current checks and screenshots are documented in `docs/features/PortfolioViewerIntegration.md` and `docs/redesign-review/viewer-corrections/`. No deployment or publication is authorised.

## Approved direction

The existing `/redesign` portfolio gallery stays unchanged. The owner deliberately designed its left-hand project list, filters, heading, right-hand stacked cards and scroll presentation. The five alternative gallery concepts are not approved replacements.

Option 02, The cinema, from `gallery-directions.html` informs the fullscreen treatment. The default opened project view is Studio Notes, not Cinema.

## Entry and navigation

- Open the selected project's Studio Notes compact viewer from its Watch action or its right-hand presentation card. The left-hand list continues to select projects rather than opening a viewer.
- Give entry a brief cinematic transition. The owner's reference was a quick "tzz" moment. Exact motion, timing and sound have not been approved. Do not infer permission for audible autoplay.
- Include previous and next project arrows inside the preview.
- Navigation must respect the gallery's current All, Software or Film filter. Film visits only film projects; Software visits only software projects; All visits the combined collection.
- Follow the active list's sequence. The owner described traversal as chronological. Confirm date ordering if it would change the current visible list; do not silently introduce a different viewer order.
- Arrow endpoint behavior and looping remain undecided. Film playback and software previews follow the chosen combinations below.

## Review boundary

The owner accepted the corrected film-viewer mock-up after the full-height drawer, width alignment, zoom transitions and pause-title animation changes. Keep that design as the approved film reference.

Continue designing one view at a time and wait for the owner's selection before moving on. Do not implement these decisions in the live site yet. The earlier `selected-work-viewer.html` proposal was rejected and is not the design reference.

## Approved film playback combination

Use `film-playback-directions.html` as a reference for this combination, not as five approved alternatives.

- Use option 01, Edge to edge, for the playback composition.
- Use option 03, Floating controls, for the compact playback control bar.
- Keep the top J StaR Films navigation hidden during unobstructed viewing. Reveal it on pointer hover. Touch and keyboard users must still be able to access navigation and exit controls; the exact reveal behavior needs design review.
- Retain the "Now showing" treatment and project title. Nifemi is the example, not a requirement to override the project the visitor opened.
- Retain the right-hand project ordinal, such as 01, and place it slightly higher. Derive the ordinal from the active filtered collection.
- Give movement between films a deliberate cinematic transition. Exact timing and motion remain to be demonstrated and approved. Do not autoplay sound or add a transition sound without approval.
- The playback prototype demonstrates the Film filter with Nifemi and Sharon. Production navigation must use the actual active filtered collection.

## Approved compact direction and corrected flow

The owner selected Studio Notes, with its tilted player and studio-note panel. Keep the tilt leaning right. Film stays on the left and project information on the right at desktop widths, stacking on smaller screens.

The latest clarification replaces the earlier Story / Brief / Credits tab requirement. Use one continuous vertical note: heading, subtitle, brief, published links, then contributors. The right-hand panel has a fixed height; its size must not jump with project content. The owner's correction is width-only: keep the original full top-to-bottom drawer, with its left edge aligned to the Studio Notes panel and its right edge flush with the viewer. Do not constrain the drawer to the note's 480px height. On smaller screens it spans the viewer width. Hide the original note behind the drawer; retain the earlier backdrop treatment. Long content scrolls inside the full-height drawer, and closing restores the note.

Contributors form a horizontal row that extends to the right, with scrolling and navigation rather than growing the panel vertically. Names and photos open collaborator profiles with their role and approved social links. Each project's roster must reflect who actually worked on it. Do not invent personal handles or attribute studio links to a person.

Studio Notes is the default entry from the gallery. The floating playback bar's fullscreen button takes the same viewer into actual browser-fullscreen Cinema. Cinema is not another page or a separate mode-selection button. Retain the title at the upper left and project ordinal at the upper right, with floating controls. Exiting fullscreen returns to Studio Notes without replacing the video or resetting playback. Project navigation continues within the active filtered list, including while fullscreen.

## Latest design sample

`studio-notes-linear.html` replaces the tabbed `studio-notes-refined.html` as the current review option. It demonstrates the fixed-height vertical panel, horizontal contributor row, expanded brief, collaborator profiles and fullscreen flow. This remains a mock-up, not live-site integration.

Its 480px panel height is a prototype setting. The implementation must preserve a stable height appropriate to the viewport. Smaller screens stack film and notes. The inline chat rendition previews the cinema composition; the local HTML uses the browser fullscreen API.

The roster contains existing team members only as labelled examples, not confirmed film credits. Photos and company roles come from `src/content/about-company.ts`; studio YouTube and Instagram links come from `src/content/contact.ts`. Personal social URLs and actual film participation still need approval. The mock-up's copy and film-post links remain unfinished. Confirmed publication URLs and owner-approved contributor identities are recorded in `portfolio-content-ledger.md`; use those rather than treating the sample roster as real credits.

## Chosen software direction

The owner accepted the refined software preview and asked to move on. Use `software-preview-refined.html` as the approved software design reference.

Combine the Product window frame, swappable screenshot/tour frames and the inline sample from Screens + sample. Keep the slightly tilted product presentation and the approved fixed-height Studio Notes panel. Clean canvas is rejected. Remove the redundant Interactive learning and Studio Notes labels beneath the product.

Keep a simple Screenshots / Try sample switch near the media. The lower Try sample action opens the same inline demonstration, not a new tab. The owner confirmed this choice. Preserve the sample and its answers when switching to screenshots and back.

Try sample and Try app are distinct. Try sample is the existing small demonstration. Try app opens the complete product at its verified public destination. Source opens its repository in a new tab. Fullscreen expands whichever content is active, screenshot or sample, without changing the project notes, language/technology details or contributors.

`software-preview-refined.html` demonstrates the selected combination. It keeps the same sample DOM while changing views or entering fullscreen, alongside screenshot-frame navigation, project notes and contributor details. The mock-up quiz is still a fixed example; production must use the site's existing mounted StudyGame instance rather than transplant this sample.

The Adaptive Study Game screenshot, GitHub destination, description and developer credit come from the existing project record. The current three frames are one screenshot plus two detail crops, not three supplied screenshots. Replace or extend them with actual project images once provided. The owner supplied `https://study.jstarstudios.com/`, then reported unavailable authentication and a broken app. Try app remains disabled until readiness is confirmed; it must not point to the repository instead. The owner will supply screenshots later, so browser capture is deferred. Personal profile socials remain unconfirmed. The school project is Melo. Its public marketing destination is `https://www.meloschool.com/`, so use a Visit website action rather than implying a verified open app/demo. Code research supports its stack and product modules, but screenshots and the credit roster remain pending. Omit a Source button and do not promote Melo as open source merely because its repository is public.

## Playback polish

The owner approved the overall Studio Notes / fullscreen workshop direction. Give Now showing slightly more character and size, and increase the bottom navigation only a little. During playback, fade the floating controls after a short period without input and reveal them on deliberate pointer movement or touch. Paused playback always keeps controls visible. Keyboard interaction must keep controls accessible. The current mock-up uses a 1.8-second idle delay, removes hidden controls from interaction, and ignores zero-movement pointer events caused by hiding the controls. In fullscreen, the top navigation and bottom project navigation fade with the playback controls.

Animate the fullscreen zoom in both directions without replacing the video element. Animate the Now showing/title group's fade and upward movement on play, reversing smoothly when paused rather than appearing abruptly. The mock-up uses a 620ms zoom and 420ms title fade, with reduced-motion support. These are prototype timings, not permission to change the original gallery transitions.

## Playback sources and YouTube limits

The owner wants Nifemi and Sharon self-hosted. Keep their approved native-video viewer and floating controls. Both now have full local films: `public/redesign/nifemi.mp4` and `public/redesign/sharon.mp4`. Sharon's owner-supplied source is prepared without changing the original export or live gallery references.

For other selected video projects, use YouTube playback from the owner's channel, `https://www.youtube.com/@JStaRFilms/playlists`. This does not approve importing every upload or changing the current gallery's layout, ordering or membership without review.

Official documentation supports hiding YouTube's native control bar with `controls=0` and using the IFrame Player API for play/pause, seeking, volume and mute. Our own fullscreen button can expand the viewer container while preserving the same player instance. Keep browser autoplay restrictions and platform differences in mind; do not promise identical native-media behaviour on every device.

YouTube still controls its branding, title/channel information, ads and related-video treatment. `modestbranding` and `showinfo` are deprecated and do not remove those elements. `rel=0` restricts related recommendations to the video's channel; it does not disable them.

YouTube's required minimum functionality prohibits placing visual elements in front of, or obscuring, any part of its embedded player. Custom controls, project titles and ordinals must sit outside the actual iframe, not float over its video. Do not crop the iframe, mask its branding, place transparent click-blocking layers over it, or cover its recommendations/ads. The existing floating-bar overlay remains appropriate only for the self-hosted films. Review the YouTube variation before live integration.

The API reference also states that official view counts require playback initiated through the player's native play button. Preserve native first play when channel view attribution matters; do not promise that an API-triggered start will count as a view.

Documentation checked:

- Player parameters: `https://developers.google.com/youtube/player_parameters`.
- Playback API: `https://developers.google.com/youtube/iframe_api_reference`.
- Embedded-player rules: `https://developers.google.com/youtube/terms/required-minimum-functionality`.
- Developer policies: `https://developers.google.com/youtube/terms/developer-policies`.

No live components have been changed in this media-preparation pass. Owner-selected videos are recorded in `portfolio-youtube-shortlist.md`, and the nine prepared cover cuts are now owner-approved. `studio-notes-youtube.html` provides the standalone compliant viewer variation; `portfolio-youtube-viewer-review.md` records its checks and remaining limits. Actual production roles, project copy and real per-video playback remain pending. Future additions follow `docs/features/PortfolioContributionGuide.md`; content or cut approval does not authorise live integration.

## Animated covers

The owner requested roughly ten-second GIF-like motion covers. Use muted MP4 loops on the website, with no audio stream in the cover files. These are separate from the full films, so covers never fetch an entire film just to animate a card.

New review candidates are `public/redesign/gallery-sharon-10s.mp4` and `public/redesign/gallery-nifemi-10s.mp4`. Sharon uses source seconds 8 to 18; Nifemi uses its opening ten seconds. The existing eight-second gallery assets remain unchanged. The local `portfolio-motion-covers.html` review page demonstrates the new cuts; it does not replace the approved gallery or film viewer.

When integrated, preserve the existing card layout and selection/open behaviour. Pause offscreen and hidden-tab previews, keep the static poster for reduced-motion users, and avoid loading every playlist video's cover at once. Animated covers for additional YouTube selections require approved local excerpts or another authorised source. Do not assume a YouTube embed provides a downloadable GIF or video file.
