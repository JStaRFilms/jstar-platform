# Read-only current integration regression review

## Objective
Provide one focused review of current portfolio integration and its whole-site interaction boundaries while the main agent performs runtime QA. Find confirmed or concretely testable correctness/accessibility defects, not stylistic suggestions or a redesign.

## Persona and execution
Canonical persona: Reviewer. Read-only task, no write capabilities. T3-owned child of the main QA thread; use the Takomi provider and the verified `openai-codex/gpt-6.1-sol` model at high thinking. Stay in the inherited shared root checkout on `website-redesign`. Do not launch browsers, servers, other agents or external website visits. Do not modify any file, stage, commit, deploy or submit requests that mutate data.

## Scope
Inspect the current uncommitted source, not just committed HEAD or an isolated build. Read the content finalisation handoff, `PortfolioViewerIntegration.md`, `PortfolioContributionGuide.md`, the approved content notes and the relevant code. Review Hero/gallery ownership, selection and focus restoration, fullscreen/popover transitions, notes return timing, keyboard/reduced motion, media listener/timer/source teardown and viewer/dialog semantics. Identify gaps in existing harness coverage that the main agent can verify within the owner's boundaries.

Current content is thirteen approved records. Preserve existing original hero film/eager tablet, native-scroll owner, adaptive row geometry, fixed quiz identity/answers/scroll/focus, accepted team/footer and enquiry drafts. Do not infer missing credits or claim software support delivered unconfirmed implementation. Software screenshots remain deferred, the full Study Game app is off-limits, and Melo remains Visit website only.

## Definition of done
Return a concise report with file/line locations, a concrete mechanism and reproduction/check suggestion for each finding. Distinguish confirmed code defects from hypotheses requiring runtime evidence and from unavoidable external/platform test limitations. Do not treat documentation history or lack of a physical device as a source regression. Defer cosmetic cleanup, speculative abstractions and future-proofing.

## Expected artifacts
Return findings in the task summary, with no files written. Include a short list of the code/spec areas actually inspected and any important read-only coverage limitations. The main agent owns verification, fixes and the QA report.
