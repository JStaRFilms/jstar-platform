# Closing sequence

## Goal

Finish the isolated `/redesign` page with the approved gallery-to-team wipe, chartreuse enquiry panel, client notes and Footer B. The real gallery, team, Hero and StudyGame stay mounted. Preview navigation, mock scenes and footer variants are not included.

## Client components and scroll

`Hero.tsx` adds 0.8 viewport heights after its existing gallery track and mounts `TeamSection` with a matching overlap. The original Hero geometry, gallery ranges and 1000ms opening follow are unchanged. Gallery selection and the mounted quiz keep their existing state.

`TeamSection.tsx` reveals its existing sticky stage through a diagonal irregular clip edge over 0.8 viewport heights. Its original 4.1 viewport heights of portrait travel begin after this entrance. Another 0.9 viewport heights hold the settled group while the enquiry arrives. Member navigation includes the entrance offset. Meet everyone and From the beginning fade the team stage out, jump to the requested endpoint, then fade it back in; manual scrolling cancels that jump. Gallery controls become inert when the wipe starts, and team controls become inert during the wipe and enquiry cover.

`ClosingSequence.tsx` overlaps that final team hold. A sticky chartreuse panel rises with a curved top, then flattens at the end of its 0.9 viewport-height reveal. An actual spacer supplies sticky travel. Afterward the panel scrolls as normal content, including on smaller screens where the form and notes exceed the viewport. The enquiry is inert until the cover completes.

Both transitions read native scroll directly. They retrace the same positions on reversal without timers or queued scenes. Scroll and resize events schedule one frame; listeners and frames are removed on unmount. Reduced motion removes the overlapping entrances and presents ordinary sections. Footer B's wordmark stretch also uses native scroll, or stays fully open with reduced motion.

Start a Project calls the closing component's handle, jumps instantly to the completed reveal and focuses the visible name field. Validation focuses fields without rewinding the reveal. On a smaller screen, an invalid field above the viewport scrolls back into view, clamped to the completed reveal.

## Form and server data flow

`EnquiryForm.tsx` keeps controlled service, name, email, optional phone and brief values mounted through forward and reverse scrolling. It validates before sending and distinguishes invalid, pending, failure and success. Pending controls are disabled against duplicate submission. Failures retain all values.

The form posts JSON to the existing `/api/contact` endpoint:

- `name` and `email` are trimmed.
- `service` is Film, Software or Both.
- `subject` is the selected service followed by `project enquiry`.
- `message` contains the trimmed brief.
- `phone` is omitted when blank; nonempty input is trimmed, limited to 40 characters and checked against the backend phone format.
- `newsletter` is always false.

The client requires both an HTTP success and `status: 'success'` before reporting receipt. It does not claim email delivery. The backend owns rate limiting and persistence. Storage failure returns a failure response before notification. Newsletter and analytics updates and email notifications are best-effort after the contact has been saved.

A separate WhatsApp link uses `businessInfo.whatsapp[0]` and builds an encoded draft from the entered fields. Following it does not submit the form or send the draft.

## Nullable phone schema handoff

Task 02 added `ContactSubmission.phone String?` in `prisma/schema.prisma`. Migration `prisma/migrations/20261002144557_add_contact_submission_phone/migration.sql` adds a nullable TEXT column to `contact_submissions`. Old callers can omit phone. The API stores omitted, null or blank phone as null and includes nonempty phone in the HTML-escaped admin notification.

The Prisma client was generated locally by the backend task. The migration has not been applied to an unconfirmed database. Persistence and notification delivery still require the owner to confirm the target and authorize that step. No database operation or real enquiry was performed for frontend verification.

## Client notes and footer content

`ClientNotes.tsx` uses the existing Sharon, Rev. Dr. Emmanuel Oke and John of 13 Cubes entries and portraits from `src/content/testimonials.ts`. Sharon is credited only as Sharon, Influencer, Sharon's Chronicles. There is no claim that she is the team member with the same first name.

Only one note is visible and exposed to assistive technology. Hidden quotes reserve the tallest quote's space, so changing notes does not move the form. Previous, next and pause controls stay mounted. Ten-second automatic changes stop during hover, note focus, form focus, offscreen state, background tabs and reduced motion. Manual changes keep focus on the controls.

Only the existing Winning Worship Way and Sharon's Chronicles public logos appear. Footer B uses the approved white logo copied unchanged to `public/redesign/studio-logo-white.png`, a one-line chartreuse `J StaR Films` wordmark, current-year copyright, back to top and destinations from `businessInfo`. No preview email, number or social destination is hardcoded.

## Checks and review

Passed narrow ESLint on the five changed TSX files and `npx tsc --noEmit`. One local Chrome smoke intercepted every `/api/contact` request. It checked direct form focus, invalid input without a request, mocked storage failure and success, phone payload, WhatsApp draft, stable note layout, held-gallery wipe, inert final team during cover, retained values on reversal, normal mobile validation and reduced mobile layout. No screenshots or recordings were taken.

Review at `http://localhost:5782/redesign`. Actual database persistence and email delivery remain unverified. Owner visual review comes before broader QA.
