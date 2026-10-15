# Orchestrator Master Plan

## Overview

Session `orch-20261002-144557` covers the approved closing sequence of the `/redesign` page on `website-redesign`. Build is complete, with the migration authored but not applied. The user will inspect the live page before any broad test or evidence pass.

## Context Intake

The hero, mounted quiz, gallery and team are complete and must remain mounted and reversible. The mockup under `C:/Users/johno/Documents/Codex/2026-09-30/https-www-jstarstudios-com-https-www/outputs/` is a design reference, not production content. Use Footer B only. `src/content/contact.ts` owns contact destinations; `src/content/testimonials.ts` and existing public images/logos own client facts. The testimonial Sharon's surname is not verified, so do not call her a team member. The contact API previously reported success after a failed save. It now returns an error if it cannot save the contact. A nullable phone field and additive migration carry phone through storage and the admin notification. The migration remains unapplied because no database target is confirmed.

## Skills Registry

- `creative-web-development`: read its motion, performance and concept-evaluation references; apply scroll state ownership, resource cleanup, and a direct utility route.
- `unslop`: keep visitor-facing copy plain and factual.

## Workflows Registry

- Genesis: existing product foundation and feature records reviewed; no new product discovery.
- Design: `closing-options.*`, imported `closing-preview.css` and Footer B approved by the owner, with no variant UI.
- Build: scoped backend contract, page transitions, enquiry and client notes, Footer B.
- Review/finalize: lint/typecheck and a small mocked, no-delivery interaction check; then owner review on the live page. Defer screenshots/recording until requested again.

## Task Table

| # | Subtask | Role | Workflow | Dependency | Status |
|---|---|---|---|---|---|
| 01 | Confirm source contracts and existing foundation | Worker | vibe-genesis | None | Completed |
| 02 | Correct contact storage failure and carry optional phone | Coder | vibe-build | 01 | Completed |
| 03 | Add scroll transitions, enquiry UI, client notes and Footer B | Coder | vibe-build | 01, 02 contract | Completed |
| 04 | Integrate and hand off owner preview | Orchestrator | vibe-build | 02, 03 | Completed |

## Progress Checklist

- [x] Existing `/redesign` foundation, mockup and creative references read.
- [x] Reusable contact, media and destination sources identified.
- [x] Correct contact success/failure contract and author nullable-phone migration without sending real enquiries.
- [x] Append closing sequence without disturbing prior mounted sections or follow timing.
- [x] Run narrow static checks and one mocked, no-delivery browser smoke; focused review found no blocking defect.
- [x] Prepare the owner handoff at `http://127.0.0.1:5782/redesign`; wait for feedback before broader evidence work.

## Notes

Preserve the older staged files. Do not apply a migration to an unconfirmed target, deliver a real test enquiry, change production data, push or deploy. Do not imply a form is delivered when a database write fails. Keep WhatsApp separate from submission. Start a Project must take visitors directly to a usable form. The closing mockup's fake gallery/team scenes and variant selector must never enter the live page.
