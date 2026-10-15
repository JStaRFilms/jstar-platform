# Media delivery comparison

The rendering change and both interaction fixes remain in place. I kept one media change: a smaller tablet image. I did not ship the founder deferral or the mobile video. Both have evidence worth reviewing, but neither met the visual and loading constraints as tested.

## How I compared them

I used local production builds in headless Chrome at 390 × 844, device scale 2, with 4× CPU slowdown, 150 ms latency, 1.6 Mbps download and 0.75 Mbps upload. Every load used a fresh browser context. The transfer window ended **10 seconds after DOMContentLoaded**. Each step has three cold loads per version, interleaved baseline/candidate/candidate/baseline/baseline/candidate. Bytes in that window include incomplete transfers, so they are not file sizes. The image step compares the approved rendering build to an image-only build. The video step compares that image-only build to a separate video comparison build. No video code from the latter was copied into the app.

### Tablet image, retained

`public/redesign/tablet-scene-v1.webp` is an opaque WebP at quality 97. It is still 1672 × 941, with the same framing and screen coordinates as the 1,319,653-byte PNG. The WebP is 85,818 bytes. A quality-92 WebP was 44,892 bytes; the lossless version was 924,162 bytes. I chose quality 97 because the extra 41 KB retains more fine detail. FFmpeg reported SSIM 0.9957 against the original in YUV420; visual comparison of the original and encode is in `tablet-scene-q97.webp` and the normal tablet screenshots. This is not a claim that the pixels are identical.

The only retained source edit is the `TABLET_SCENE` URL in `Hero.tsx`. It stays eager, unoptimized and behind the original mask/image readiness gate. No `loading="lazy"` change, geometry change or video change was made. The portrait cutouts remain untouched and retain their alpha channels.

| Cold mobile load, median (range) | Rendering baseline | Image only |
| --- | ---: | ---: |
| Total bytes received in 10 s | 2,267,781 (2,266,281–2,296,281) | 1,367,863 (1,364,863–1,432,363) |
| Tablet bytes received | 918,672 (917,172–947,172) | 86,241 (86,241–86,241) |
| Founder bytes received | 328,387 (all three) | 328,387 (all three) |

The old PNG was still downloading at the end of the window; its 918 KB is not the full 1.32 MB file. In a separate fast-scroll probe under the same throttle, the PNG had not loaded or revealed the tablet five seconds after a jump. The WebP had loaded and decoded by the first post-jump sample, and reveal began by 500 ms. `tablet-ready.json` has the timeline and screenshots. The unchanged gate still prevents an empty tablet scene.

### Founder deferral, rejected

I tried lazy loading for the first cutout, with an observer 3,500 px ahead of the team. It removed the 328 KB founder request from the opening's 10-second window. But on direct navigation and a fast jump under the throttled connection, the portrait was incomplete after three seconds. The team could be visible with an empty portrait. `founder-deferral-experiment.json`, `image-journey.json` and `image-direct-team-700.png` record this failure. I removed the experiment from `TeamSection.tsx` and rebuilt the image-only comparison above with the original eager portrait. An instant native jump can outrun an image fetch; merely adding a larger observer margin cannot guarantee a portrait is ready. Holding navigation or showing a placeholder would change the approved experience and needs a separate decision.

## Mobile film, comparison only

`nifemi-mobile-candidate.mp4` uses the complete original edit at 1280 × 720, H.264/YUV420 video and copied AAC audio. FFmpeg encoded it with x264 `-preset slow -crf 24 -maxrate 1400k -bufsize 2800k -movflags +faststart`. Both files report 26.602 seconds. The master is 17,254,130 bytes at 5.19 Mbps; the candidate is 5,242,012 bytes at 1.58 Mbps. The candidate's `moov` is at the front. There is no second video element.

The comparison build uses a mobile `<source media="(max-width: 800px)">` and a master fallback. Chrome requested only one rendition in each run. Changing width to 900 px did not switch the already selected source or reset its time. This source markup exists only in the ignored comparison workspace, not in the working application.

| Cold mobile load, median (range) | Image-only master | Image + candidate film |
| --- | ---: | ---: |
| Total bytes received in 10 s | 1,435,363 (1,373,863–1,435,363) | 1,366,451 (1,364,951–1,367,951) |
| Hero video bytes received | 162,624 (101,124–162,624) | 93,611 (92,111–95,111) |

Only metadata and initial ranges arrived in the opening window. Those numbers must not be mistaken for a full 12 MB transfer saving during that window. In separate cold playback runs at the same throttle, I navigated to screening shortly after hydration and observed eight seconds. Playback time reached a median 2.16 s (2.10–2.18) with the master and 7.14 s (7.07–7.45) with the candidate. `waiting` events were 3 in each master run and 1–2 for the candidate; neither version fired a `stalled` event. Dropped-frame counts were 3–7 and 0–2 respectively in these small samples. That is useful playback headroom, not a guarantee on a real phone.

The candidate kept manual pause, unmute, playback position and source URL through tablet pullback and return. An unthrottled seek near the end crossed the loop to 1.18 s with `loop=true` and playback active (`loop-check.json`). A near-end seek during the throttled playback probe did not complete inside 1.2 seconds for either file because those ranges were not buffered; it is not evidence for or against loop correctness.

I did **not** enable the candidate. Side-by-side frames at 4, 12 and 22 seconds show softer hair, pavement and dark detail on the encode. FFmpeg's full-video YUV420 SSIM was 0.9344. The 780 px-wide comparisons are `film-frame-*.png`, left master and right candidate. The improvement in buffering is real in this lab, but the visible quality tradeoff needs owner approval and a physical-phone review. The candidate stays in this evidence directory; the temporary public copy used by the test build was removed. The existing master, loading, playback logic and poster remain unchanged.

## Regression checks and limits

The image-only production build completed. The isolated application typecheck, focused repository ESLint, script syntax checks and `git diff --check` passed. Root-wide TypeScript still sees duplicate script declarations in the audit workspaces, not application errors. Build-integrated lint still lacks `eslint-plugin-react-hooks` in those isolated workspaces.

The existing focused interaction suite passed all ten checks with no page errors on the retained image-only build. It covered reduced-motion mouse/touch/keyboard progression, enquiry focus on resize, gallery alignment, team/footer resizing, forward/reverse normal motion and quiz-state retention. Its screenshots also cover opening, screening, tablet and gallery. Neither build sent an enquiry. `interaction-after.json` and `interaction-after-*.png` are the receipts.

To repeat the cold comparisons, run `node measure.cjs image` and `node measure.cjs video` from this directory after the isolated builds exist. For the video comparison, first copy `nifemi-mobile-candidate.mp4` to `public/redesign/nifemi-mobile-candidate.mp4`; remove that temporary public copy afterward. `playback.cjs` uses the same comparison build. The isolated workspaces contain local links and should not be distributed.

These are local Chrome measurements. I cannot claim a physical-phone result, Safari decode behaviour or an exact match to mobile browser chrome. The founder still transfers early. The video candidate still needs visual approval. No commit, push, deployment, production change or enquiry submission was made.
