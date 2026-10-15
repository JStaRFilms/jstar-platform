# Task 02: Make contact delivery truthful and store optional phone

## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
Takomi vibe-build. Implement a scoped backend change on the existing contact route.

### Prime Agent Context
Read `docs/tasks/orchestrator-sessions/orch-20261002-144557/master_plan.md`, `src/app/api/contact/route.ts`, `src/lib/email.ts`, `prisma/schema.prisma`, `src/features/ContactPage/components/ContactForm.tsx`, `src/content/contact.ts` and the nearest relevant Prisma migration before editing.

### Optional Skill / Context Overlays
| Overlay | Why |
|---|---|
| creative-web-development | Factual visitor-facing delivery state and fast access to contact. |

## Objective
Use the existing protected contact API for the new enquiry while ensuring success means persistence succeeded, and persist an optional phone number as its own field.

## Scope
Only the contact route, admin notification, Prisma contact submission model, and a new additive SQL migration. Accept optional `phone` while preserving previous callers without it. Validate and trim the phone safely, store it as nullable, and include it in the admin notification with HTML escaping. Keep existing rate limiting, newsletter behavior, and other validation intact. A failed database write must return failure and must not send a false success or confirmation.

## Context
The owner explicitly authorized schemas and migrations. The destination is unconfirmed; do not APPLY migration or run against live data. The mockup form sends `name`, `email`, `service` (Film, Software, Both), `message` as brief, `phone?`, `subject` derived from service, `newsletter:false` to `/api/contact`. The existing endpoint currently swallows DB errors and returns success; that must change. Existing email failure handling can remain best-effort after a successful database write, but report any unverified email delivery.

## Definition Of Done
- Optional phone passes validation, persists in its own nullable column, and reaches the admin notification.
- Old clients omitting phone remain accepted.
- Invalid input/rate limits/persistence failure retain meaningful non-2xx responses; no false success on failed save.
- No real test enquiry or database migration is executed.

## Expected Artifacts
`src/app/api/contact/route.ts`, `src/lib/email.ts`, `prisma/schema.prisma`, a new SQL migration under `prisma/migrations/`, and a short agent handoff noting commands run and whether a database target remains unverified.

## Constraints
Do not change unrelated email flows, deploy, push, run `prisma migrate`/`db push`, send mail, or expose secrets. Preserve older staged work. Do not introduce `any` or broad casts.

## Dependencies
Task 01 foundation.

## Verification
Narrow static/type or local validation only. Do not call the live contact route or send mail. Owner requested no exhaustive suite.

## Implementation handoff

Backend implementation and local static checks completed. Integration remains blocked until the owner confirms the database target and authorizes applying the migration.

Changed files:
- `src/app/api/contact/route.ts`: accept optional phone, validate and trim it, store blanks/omissions/null as null, pass phone to admin mail, and return 500 before email calls if the contact record cannot be saved; log newsletter and analytics failures after a successful save. Success uses the saved ID and says the message was received. Rate limiting, newsletter writes, analytics, and existing field validation rules remain in place. Request validation now narrows from unknown rather than any.
- `src/lib/email.ts`: accept optional nullable phone and include it in the admin HTML after escaping ampersands, angle brackets, and both quote types. Other email flows are unchanged.
- `prisma/schema.prisma`: add nullable `ContactSubmission.phone`.
- `prisma/migrations/20261002144557_add_contact_submission_phone/migration.sql`: additive nullable TEXT column only.

Frontend contract: existing fields are unchanged. `phone` can be omitted, null, or a string. Blank strings become null. Nonempty strings are trimmed, limited to 40 characters, allow digits, spaces, plus, parentheses, periods, and hyphens, and must contain a digit. Validation errors return 400, rate limits return 429, and database errors return 500. Mail remains best-effort after successful database operations.

Checks run successfully:
- `npx --no-install prisma validate`
- `npx --no-install prisma generate`, local client generation only, no database connection
- `npx --no-install eslint src/app/api/contact/route.ts src/lib/email.ts`
- `npx --no-install tsc --noEmit -p .pi/takomi/contact-typecheck.json`, temporary config extending the repository config and including only the contact route/email files; removed after use
- `git diff --check`

No migration was applied, database pushed, API called, mail sent, deployment run, or git push performed. Existing staged files were not changed. Actual database persistence and email delivery remain unverified. Newsletter or analytics writes can fail after the contact is saved. Those failures are logged but do not change the saved-record success response or block email notification.
