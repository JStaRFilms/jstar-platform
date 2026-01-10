# Auth Middleware and Conversations API Hardening (2025-12-14)

## Summary
- Enforced secure failure when `WORKOS_REDIRECT_URI` is missing.
- Prevented middleware interference with WorkOS callbacks.
- Provision local users automatically on first use of JohnGPT.
- Made conversation update atomic and return the updated record directly.

## Files Changed
- middleware.ts
- src/app/api/conversations/route.ts (GET, POST)
- src/app/api/conversations/[id]/route.ts (GET, PATCH, DELETE)
- src/features/john-gpt/services/conversation.service.ts

## Authentication Middleware
- In production: throws if `WORKOS_REDIRECT_URI` is undefined to avoid exposing protected routes.
- In development: logs a loud warning but continues for local iteration.
- Matcher excludes WorkOS auth routes to avoid callback interception:
  - `/_next/static`, `/_next/image`, `/favicon.ico`, `/sitemap.xml`, `/robots.txt`
  - `/api/auth` and all subpaths (e.g. `/api/auth/callback`)

## User Provisioning (WorkOS → Local User)
- New helper `getOrCreateDbUser(workosId, {email?, name?})` in conversations API routes.
- Behavior:
  - Looks up by `workosId`.
  - If missing, creates the local user with:
    - `workosId: <id>`
    - `email`: WorkOS-provided email, or deterministic placeholder `<workosId>@placeholder.local` to satisfy unique constraint.
    - `name`: optional.
- Applied in:
  - `GET /api/conversations`
  - `POST /api/conversations`
  - `GET/PATCH/DELETE /api/conversations/[id]`

## Conversations Service: Update Logic
- Replaced `updateMany` + `findUnique` with a single `update({ where: { id } })` and return the updated record.
- Route layer performs an ownership existence check (`findFirst({ id, userId })`) before calling update. This avoids races from `updateMany` and ensures 404 is returned early.
- `getConversation` now filters by both `id` and `userId` in a single query.

## Security Considerations
- Secure-by-default auth initialization in production.
- No middleware interference with OAuth callbacks.
- New user provisioning prevents 404s for first-time users without leaking data.
- PATCH uses an existence check to avoid unnecessary updates and clearer 404s.

## Environment Variables
- Required:
  - `WORKOS_REDIRECT_URI` (example: `https://your-domain.com/api/auth/callback`)
- If missing in production, the app will fail fast on boot.

## Testing Checklist
- Set `WORKOS_REDIRECT_URI` and verify middleware boots without error in production mode.
- Navigate to a protected route without being authenticated → redirected by WorkOS.
- Complete WorkOS sign-in → callback bypasses middleware as expected.
- First-time WorkOS user:
  - `GET /api/conversations` returns empty array and creates local user.
  - `POST /api/conversations` creates a conversation for the new user.
- Update flow:
  - `PATCH /api/conversations/[id]` for an owned id updates and returns the updated record.
  - Non-existent or non-owned id → 404.

## Rollout Notes
- No schema changes required.
- If you want atomic ownership enforcement in the DB layer, add a composite unique index on `(id, userId)` and switch `update({ where: { id }})` to `update({ where: { id_userId: { id, userId }}})`.
