# Footer refinement check

Mobile uses the approved stacked `J StaR` / `FILMS STUDIOS` wordmark. Desktop keeps the one-line composition. The footer pins before stretching; the contact group and logo stay still. The last tenth of the existing sticky travel holds the complete composition. The wordmark fills the measured space between the contact group and copyright.

## Checks

- Isolated production build passed.
- Focused ESLint passed for `ClosingSequence.tsx`.
- 70 footer checks passed at 320×480, 320×560, 360×640, 390×844, 412×915, 760×800, 1440×640, 1440×900 and 1920×1080. These cover the pinned intermediate poses, forward/reverse scroll, full-space fill, mobile/desktop lettering, contact/wordmark separation, bottom coverage, logo navigation, resize and reduced motion. No page errors.
- The first interaction-suite run passed nine checks but timed out waiting for the quiz progress element. A focused reproduction confirmed progress state before and after returning to the game. The unchanged suite then passed all ten checks with no page errors.
- No enquiry was submitted. Test browser requests were limited to GET, HEAD and OPTIONS.
- Physical-phone toolbar behavior remains an owner check. Desktop emulation does not certify physical-phone performance.

## Reference constraints applied

- `creative-web-development/references/concept-evaluation.md`: Keep contact actions available without requiring the wordmark animation; retain real content and a static reduced-motion equivalent.
- `creative-web-development/references/motion-and-scroll.md`: Reuse the existing native-scroll frame and keep a resting interval before the end of pinned travel. No new scroll driver.
- `creative-web-development/references/performance-and-profiling.md`: Measure font geometry only at font readiness and viewport changes, not every animation frame. Existing coalesced scroll/resize scheduling and teardown remain in place.

Source changes are limited to `ClosingSequence.tsx`, `closing.module.css` and the closing-sequence feature document. The public phone, email, location, destinations and logo asset are unchanged.
