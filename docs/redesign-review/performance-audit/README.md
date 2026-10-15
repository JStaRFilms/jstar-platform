# Performance audit

Read the completed [rechecked report](recheck/report.md).

It supersedes the conclusions in the older `audit-report.md`. The recheck did not reproduce horizontal document scrolling, did not measure a genuinely hidden tab, and found that animation callbacks stop at rest. It also corrected invalid journey-test selectors and separated production measurements from incomplete test runs.

Key evidence:

- [Baseline and source hashes](recheck/baseline.json)
- [Loading and repeated runtime measurements](recheck/clean-measurements.json)
- [Section trace summary](recheck/section-traces.json), with adjacent compressed Chrome traces
- [Corrected desktop and enquiry checks](recheck/release-check.json)
- [Mobile, reduced-motion and lifecycle checks](recheck/mobile-lifecycle.json)
- [Asset inspection](recheck/assets.json)
- [Unchanged source and process cleanup](recheck/completion-baseline.json)

Screenshots and reproduction scripts are in `recheck/`. Test failures for reduced motion are reported product findings, not completed fixes. The older report and scripts remain for history. Do not distribute `recheck/build-workspace`; it contains local dependency and environment links.
