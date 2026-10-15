# Portfolio viewer integration

## Authorised outcome
The owner asked to integrate the approved portfolio viewers first, using the real film roster and existing Study Game/Melo entries. Integration is now authorised in the local source checkout. This supersedes the workshop's prototype-only restriction, not its design or factual constraints. No publication, staging, commit, push, deployment or preview replacement is authorised.

## Scope
Use Studio Notes for native film, YouTube and software viewers; integrate nine selected YouTube projects beside the existing four records, keeping their order and appending the selected manifest order. Do not add the pending Elizade campus film, removed wedding/Baby Riddim or filler. Use already-approved ten-second covers. Preserve the existing gallery design, filter/list sequence and larger-count windowing.

## Baseline to preserve
HEAD is 3905c03 with 91ab7a0, db38699 and 66bda4a in its history. Hero's original film remains /redesign/nifemi.mp4; its lower-bitrate candidate remains comparison-only. Preserve eager tablet WebP, one native-scroll clock, persistent StudyGame DOM/state, Work/Studio skip navigation, mobilePreviewLayout agreement, adaptive four/five mobile and six desktop rows, team/footer timings and enquiry drafts.

The isolated tailnet owner preview uses 127.0.0.1:5912. Do not overwrite its build directory, restart it, change its routes or enable Funnel. Existing dirty docs, review assets and verify-tablet changes are unrelated and must remain unstaged/preserved.

## Architecture boundary
Extend precise static content types and the existing Hero/gallery control flow, with cohesive viewer components as needed. No portfolio-engine rewrite, backend, CMS, database, new dependency or second app instance. The StudyGame sample must stay at its current React/DOM position and retain answers while screenshots, fullscreen, project navigation and reverse scrolling change. Software imagery/credits are intentionally unfinished; use existing assets and honest unavailable states.

## Work
1. Genesis: inspect current code and owner decisions, done.
2. Design: apply already-approved film/software and compliant YouTube references, done. No new redesign round.
3. Build: one coder owns implementation and focused tests.
4. Review: one read-only correctness/regression pass, then only confirmed blocking fixes.

## Completion
Typed roster/viewers work, relevant local checks pass, no confirmed blocking regression remains. Report missing facts and unverified real YouTube playback accurately. Keep preview artifacts out of commits and do not stage anything.