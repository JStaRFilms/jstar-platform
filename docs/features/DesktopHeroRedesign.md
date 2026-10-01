# Desktop hero review

## Scope
The current assignment ends at the full-screen film. `/redesign` contains the opening wordmark and film takeover only. The existing homepage and secondary pages remain intact. No tablet, application, portfolio, team, enquiry, or placeholder sections were implemented.

## Components and data flow
- `src/app/redesign/page.tsx` sets review metadata and no-index instructions.
- `src/app/redesign/Hero.tsx` owns scroll composition, playback intent, the sound hint, keyboard access and reduced-motion state.
- `src/app/redesign/hero.module.css` scopes the palette and composition to the route. It also corrects the inherited body overflow for this route only so native sticky positioning works.
- `src/app/ConditionalLayout.tsx` has one exact-route exception to omit existing global chrome and the assistant on `/redesign`.
- Navigation retains `/portfolio`, `/about`, and `/contact`.

No backend, database, schema, analytics, or production-data changes. No dependencies added.

## Film
`public/redesign/nifemi.mp4` is a 1280×720 H.264/AAC derivative of the owner's read-only `Nifemi J Christ final.mp4`. It preserves the whole 26.60-second supplied edit, normal playback speed, and its audio. The poster is taken at seven seconds. Playback starts automatically, muted, when the film begins entering the viewport. It loops until manually paused, pauses when off-screen, and preserves manual pause across re-entry. No time-scrubbing or synthetic edit is tied to scroll. The player bar and full-piece dialog were removed at the owner's request. Space on the focused film pauses or resumes playback; Escape returns to the opening.

The owner's latest direction replaces letterboxing with true edge-to-edge screening. `object-fit: cover` fills the whole viewport, and navigation folds away. This necessarily crops the source image when the viewport differs from 16:9. The crop is horizontally centred and biased upward at `object-position: 50% 35%` to retain headroom in the portrait shots. Contact sheets and the full-screen capture informed this static compromise; it cannot perfectly reframe every shot. The derivative at `/redesign/nifemi.mp4` remains available separately for uncropped viewing.

Nifemi was compared with Sharon using film contact sheets. Nifemi's full playback was observed in the browser. Its direct portrait framing and cooler colours suit the opening. Audio streams and peak levels were inspected, but there was no human audio audition. The owner should confirm music, final editorial choice and clearance before public use.

## Opening refinement
The wordmark reads `J StaR Films` / `Studios`, including the owner's capital R correction. Both lines are larger and nearly viewport-wide, with approximately matched visual widths. The provisional description reads "Films, websites and software. One creative team." It uses a medium-weight humanist sans stack, Segoe UI Variable, Segoe UI and Trebuchet MS. Its natural width and quieter 22px to 32px opening size replace the full-width serif treatment, without stretching or thin lettering. It still shrinks and rises directly beneath Studios. It shares that line's leftward arrival shift and rightward dispersal. The film starts entirely off-screen to the right and enters at 36vw. The repeated bottom tagline and review label remain removed.

## Motion and access
During the first quarter of scroll progress, the film enters while the whole wordmark shifts left, reduces to its previous resting size, and returns to its original horizontal position. From one-quarter through four-fifths, the film expands and the two lines disperse. The final fifth holds the full-screen state. The header folds upward as the film takes over; reverse scrolling retraces the same choreography and restores navigation.

One bounded animation clock follows native scroll with the owner's current 1000ms time-based response, a travel-rate cap of one normalised unit per 900ms, and quintic easing at stage boundaries. It stops when settled, is cancelled on teardown, and is bypassed for reduced motion. There is no smooth-scroll engine, Canvas or WebGL. The wordmark and film frame soften only above an estimated 1.2px/ms of travel, with blur capped at 2.5px. Gentle scroll, settled compositions and reduced motion remain crisp. The description, navigation and sound control stay unblurred. A sudden scroll jump still eases through the expansion rather than snapping full-screen.

Only mute/unmute is visible during screening. A small bottom-right sound toggle briefly shows "Sound on" on arrival, then collapses to a persistent icon at reduced opacity. The label names the action, not the current audio state; after unmuting, it reads "Sound off". Autoplay remains muted. Hover and keyboard focus reveal the label and restore full opacity. Keyboard focus has a clear outline. The hint and idle timer are cleaned up on exit and unmount. Off-screen sound controls and folded navigation are inert. Go to screening and the keyboard skip link focus the sound control; Escape restores the opening and navigation.

Playback intent is separate from actual playback, so automatic exit pauses do not cancel automatic re-entry, while a deliberate user pause does. An observer and visibility listener pause hidden media. Route teardown removes listeners, observer, scheduled frame, hint timer and development-only diagnostics. The removed player no longer needs metadata/time synchronization or dialog state.

Reduced motion removes the long scroll track, travel, easing and automatic playback. Expand film / Return to opening switch static compositions. The visitor can play manually. Escape or Return to opening restores the navigation. Film and sound controls preserve visible keyboard focus.

## References used
The owner's `C:/Users/johno/.takomi/skills/frontend-ui/creative-web-development/SKILL.md` and the complete motion-and-scroll, performance-and-profiling and concept-evaluation references were read. Applied constraints are reversible progress with a resting interval, semantic unsplit lettering, cleaned-up media/listener lifecycle, and immediately available utility. Copy follows unslop. The owner's scope update supersedes the larger creative brief for this implementation.

## Current sound and typography checks
Focused ESLint, `pnpm typecheck`, and `git diff --check` pass. Standalone Chrome checked the humanist description at 1860×980, 1440×900 and 1280×720, its shrink/rise and shared Studios transform, fast-motion blur and unblurred gentle travel/rest, the persistent sound icon and collapsed label, hover/keyboard reveal, mute/unmute, keyboard pause across re-entry, forward playback during retreat, off-screen pause, Escape exit, full-bleed loop and reduced-motion manual playback. A direct scroll jump stayed below 85% screen width in the first two frames, continued expanding after 300ms, then settled full-screen. `docs/redesign-review/sound-checks.json` stores the results.

A fresh standalone Chrome capture is `docs/redesign-review/hero-refined.mp4`, 19.52 seconds at 1860×980. It is a silent screen recording, not an audio audition. `opening-refined.png` and `expanded-refined.png` show the current typography and subject crop. The existing test runner defaults to verification only; `--capture` records a separate clean arrival, sound-hover reveal, fast-scroll takeover and retreat. No MCP was used. This recording predates the owner's 1000ms follow adjustment. The owner subsequently authorized committing the hero refinements and review assets.

## Earlier review captures
The existing captures below predate the latest humanist typography, persistent sound icon and slower takeover. Standalone Chrome checked 1860×980, 1440×900 and 1280×720: large matched wordmark widths, single-line description, left shift and return, muted autoplay, looping across the edit boundary, manual pause persistence, keyboard seeking/focus, sound opt-in, reverse exit pause, reduced-motion manual playback and screening-menu access. Full-screen bounds are exactly 1860×980 at x=0/y=0, with the header hidden. No MCP was used.

Development diagnostics measure only active motion, not an always-running clock. The recorded run averaged 59 FPS with three frames over 22ms, zero WebGL calls and no runtime errors. These are local observations, not a performance guarantee for other devices.

Earlier captures are `docs/redesign-review/opening-revised.png`, `film-arrived.png`, `expanded-revised.png`, and the silent 16.64-second `hero-scroll.mp4`. The recording shows eased entrance, automatic playback, full-screen takeover and reverse exit. `hero-checks.json` stores the measured checks. Owner visual approval remains pending; no further scene is authorized.
