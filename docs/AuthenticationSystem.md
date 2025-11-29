# J StaR Platform - Authentication & Access Control System

## Overview

This document provides a comprehensive overview of the authentication system and access control implementation for the J StaR Films platform.

## Documentation Structure

### Core Authentication
- **[WorkOS Authentication System](./features/WorkOSAuthentication.md)**: Complete authentication implementation using WorkOS AuthKit
  - User signup/login flows
  - Session management
  - Tier system architecture
  - Database integration

### Feature Integration
- **[JohnGPT Authentication Integration](./features/john-gpt/JohnGPT-Authentication-Integration.md)**: How JohnGPT implements the freemium access model
  - Anonymous access for basic features
  - Authenticated access for chat history (future)
  - API route architecture

### Existing Features
- **[JohnGPT Core Chat Experience](./features/john-gpt/core-chat-experience.md)**: Original JohnGPT documentation
  - Component structure
  - UI/UX details
  - Phase-by-phase implementation history

- **[Rich Message Components](./features/john-gpt/rich-message-components.md)**: Advanced chat features
  - Color palettes
  - Code blocks
  - File attachments

## Quick Start Guide

### 1. Prerequisites

Ensure you have these environment variables configured:

```env
# Database
DATABASE_URL="file:./dev.db"

# WorkOS Authentication
WORKOS_CLIENT_ID="client_xxxx"
WORKOS_API_KEY="sk_test_xxxx"
WORKOS_REDIRECT_URI="http://localhost:5782/auth/callback"
WORKOS_COOKIE_PASSWORD="<64-character-random-string>"

# AI Provider (for JohnGPT)
AI_PROVIDER="gemini"
AI_MODEL="gemini-1.5-flash"
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5782`

## User Tier System

### Tier Definitions

| Tier | Type | Access | Default Assignment |
|------|------|--------|-------------------|
| **GUEST** | Anonymous | Basic features only (no login required) | Unauthenticated users |
| **TIER1** | Free | Full features + chat history | New signups |
| **TIER2** | Paid | Increased quotas | Manual/payment |
| **TIER3** | Premium | Maximum quotas | Manual/payment |
| **ADMIN** | Internal | Full platform access | Manual only |

### Access Matrix

| Feature | GUEST | TIER1 | TIER2 | TIER3 | ADMIN |
|---------|-------|-------|-------|-------|-------|
| Browse website | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contact forms | ✅ | ✅ | ✅ | ✅ | ✅ |
| JohnGPT basic chat | ✅ | ✅ | ✅ | ✅ | ✅ |
| Chat history | ❌ | 🔜 | 🔜 | 🔜 | 🔜 |
| File storage | ❌ | 1GB | 10GB | 50GB | ∞ |
| Admin dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |

Legend: ✅ Available | ❌ Not available | 🔜 Coming soon

## Architecture Overview

### Authentication Flow

```
User Interaction Layer
├── Header (client component)
│   └── Receives authButton from server
│
├── RootLayout (server component)
│   ├── Calls withAuth()
│   ├── Passes <SignInButton /> or <UserButton />
│   └── Wraps in ConditionalLayout
│
└── ConditionalLayout (client component)
    └── Passes authButton to Header

API Layer
├── /api/chat (JohnGPT)
│   ├── Runtime: nodejs
│   ├── Auth: Optional
│   └── Access: Open to all
│
└── /api/* (Future endpoints)
    ├── Runtime: nodejs/edge
    ├── Auth: Required/Optional
    └── Access: Tier-based

Middleware Layer
├── authkitMiddleware()
│   ├── Manages session cookies
│   ├── Refreshes tokens
│   └── Protects routes

Database Layer
├── Prisma Client
│   ├── User model (with workosId, tier)
│   └── Relations (files, folders, etc.)
```

### Data Flow

```
Sign In Flow:
1. User clicks "Sign In" → getSignInUrl()
2. Redirect to WorkOS → OAuth provider
3. WorkOS redirects to /auth/callback
4. handleAuth() processes response
5. prisma.user.upsert() syncs to database
6. Session cookie set → user logged in

Sign Out Flow:
1. User clicks "Sign Out"
2. Server action calls signOut()
3. Session cookie cleared
4. User redirected to homepage
```

## Code Organization

### Feature Structure

Following the [coding guidelines](./coding_guidelines.md), features are organized as:

```
src/
├── features/
│   ├── john-gpt/               # JohnGPT feature
│   │   ├── components/
│   │   │   ├── JohnGPTDialog.tsx
│   │   │   ├── ChatMessages.tsx
│   │   │   └── ChatInput.tsx
│   │   └── index.tsx
│   │
│   └── [other-features]/
│
├── components/
│   ├── auth/                   # Shared auth components
│   │   ├── SignInButton.tsx
│   │   └── UserButton.tsx
│   │
│   └── ui/                     # Global UI components
│       ├── dialog.tsx
│       ├── code-block.tsx
│       └── color-palette.tsx
│
├── lib/
│   ├── ai-providers.ts         # AI configuration
│   ├── prisma.ts               # Prisma singleton
│   └── admin-auth.ts           # Legacy auth (deprecated)
│
└── app/
    ├── layout.tsx              # Root layout (server component)
    ├── ConditionalLayout.tsx   # Client wrapper
    ├── middleware.ts           # WorkOS middleware
    │
    └── auth/
        └── callback/
            └── route.ts        # OAuth callback handler
```

## Security Considerations

### Implemented Protections

✅ **HTTP-only session cookies** - Not accessible via JavaScript
✅ **Secure cookie transmission** - HTTPS in production
✅ **CSRF protection** - Via WorkOS middleware
✅ **Environment variables** - All secrets externalized
✅ **SQL injection protection** - Prisma ORM
✅ **Input validation** - Via Vercel AI SDK

### Recommended Additions

⚠️ **Rate limiting** - Add to API routes (especially `/api/chat`)
⚠️ **Content Security Policy** - Add CSP headers
⚠️ **Audit logging** - Log tier changes and sensitive operations
⚠️ **MFA** - Enable in WorkOS dashboard for production

## Troubleshooting

### Common Issues

**Issue**: "Unauthorized" error when accessing protected routes
- **Solution**: Check `WORKOS_REDIRECT_URI` matches your callback URL
- **Verify**: Environment variables are loaded correctly

**Issue**: "User not found" in database
- **Solution**: Sign out and sign in again to trigger user sync
- **Debug**: Check `workosId` field exists and is unique

**Issue**: TypeScript errors about WorkOS types
- **Solution**: Run `npm install` to ensure all packages are installed
- **Check**: `@workos-inc/authkit-nextjs` version is `^2.11.1` or later

**Issue**: Prisma client errors
- **Solution**: Run `npx prisma generate` to regenerate client
- **Check**: Database migrations are up to date

### Debug Mode

Enable debug logging:

```typescript
// In middleware.ts
export default authkitMiddleware({
  debug: true,
  redirectUri: process.env.WORKOS_REDIRECT_URI,
});

// In auth/callback/route.ts
console.log('User synced:', { email, workosId, tier });
```

## Testing Checklist

### Authentication Tests

- [ ] Guest user can browse public pages
- [ ] Sign in redirects to WorkOS
- [ ] New user created with `TIER1` tier
- [ ] Returning user preserves existing tier
- [ ] User profile picture displays correctly
- [ ] Sign out clears session

### JohnGPT Access Tests

- [ ] Anonymous user can open JohnGPT modal
- [ ] Anonymous user can send messages
- [ ] Authenticated user can use JohnGPT
- [ ] No errors in browser console
- [ ] Streaming response works correctly

### Tier System Tests

- [ ] Can manually change user tier in Prisma Studio
- [ ] Tier changes persist across sessions
- [ ] Different tiers have appropriate access levels

## Future Roadmap

### Phase 1: Chat History (In Progress)
- Add `Conversation` model to Prisma schema
- Implement chat history API endpoints
- Add UI for viewing previous conversations
- Implement tier-based history limits

### Phase 2: Payment Integration
- Add Stripe/Paddle integration
- Create `/pricing` page
- Implement webhook for tier upgrades
- Add subscription management UI

### Phase 3: Admin Dashboard
- Build `/admin/users` interface
- Add tier management controls
- Implement usage analytics
- Add user activity monitoring

### Phase 4: Advanced Features
- Multi-modal AI responses (images, audio)
- Team collaboration features
- Custom AI personas
- API access for developers

## Contributing

When adding new features:

1. **Read**: [coding_guidelines.md](./coding_guidelines.md)
2. **Plan**: Follow the Blueprint & Build Protocol
3. **Document**: Create/update feature docs in `docs/features/`
4. **Test**: Verify across all user tiers
5. **Review**: Ensure alignment with tier system

## Support & Resources

- **WorkOS Docs**: https://workos.com/docs
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Project Guidelines**: [coding_guidelines.md](./coding_guidelines.md)

---

**Last Updated**: 2025-11-29
**Version**: 2.0.0 (Freemium Model)
