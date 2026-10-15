# Adding selected work

## Start here

This guide is for agents adding projects to the `/redesign` portfolio after the study game. It covers content preparation and the integrated viewers. It is not permission to redesign the gallery, import the channel automatically or deploy changes.

The owner designed the gallery. Preserve its left-hand list, filters, heading, stacked cards and scroll behaviour. Select work the owner wants represented, not whichever upload has the most views. A repeated style is acceptable when the owner values the project; do not force one project from every category.

## Read before editing

1. [Selected work gallery](SelectedWorkGallery.md) for the implemented ownership, timing and interaction contracts. Its original four-project roster and missing-content notes are historical, not the latest content audit.
2. [Design decisions](../Mockups/01_Public_Website/portfolio-design-decisions.md) for the approved viewer direction and YouTube restrictions.
3. [Content ledger](../Mockups/01_Public_Website/portfolio-content-ledger.md) for verified destinations, owner accounts, credits, media and unresolved facts.
4. [YouTube selections](../Mockups/01_Public_Website/portfolio-youtube-shortlist.md) for selected video IDs, explicit removals and research history. The owner-selected table overrides the earlier recommendations.
5. [Selected film notes](../Mockups/01_Public_Website/portfolio-selected-film-notes.md) and its linked media manifest/review for prepared source matches, exact cut intervals and file validation. The nine cuts are owner-approved and now integrated. Technical validation does not establish exact equivalence to the published versions.
6. Current code in `src/content/selected-work.ts`, `src/app/redesign/Hero.tsx`, `src/app/redesign/SelectedWorkGallery.tsx` and `src/app/redesign/selected-work.module.css`.

Approved viewer references are `studio-notes-linear.html` and `software-preview-refined.html` in `docs/Mockups/01_Public_Website/`. The standalone YouTube variation is `studio-notes-youtube.html`; [its review record](../Mockups/01_Public_Website/portfolio-youtube-viewer-review.md) separates stub-based checks from the real SDK connection check. These remain prototype references. Their approved viewer treatment is now implemented by the scoped portfolio viewer components. Other workshop alternatives are not interchangeable approved designs.

The older `src/content/portfolio.ts` and `PORTFOLIO_SYSTEM_DOCUMENTATION.md` describe a separate portfolio system. Do not copy its automatic playlist feed or hidden-branding claims into this gallery. Current YouTube rules take precedence.

## Current implementation boundary

The catalog has thirteen records: Adaptive Study Game, Melo, Nifemi, Sharon and the nine selected manifest projects in manifest order. Earlier four-project and workshop-only statements in the reference records are historical. The owner explicitly authorised this integration; future additions still need approval.

`GalleryProject` discriminates software from film. Software presentations support `study-game`, `provisional-cover` and `static-image`. Native `film` has `poster`, `previewSrc` and optional local-path `fullSrc`; `youtube` has its own `youtubeId`, `poster`, `previewSrc` and observed `orientation`. Forest is portrait. Do not infer orientation from a landscape gallery cover. `ProjectNotes` holds the heading, subtitle, brief, supplied story, music, technology, exact publication links, confirmed contributors and unresolved facts. Dates and unverified production jobs are omitted.

`detailsHref` is Source, only for an approved software repository. `websiteHref` is Visit website. Neither is a playback field. Never put a YouTube URL in `fullSrc` or relabel Source as Watch. Native full sources are `/redesign/nifemi.mp4` and the accepted `/redesign/sharon-mobile-candidate.mp4`. Nifemi's smaller candidate remains comparison-only. All selected films use their independent approved ten-second covers.

Static `selectedWork` records feed Hero's filtered collection and controlled gallery. Hero opens `PortfolioViewer.tsx` inside the existing game frame, with `PortfolioMedia.tsx` for native playback or a selected-viewer-only official YouTube player, prepared on open without autoplay. The existing StudyGame remains in its original subtree; CSS coordinates align its canvas to the product slot without moving DOM or copying state. The same viewer container survives fullscreen and project navigation. No backend, CMS, database schema or persistent-data change was added.

## Prepare a project packet

First record the facts in the ledger or a linked project packet. Keep editorial preparation separate from live code.

```markdown
### Project display name

- Stable project ID:
- Owner selection status:
- Category and intended place in the visible sequence:
- Full playback source or verified product destination:
- Exact YouTube video ID, if applicable:
- Published title and publisher:
- Short heading, subtitle and brief:
- Owner's story and confirmed production roles:
- Contributors, approved display names, photos and personal links:
- Soundtrack and attribution, if confirmed:
- Poster and authorised local cover source:
- Proposed cover start/end seconds and cut approval:
- Source export, playback candidate and validation results:
- Unresolved facts:
- Integration approval:
```

A publisher, playlist membership or company job title is not a production credit. Never infer directing, filming, editing or modelling roles. A published music title does not establish an official artist commission or distribution rights. Owner approval to select a project also does not identify every collaborator.

Use exact supplied identities and links. Normalise YouTube short links to `https://www.youtube.com/watch?v=VIDEO_ID`, removing tracking parameters. Keep a person's channel/profile separate from a link to the project itself. Do not invent channel handles, screenshots, dates, software demonstrations or analytics. Mark owner-reported historical counts as such, or omit them.

For unavailable information, record what is missing. Research independently where authorised rather than repeatedly asking the owner to curate the channel. If access is rate-limited, stop retries and state that playback remains unchecked.

## Choose and prepare the motion cover

Every newly selected YouTube project needs a roughly ten-second GIF-like cover too. Use a silent MP4 loop on the website, not a large animated GIF. Choose a lively, representative section. Do not automatically use the opening ten seconds of a long film. A highlight seek/cut belongs in the cover file; it does not authorise resetting or seeking the full viewer whenever it opens.

Use an authorised local export or excerpt. A YouTube iframe is not a downloadable media source, and a thumbnail is not evidence that a motion cover exists. Record the source interval and review the cut with the owner before integration. Preserve supplied originals and existing gallery clips; create a separately named candidate.

For current cover candidates, 960 × 540 H.264, no audio and fast-start MP4 is the established preparation baseline. Inspect orientation and composition before scaling; do not blindly stretch portrait footage. Choose compression based on the actual footage rather than promising a fixed file size.

Gallery lifecycle requirements:

- Only the eligible visible cover has a source attached and plays. Nearby panels use posters.
- Mute, loop and use `playsInline`; no audible autoplay.
- Pause and unload when offscreen, hidden-tab, filtered out, entering the viewer or unmounting.
- Reduced motion uses a static poster unless playback is explicitly requested.
- Never fetch the full film just to animate its cover, or preload all selected covers.

## Full playback is a separate deliverable

Nifemi and Sharon stay self-hosted. Other selected videos use YouTube, including selected publications on client channels. Prepare the full-film source independently of its cover.

Existing 720p reference settings are H.264 slow preset, CRF 24, 1400 kbps VBV maximum and 2800 kbps buffer, with fast-start. Sharon's matching candidate has AAC at 128 kbps. Nifemi's existing candidate audio measures about 138 kbps. These settings are a starting reference, not a universal visual-quality guarantee or a whole-file bitrate cap.

Keep full duration and audio. Do not replace an original export with a derivative. Confirm the source that actual code uses; the existence of a smaller candidate does not mean the live site delivers it. The ledger distinguishes original exports, current website copies, compressed candidates and cover files.

For every prepared file, probe dimensions, frame rate, duration, streams, size and bitrate; fully decode it; check MP4 metadata precedes media data; then test playback, pause, seeking and reaching the end in a browser. Review compression visually before approval. Local playback does not establish smooth delivery on a slow connection, and a single MP4 is not adaptive streaming.

## YouTube player rules

Use the official IFrame Player API. Supported custom play/pause, seeking, mute and volume controls can accompany `controls=0`, but must sit outside the iframe. Fullscreen should expand the same viewer/player container without restarting playback. Native loops use the same media element. YouTube looping uses official `loop=1` with that video's ID as `playlist`, not retry loops or a replacement iframe. Keep explicit pause, reading/background pause, errors and disposal authoritative.

Do not crop or mask the iframe, hide branding, cover ads or recommendations, or place transparent click-blocking layers over it. The native-film floating overlay cannot be copied over YouTube footage. Titles and ordinals must also remain outside the iframe.

`modestbranding` and `showinfo` are deprecated. `rel=0` limits recommendations to the video's channel; it does not remove them. The owner chose direct starts through our Play button, without a native-first gate. Do not promise official channel view attribution for API starts. Check supported embed playback for each selected ID, including client-channel publications, and handle autoplay rejection without retry loops.

Use the compliant YouTube variation and integrated adapter as references. Official reference links and the reviewed restrictions are in the design decisions document.

## Integrate only after approval

1. Get approval for the roster, copy, credits, cover cuts, visible sequence and YouTube viewer treatment. Do not treat selected content as permission to replace the live gallery.
2. Inspect the current working tree and preserve unrelated work. Update the typed records and approved viewer implementation with the smallest necessary change. Reuse existing stable project IDs, especially `school-management-system` for Melo.
3. Keep Hero as the single owner of scroll/timing, selection, filter and viewer state. Preserve the existing mounted StudyGame and its answers. Do not duplicate, remount, portal or replace it with the prototype sample.
4. Left-hand names select only. The displayed right-hand card and View project or Watch action open Studio Notes. Capture that displayed ID before focus changes can clear a transient preview.
5. Viewer previous/next follows the active All, Software or Film collection in visible order, with bounded endpoints. Do not introduce looping or sort by dates/views. On close, reconcile the current selected ID's scroll anchor and restore valid focus.
6. Fit desktop media to its available viewport and let the right details region scroll independently. Keep the narrow stacked scroll, hidden tracks with accessible content, floating bottom navigation and readable glass. Short notes and width-aligned drawers centre in the right region, with a horizontal contributor rail. Software fullscreen is only the existing sample or screenshot, without viewer chrome or branded rows. The owner's correction supersedes the earlier fixed-height notes and full-height sparse profiles. Unknown credits and pending facts belong in review records, not public filler. Native fullscreen expands the same mounted media and restores notes without resetting it. For YouTube, place controls outside the player.
7. Verify the changed path before declaring it ready. Do not push or deploy unless separately authorised.

Melo uses Visit website, with no Source/open-source promotion. The full Adaptive Study Game app is broken and testing/screenshots/fixes are deferred. Do not browse or repair that app as part of a portfolio addition. Its existing embedded demonstration is a separate mounted instance. The integrated viewer preserves that instance across screens/sample, fullscreen, navigation and resize.

## Focused verification

For documentation/content preparation, check IDs, exact links, local asset paths, approval states and contradictory claims. Do not report implementation tests as run when only documentation changed.

For authorised code changes, start with focused ESLint, `pnpm typecheck` and whitespace checks. Then exercise the changed gallery/viewer behaviour on wide, short and narrow viewports, keyboard/touch and reduced motion. Verify filtered counters and ordering, finite scroll end, preserved mounted media/game state, modal focus/exit, fullscreen return, idle controls and source cleanup. Use the existing review selectors and fixture guidance in `SelectedWorkGallery.md`; inspect the current harness before rerunning it. Historical receipts are not proof that new changes pass.

The focused integrated harness is `docs/redesign-review/verify-portfolio-viewers.cjs`. Its default YouTube adapter is an explicitly labelled SDK stub. `--real-sdk` checks readiness separately and does not start playback. Current next-pass results live in `docs/redesign-review/viewer-polish/`; previous correction receipts remain in `docs/redesign-review/viewer-corrections/`. New fullscreen tests must inspect intermediate browser paints and growth/return, not just settled rectangles. `--disk-layout` is an explicit test-only transport for the current compiled layout bundle when cold dev HTTP delivery truncates it, not evidence that normal delivery works. Earlier integration receipts remain in `docs/redesign-review/viewer-integration/`. The source-only typecheck configuration excludes historical copied workspaces; it does not change Next's dist directory. Old four-project receipts and fixture scripts are historical, not evidence for the thirteen-record roster.

Finish by recording what changed, what was actually tested, what remains unverified and whether the gallery geometry and ownership remain unchanged. Future additions follow this same process when the owner requests them.
