# Task 03: Append the approved closing experience

## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
Takomi vibe-build. The owner approved implementation and will review the live page before broad QA or evidence capture.

### Prime Agent Context
Read `docs/tasks/orchestrator-sessions/orch-20261002-144557/master_plan.md`, `docs/features/FounderTeamSequence.md`, `src/app/redesign/{Hero.tsx,hero.module.css,TeamSection.tsx,team.module.css,SelectedWorkGallery.tsx,selected-work.module.css}`, `src/content/{contact.ts,testimonials.ts}`, the task-02 backend handoff, and all four `closing-options.html`, `closing-options.css`, `closing-options.mjs`, `closing-preview.css` under `C:/Users/johno/Documents/Codex/2026-09-30/https-www-jstarstudios-com-https-www/outputs/`. View `footer-option-b-enlarged.jpg`. Follow `C:/Users/johno/.takomi/skills/frontend-ui/creative-web-development/SKILL.md`; motion/performance/concept evaluation references were read by the parent, and any new technique requires its own routed reference.

### Optional Skill / Context Overlays
| Overlay | Why |
|---|---|
| creative-web-development | Native scroll orchestration, reduced motion and resource cleanup. |
| unslop | Factual, concise client-facing copy. |

## Objective
Append gallery-to-team organic wipe, team-to-chartreuse enquiry reveal, functional enquiry, client notes and Footer B to the real `/redesign` page. Preserve the mounted hero, quiz, gallery, team and the original 1000ms follow.

## Scope
Keep the real gallery/team, not mockup stand-ins. During gallery exit reveal the existing team under a diagonal irregular edge while gallery remains held; reverse scrolling retraces it without a queued animation. After the final team group settles, bring a gently curved lime panel up over the stationary team; keep the accented heading readable until covered. Then rest on a usable enquiry form with Film/Software/Both, name, email, optional phone, brief, a real `/api/contact` submit with invalid/pending/failure/success states and retained values on failure, and a separate prefilled WhatsApp link using `businessInfo.whatsapp[0]`. A direct Start a Project action must jump to the usable form without watching scenes and focus a visible control. Prevent covered content from receiving keyboard focus. One note at a time uses existing text and pictures from `src/content/testimonials.ts` for Sharon, Rev. Dr. Emmanuel Oke and John of 13 Cubes; do NOT assert Sharon is the employee with the same first name. Only `public/logos/winning-worship-way-logo.png` and `public/logos/sharons-chronicles.png` appear, large enough to recognise. Notes have prev/next/pause, hover/focus/form/offscreen/reduced auto-pause and subtle sideways/rotation change. Footer B has ink background, enlarged proportionate white studio logo copied into the repo from the approved preview, one-line tall chartreuse 'J StaR Films', contact and social links from `src/content/contact.ts`, back to top and correct copyright. No variants/nav from preview.

## Context
The site `/redesign` is isolated in `ConditionalLayout.tsx`; `Hero.tsx` currently ends with `<TeamSection ref={end}/>` and a plain dark boundary. Team owns its own native scroll and content. Keep the company's source destinations, no invented biography or claims. Request body should match task-02 contract with `phone?`, `newsletter:false`; do not simulate success. There is no confirmed delivery environment, so frontend must preserve failures. The preview is a design reference; its form deliberately does not submit.

## Definition Of Done
- Opening and gallery timings, selection, mounted StudyGame and team nav unaffected.
- Both transitions are scroll-linked, reversible, responsive and reduced-motion friendly, with stable form reading state.
- Invalid, pending, failed and successful submit UI is truthful; WhatsApp opens only a prefilled draft containing entered values.
- Client notes and footer match approved content/composition and controls work without hiding focus.

## Expected Artifacts
Scoped `/redesign` source/CSS changes, any new closing component and CSS, copied logo asset, and `docs/features/ClosingSequence.md` recording data flow and nullable phone schema handoff.

## Constraints
Do not send actual enquiries, run migrations, push, deploy, change unrelated routes, import preview nav/variants, or overwrite older staged recordings. Keep code strongly typed and changes narrow. Avoid large exhaustive test harnesses; the owner wants an interactive handoff before more evidence.

## Dependencies
Task 01 foundation and task 02 backend contract.

## Verification
Run lint/typecheck and one focused local or mocked smoke if feasible; avoid real API delivery. Give parent a precise local `/redesign` review path and any unverified delivery notes. Parent will invite owner review.

## Implementation handoff

Implemented the two reversible native-scroll overlaps on the real gallery/team, stable enquiry with optional phone and truthful API states, prefilled WhatsApp draft, three sourced client notes and Footer B. Start a Project jumps directly to the usable form and focuses the name input. Covered sections are inert. Original Hero follow, mounted quiz, gallery state and team navigation remain in place.

Created `ClosingSequence.tsx`, `EnquiryForm.tsx`, `ClientNotes.tsx`, `closing.module.css`, `public/redesign/studio-logo-white.png` and `docs/features/ClosingSequence.md`. Modified `Hero.tsx`, `hero.module.css`, `TeamSection.tsx` and `team.module.css`.

Passed narrow ESLint, `npx tsc --noEmit` and one local mocked Chrome smoke, including invalid input, failure/success, phone/draft, reverse values, held-gallery wipe, stationary final team, normal mobile validation and reduced mobile layout. Every contact request was intercepted. No real API call, delivery, database change, migration, screenshots, recording, deployment or push.

Owner review URL: `http://localhost:5782/redesign`. Database persistence and email delivery remain unverified; the nullable-phone migration is authored but not applied. Parent owns task-status updates and the owner invitation.
