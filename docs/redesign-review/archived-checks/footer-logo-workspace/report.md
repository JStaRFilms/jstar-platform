# Desktop footer logo restoration

The desktop logo is restored to its original horizontal center and original 12vh top position. It is 200px square on regular desktop heights and 160px on short desktop screens. The mobile logo remains 80px square at the right of the contact block. The expanding lettering clears whichever is lower, the logo or the contact block, without changing its fixed lower pin.

## Verification

- Production build passed with recorded exit code 0 in `build-status.json`. Earlier synchronous attempts were interrupted or timed out; the tracked background build completed.
- Next's integrated lint invocation reported the existing react-hooks plugin resolution warning. Focused ESLint passed with the dependency paths from the project's own ESLint shim. No dependency or lint configuration was changed.
- 38 focused checks passed, including original desktop centering/size/height, entry and reversal clearance, reduced motion, back-to-top navigation and mobile geometry comparisons against the previous production preview.
- All ten existing interaction checks passed with no page errors. No enquiry was submitted.
- Root footer source matches the tested isolated workspace. The preview was copied from the previous approved workspace, then updated only with the two footer source files; concurrent portfolio changes were not added to this preview.
- The private HTTPS route on port 3460 now points to localhost port 5914 and returned HTTP 200. The previous preview process was stopped after the route was verified.

Only `ClosingSequence.tsx`, `closing.module.css` and the closing feature document changed in the checkout for this request. Nothing was committed or pushed.
