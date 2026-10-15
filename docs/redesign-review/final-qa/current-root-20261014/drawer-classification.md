# Drawer assertion investigation

The first ordinary HTTPS viewer run passed its first four checks, then failed the legacy left-alignment comparison in the native-film details check. Its original receipt is preserved as `portfolio-dom/results-initial-stale-drawer-assertion.json`.

`reproduce-drawer.cjs` repeated Nifemi fullscreen return on the same current source. At the legacy timed measurement, notes were still in `entering` phase and had a nonzero transform. After the pane settled, notes and drawer both started at x=942.890625px. The drawer still ended at the 1440px shell boundary. The source fingerprint was unchanged and no page error occurred.

The accepted contract intentionally returns the notes after the actual media animation completes. A fixed 700ms wait can therefore measure a moving pane. The new DOM-only QA copy now waits for `data-notes-phase="shown"` before returning from fullscreen and comparing settled layout. Media-motion keyframes and intermediate geometry remain sampled before this wait. The archived harness and product code are untouched.

Classification: stale asynchronous test timing, not a reproduced product-code regression. The full cohort must pass the retest before the overall phase is reported as passing.
