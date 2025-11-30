# Feature: WorkOS Authentication System

## 1. Purpose

The WorkOS Authentication System provides secure, enterprise-grade authentication for the J StaR Films platform using WorkOS AuthKit. It handles user login, registration, session management, and tier-based access control.

## 2. Authentication Architecture

### Runtime & Technology Stack
- **Provider**: WorkOS AuthKit (`@workos-inc/authkit-nextjs`)
- **Database**: Supabase PostgreSQL (via Prisma ORM)
- **Session Management**: HTTP-only cookies (secure, automatic)
- **Middleware**: Route protection via `authkitMiddleware`
- **User Sync**: Automatic database sync on authentication callback

### User Tier System

The platform implements a freemium model with the following tiers:

| Tier | Access Level | Features | Assignment |
|------|-------------|----------|------------|
| **GUEST** | Anonymous users (not logged in) | Basic access to JohnGPT modal (no chat history) | Default for non-authenticated users |
| **TIER1** | Free authenticated users | JohnGPT with chat history, basic storage | Default for new signups |
| **TIER2** | Paid users | Increased storage, priority support | Upgrade via payment |
| **TIER3** | Premium users | Maximum storage, advanced features | Upgrade via payment |
| **ADMIN** | Platform administrators | Full access to all features | Manual assignment |

## 3. Main Components

### Middleware (`src/middleware.ts`)

**Purpose**: Protects routes and manages authentication state automatically.

```typescript
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  redirectUri: process.env.WORKOS_REDIRECT_URI,
});
```

**Configuration**:
- Runs on all routes except static assets and Next.js internals
- Handles session refresh automatically
- Redirects unauthenticated users when accessing protected routes

### Auth Callback Route (`src/app/auth/callback/route.ts`)

**Purpose**: Handles OAuth redirect from WorkOS and syncs users to the database.

**Key Features:**
- Creates or updates user records using `prisma.user.upsert()`
- Syncs WorkOS user ID, email, name, and profile picture
- Assigns `TIER1` (free tier) to new signups by default
- Preserves existing tier on re-login

**Database Fields Synced:**
- `workosId`: Unique WorkOS user identifier (used for lookups)
- `email`: User's email address
- `name`: Full name (from `firstName` + `lastName`)
- `picture`: Profile picture URL from WorkOS
- `tier`: User's access level (defaults to `TIER1`)

### UI Components

#### SignInButton (`src/components/auth/SignInButton.tsx`)

**Purpose**: Redirect users to WorkOS hosted login page.

```typescript
import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import Link from 'next/link';

export async function SignInButton() {
  const signInUrl = await getSignInUrl();
  return <Link href={signInUrl}>Sign In</Link>;
}
```

**Usage**: Display in header when user is NOT authenticated.

#### UserButton (`src/components/auth/UserButton.tsx`)

**Purpose**: Display user profile and sign-out option.

**Features:**
- Shows user avatar and name
- Provides sign-out button (server action)
- Automatically clears session on sign-out

**Usage**: Display in header when user IS authenticated.

## 4. Layout Integration

### Root Layout (`src/app/layout.tsx`)

The root layout is a **server component** that:
1. Calls `withAuth()` to get the current user session
2. Conditionally renders `<SignInButton />` or `<UserButton />`
3. Passes the appropriate button to `<ConditionalLayout />` via props

```typescript
export default async function RootLayout({ children }) {
  const { user } = await withAuth();
  const authButton = user ? <UserButton user={user} /> : <SignInButton />;
  
  return (
    <html>
      <body>
        <ConditionalLayout authButton={authButton}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
```

### Conditional Layout (`src/app/ConditionalLayout.tsx`)

**Purpose**: A **client component** that conditionally renders the header/footer based on the current route.

**Key Feature**: Receives `authButton` as a prop from the server-side layout and passes it to the `<Header />` component.

### Header (`src/components/layout/Header.tsx`)

**Purpose**: Displays navigation and authentication status.

**Props**:
- `authButton?: React.ReactNode` - The auth button (sign in or user menu) passed from the server

## 5. Environment Variables

Required in `.env.local`:

```env
# WorkOS Authentication
WORKOS_CLIENT_ID="client_xxxx"
WORKOS_API_KEY="sk_test_xxxx"
WORKOS_REDIRECT_URI="http://localhost:5782/auth/callback"
WORKOS_COOKIE_PASSWORD="<64-character random string>"

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:PASSWORD@aws-1-us-west-1.pooler.supabase.com:5432/postgres"

# Supabase (optional - for client-side features)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
```

**Generate Cookie Password:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Database URLs:**
- `DATABASE_URL`: Uses PgBouncer connection pooler (port 6543) for serverless compatibility
- `DIRECT_URL`: Direct PostgreSQL connection (port 5432) for running migrations

## 6. Database Schema

### User Model (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  picture   String?
  workosId  String?  @unique
  tier      UserTier @default(TIER1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  files       File[]
  folders     Folder[]
  // ... other relations
}

enum UserTier {
  ADMIN
  TIER3
  TIER2
  TIER1
  GUEST
}
```

## 7. Protected Routes & Access Control

### Route Protection via Middleware

The `authkitMiddleware` automatically:
- Checks for valid session cookies
- Redirects to WorkOS login if no session found
- Allows public routes to remain accessible

### API Route Protection Example

For endpoints requiring specific tiers (like JohnGPT with chat history):

```typescript
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  // Optional authentication for free access
  const { user } = await withAuth();
  
  if (user) {
    // Fetch user tier from database
    const dbUser = await prisma.user.findUnique({
      where: { workosId: user.id }
    });
    
    // Implement tier-specific logic
    if (dbUser?.tier === 'TIER1') {
      // Save chat history for authenticated users
    }
  }
  // Allow anonymous access to basic features
}
```

## 8. User Flow Diagrams

### New User Signup Flow

```
1. User clicks "Sign In" button
   ↓
2. Redirected to WorkOS hosted login page
   ↓
3. User creates account or logs in with OAuth provider
   ↓
4. WorkOS redirects back to /auth/callback
   ↓
5. Callback route creates user in database with TIER1
   ↓
6. User redirected to homepage (now authenticated)
```

### Returning User Login Flow

```
1. User clicks "Sign In" button
   ↓
2. Redirected to WorkOS (may auto-login if session exists)
   ↓
3. WorkOS redirects back to /auth/callback
   ↓
4. Callback route updates user record (preserves tier)
   ↓
5. User redirected to homepage
```

## 9. Tier Management

### Current Implementation
- **New Users**: Automatically assigned `TIER1` (free tier)
- **Tier Changes**: Manual via Prisma Studio or admin dashboard

### Future Implementation Options

**Option 1: Payment Integration (Recommended)**
- Add Stripe/Paddle payment flow
- Webhook updates `user.tier` on successful payment
- `/pricing` page with tier comparison

**Option 2: Admin Dashboard**
- Build `/admin/users` interface
- Manual tier assignment for VIP/beta users

**Option 3: WorkOS Organizations**
- Map WorkOS roles → platform tiers
- Automatic sync during auth callback

## 10. Security Best Practices

### Implemented
✅ Session cookies are HTTP-only (not accessible via JavaScript)
✅ Secure cookie transmission (HTTPS in production)
✅ CSRF protection via WorkOS middleware
✅ Environment variables for secrets
✅ Database user lookup via unique `workosId`

### Recommendations
- Enable WorkOS MFA (multi-factor authentication) in production
- Implement rate limiting on API routes
- Add audit logging for tier changes
- Monitor failed login attempts

## 11. Troubleshooting

### Common Issues

**"Unauthorized" Error**
- Check that `WORKOS_REDIRECT_URI` matches the callback URL
- Ensure WorkOS environment variables are set correctly
- Verify the redirect URI is registered in WorkOS dashboard

**"User not found" in Database**
- Sign out and sign in again to trigger sync
- Check `workosId` field in database matches WorkOS user ID
- Run `npx prisma studio` to manually verify user record

**Session Not Persisting**
- Ensure `WORKOS_COOKIE_PASSWORD` is at least 32 characters
- Check browser allows cookies for localhost
- Verify middleware is configured correctly

### Debug Mode

Add logging to middleware and callback route:

```typescript
// In auth/callback/route.ts
console.log('User synced:', { email, workosId: id, tier });

// In middleware.ts
export default authkitMiddleware({
  debug: true, // Enable debug logging
  redirectUri: process.env.WORKOS_REDIRECT_URI,
});
```

## 12. Testing Checklist

- [ ] Guest user can access homepage
- [ ] Guest user sees "Sign In" button
- [ ] Sign in redirects to WorkOS
- [ ] After login, user is created in database with `TIER1`
- [ ] User sees their name/avatar in header
- [ ] Sign out clears session
- [ ] Returning user preserves their tier
- [ ] Protected API routes check authentication

## 13. Change Log

### v1.0.0 - Initial WorkOS Integration
- Implemented `authkitMiddleware` for route protection
- Created auth callback route with Prisma user sync
- Added `SignInButton` and `UserButton` components
- Updated database schema with `workosId` and `picture` fields
- Configured environment variables for WorkOS

### v1.1.0 - Freemium Model
- Changed default tier from `GUEST` to `TIER1` for new signups
- Updated tier definitions: GUEST = anonymous, TIER1 = free logged-in users
- Enabled public access to basic features (e.g., JohnGPT modal)
- Prepared framework for chat history (TIER1+) vs. ephemeral sessions (GUEST)

### v2.0.0 - Production Database Migration (2025-11-30)
- **Migrated from SQLite to Supabase PostgreSQL**
- Updated Prisma schema to use PostgreSQL provider
- Configured connection pooling via PgBouncer (port 6543)
- Added direct connection URL for migrations (port 5432)
- Verified all tables created successfully in Supabase
- Tested WorkOS authentication with PostgreSQL user sync
- See [`DATABASE_INTEGRATION.md`](./DATABASE_INTEGRATION.md) for complete database documentation
