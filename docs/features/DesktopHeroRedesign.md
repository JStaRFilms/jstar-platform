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

The owner's latest direction replaces letterboxing with true edge-to-edge screening. `object-fit: cover` fills the whole viewport, and navigation folds away. This necessarily crops the source image when the viewport differs from 16:9; the derivative at `/redesign/nifemi.mp4` remains available separately for uncropped viewing.

Nifemi was compared with Sharon using film contact sheets. Nifemi's full playback was observed in the browser. Its direct portrait framing and cooler colours suit the opening. Audio streams and peak levels were inspected, but there was no human audio audition. The owner should confirm music, final editorial choice and clearance before public use.

## Opening refinement
The wordmark reads `J StaR Films` / `Studios`, including the owner's capital R correction. Both lines are larger and nearly viewport-wide, with approximately matched visual widths. The description uses Georgia, with Times New Roman as a system fallback. It starts as a single content-wide line, then shrinks and rises directly beneath Studios. It shares that line's leftward arrival shift and rightward dispersal. The film starts entirely off-screen to the right and enters at 36vw. The repeated bottom tagline and review label remain removed.

## Motion and access
During the first quarter of scroll progress, the film enters while the whole wordmark shifts left, reduces to its previous resting size, and returns to its original horizontal position. From one-quarter through four-fifths, the film expands and the two lines disperse. The final fifth holds the full-screen state. The header folds upward as the film takes over; reverse scrolling retraces the same choreography and restores navigation.

One bounded animation clock follows native scroll with a 110ms time-based response and quintic easing at stage boundaries. It stops when settled, is cancelled on teardown, and is bypassed for reduced motion. There is no smooth-scroll engine, Canvas or WebGL. Text gets velocity-based blur capped at 2.5px, with a lighter amount on the description; it is sharp at rest and unfiltered in reduced motion. The film, navigation and controls stay unblurred.

Only mute/unmute is visible during screening. A small bottom-right sound toggle shows a brief "Click to listen" hint on arrival, then fades out. Pointer activity reveals the icon again. Keyboard focus keeps it visible with a clear outline and sound label. Both the hint and idle timers are cleaned up on exit and unmount. Off-screen sound controls and folded navigation are inert. Go to screening and the keyboard skip link focus the sound control; Escape restores the opening and navigation.

Playback intent is separate from actual playback, so automatic exit pauses do not cancel automatic re-entry, while a deliberate user pause does. An observer and visibility listener pause hidden media. Route teardown removes listeners, observer, scheduled frame, hint timer and development-only diagnostics. The removed player no longer needs metadata/time synchronization or dialog state.

Reduced motion removes the long scroll track, travel, easing and automatic playback. Expand film / Return to opening switch static compositions. The visitor can play manually. Escape or Return to opening restores the navigation. Film and sound controls preserve visible keyboard focus.

## References used
The owner's `C:/Users/johno/.takomi/skills/frontend-ui/creative-web-development/SKILL.md` and the complete motion-and-scroll, performance-and-profiling and concept-evaluation references were read. Applied constraints are reversible progress with a resting interval, semantic unsplit lettering, cleaned-up media/listener lifecycle, and immediately available utility. Copy follows unslop. The owner's scope update supersedes the larger creative brief for this implementation.

## Current sound and typography checks
Focused ESLint, `pnpm typecheck`, and `git diff --check` pass. Standalone Chrome verified the content-wide serif description at 1860×980, 1440×900 and 1280×720, its shrink/rise and shared Studios transform, blur during movement and sharp rest, absence of the player bar, idle hint fade, pointer reveal, persistent keyboard focus, mute/unmute, keyboard pause across re-entry, Escape exit, full-bleed loop and reduced-motion manual playback. `docs/redesign-review/sound-checks.json` stores the current results. No new screenshots or recording were created. The local server was restarted on port 5782 and returns HTTP 200.

## Earlier review captures
The existing captures below predate the sound-only control and serif-description refinement.  Standalone Chrome checked 1860×980, 1440×900 and 1280×720: large matched wordmark widths, single-line description, left shift and return, muted autoplay, looping across the edit boundary, manual pause persistence, keyboard seeking/focus, sound opt-in, reverse exit pause, reduced-motion manual playback and screening-menu access. Full-screen bounds are exactly 1860×980 at x=0/y=0, with the header hidden. No MCP was used.

Development diagnostics measure only active motion, not an always-running clock. The recorded run averaged 59 FPS with three frames over 22ms, zero WebGL calls and no runtime errors. These are local observations, not a performance guarantee for other devices.

Current captures are `docs/redesign-review/opening-revised.png`, `film-arrived.png`, `expanded-revised.png`, and the silent 16.64-second `hero-scroll.mp4`. The recording shows eased entrance, automatic playback, full-screen takeover and reverse exit. `hero-checks.json` stores the measured checks. Owner visual approval remains pending; no further scene is authorized.
