# Footer opening correction

Removed the delayed, top-anchored growth. The bottom edge of the lettering stays at its viewport pin. The upper edge follows the rising contact group. The wordmark fills the space between those edges throughout the entrance, before the sticky stage reaches the top. Mobile remains stacked and desktop keeps the original lettering.

## Verification

- 92 opening checks passed on the production build. They cover entry before the stage pins, both edge positions, full-space fill, reversal, completed sticky hold, mobile/desktop typography, resize, reduced motion and logo navigation.
- All ten existing interaction checks passed with no page errors. No real enquiry was submitted.
- `npx eslint src/app/redesign/ClosingSequence.tsx` passed. Directly invoking the ESLint JavaScript entry bypassed the package shim and could not resolve its react-hooks plugin. The configured npx command resolves it successfully.
- Next production build completed successfully and checked types. Its integrated lint invocation reported the same plugin-resolution warning. No dependency or unrelated lint configuration was changed.
- Source hashes match the isolated production workspace. Focused diff check passed.
- The existing HTTPS port 3460 now points to port 5912. Funnel remains off. The previous preview process was stopped after the new route responded successfully.

Physical-phone toolbar and scroll feel still require owner review. No commit or push was made.
