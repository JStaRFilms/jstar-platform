# Task 04: Review scope and invite owner preview

## 🔧 Agent Setup (DO THIS FIRST)

### Workflow to Follow
Takomi vibe-build final handoff, not an extended verification campaign.

### Prime Agent Context
Read `docs/tasks/orchestrator-sessions/orch-20261002-144557/master_plan.md`, the Task 02 and 03 outcomes, and the resulting `docs/features/ClosingSequence.md`.

### Optional Skill / Context Overlays
| Overlay | Why |
|---|---|
| creative-web-development | Final factual/utility/constraint audit. |

## Objective
Confirm the new code stays within approved scope and hand the owner a live page for direct visual review.

## Scope
Inspect only the closing changes, ensure older staged work remains untouched, check truthfulness of submission states, and report one local URL and any blocked database delivery. Do not recursively test or collect performance recordings.

## Context
The user explicitly wants to be brought into the loop before screenshots, recordings or broad QA. No production database target is confirmed.

## Definition Of Done
A brief owner-facing handoff lists what changed, narrow checks actually passed, unverified delivery integration, and asks the owner to look at `/redesign`.

## Expected Artifacts
Updated master-plan status and concise chat handoff. No required visual recording or screenshot at this checkpoint.

## Constraints
Do not send test enquiries, migrate a database, push, deploy or commit unrelated staged files.

## Dependencies
Tasks 02 and 03.

## Verification
One scoped diff check and targeted static checks if not already run; owner reviews visual behavior next.
