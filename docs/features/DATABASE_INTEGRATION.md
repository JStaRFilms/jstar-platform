# Feature: Database Integration - Supabase + Prisma + WorkOS

## 1. Overview

The J StaR Films platform uses **Supabase** (PostgreSQL) as the production database, **Prisma** as the ORM, and integrates with **WorkOS** for user authentication. This document covers the complete database architecture, migration process, and integration patterns.

## 2. Technology Stack

### Database Provider
- **Production**: Supabase PostgreSQL (hosted on AWS us-west-1)
- **ORM**: Prisma v6.16.1
- **Authentication**: WorkOS AuthKit with automatic user sync

### Connection Architecture
```
Application → Prisma Client → Connection Pooler (PgBouncer) → Supabase PostgreSQL
                            ↘ Direct Connection (for migrations)
```

## 3. Connection Configuration

### Environment Variables

```env
# Transaction pooler for queries (serverless-friendly)
DATABASE_URL="postgresql://postgres.jcupcaaguknxtjnhyxge:PASSWORD@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations
DIRECT_URL="postgresql://postgres.jcupcaaguknxtjnhyxge:PASSWORD@aws-1-us-west-1.pooler.supabase.com:5432/postgres"

# Supabase (optional - for client-side operations)
NEXT_PUBLIC_SUPABASE_URL="https://jcupcaaguknxtjnhyxge.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
```

### Prisma Schema Configuration

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

**Why Two URLs?**
- `DATABASE_URL`: Uses PgBouncer connection pooler (port 6543) - required for serverless/edge functions
- `DIRECT_URL`: Direct PostgreSQL connection (port 5432) - required for schema migrations

## 4. Database Schema

### Core Tables

The platform includes 20+ tables organized by feature:

#### Authentication & Users
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
  
  // Storage management
  storageQuota Int @default(1073741824) // 1GB
  storageUsed  Int @default(0)
  
  // Relations
  files       File[]
  folders     Folder[]
  fileShares  FileShare[]
  receivedShares FileShare[]
  googleDriveConfig GoogleDriveConfig?
}

enum UserTier {
  ADMIN     // Unlimited storage
  TIER3     // 100GB
  TIER2     // 50GB
  TIER1     // 10GB (default)
  GUEST     // 1GB temporary
}
```

#### Contact Management
- `contact_submissions` - Contact form entries
- `contact_responses` - Admin responses tracking
- `newsletter_subscribers` - Email list management
- `contact_analytics` - Submission metrics

#### Content Management
- `hero_slides` - Homepage carousel slides
- `hero_slideshow_config` - Carousel settings

#### File Storage System
- `files` - File metadata and storage
- `folders` - Hierarchical organization
- `file_shares` - Sharing permissions
- `file_versions` - Version control
- `storage_analytics` - Usage metrics
- `google_drive_configs` - Google Drive sync

#### Admin & Diagnostics
- `admin_users` - Platform administrators
- `diagnostic_history` - System health logs
- `diagnostic_config` - Diagnostic settings
- `diagnostic_schedule` - Scheduled checks

## 5. WorkOS Auth Integration

### User Sync Flow

When a user authenticates via WorkOS:

```typescript
// src/app/auth/callback/route.ts
export async function GET(request: NextRequest) {
    return handleAuth({
        onSuccess: async (auth) => {
            const { id, email, firstName, lastName, profilePictureUrl } = auth.user;
            
            await prisma.user.upsert({
                where: { email },
                update: {
                    workosId: id,
                    picture: profilePictureUrl,
                    name: [firstName, lastName].filter(Boolean).join(' '),
                },
                create: {
                    email,
                    workosId: id,
                    picture: profilePictureUrl,
                    name: [firstName, lastName].filter(Boolean).join(' '),
                    tier: 'TIER1', // Free tier for new users
                },
            });
        },
        returnPathname: returnPath,
    })(request);
}
```

### User Lookup Pattern

In API routes or server components:

```typescript
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { user } = await withAuth();
    
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Look up user in database by workosId
    const dbUser = await prisma.user.findUnique({
        where: { workosId: user.id }
    });
    
    // Use tier for access control
    if (dbUser?.tier === 'GUEST') {
        return NextResponse.json({ error: 'Upgrade required' }, { status: 403 });
    }
}
```

## 6. Database Migration History

### Migration from SQLite to PostgreSQL

**Date**: 2025-11-30

**Reason**: 
- SQLite was used for local development initially
- Production deployment requires PostgreSQL
- Supabase provides managed PostgreSQL with connection pooling

**Process**:
1. ✅ Removed SQLite migrations directory
2. ✅ Updated `schema.prisma` datasource to PostgreSQL
3. ✅ Added `DIRECT_URL` for migration support
4. ✅ Ran `npx prisma db push --accept-data-loss`
5. ✅ Generated new Prisma Client
6. ✅ Verified all tables created in Supabase

**Commands Used**:
```bash
# Remove old SQLite migrations
Remove-Item -Path ".\prisma\migrations" -Recurse -Force

# Push schema to PostgreSQL
npx prisma db push --accept-data-loss

# Generate Prisma Client
npx prisma generate
```

## 7. Common Operations

### Check Database Connection

```bash
npx prisma db pull
```

### View Database in Browser

```bash
npx prisma studio
```

### Reset Database (Development Only)

```bash
# ⚠️ WARNING: Deletes all data
npx prisma db push --accept-data-loss --force-reset
```

### Generate Prisma Client After Schema Changes

```bash
npx prisma generate
```

### Create a Migration (Production)

```bash
npx prisma migrate dev --name describe_your_change
npx prisma migrate deploy
```

## 8. Prisma Client Singleton

The application uses a singleton pattern to prevent connection pool exhaustion:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Why This Pattern?**
- Prevents multiple Prisma Client instances in development (hot reload)
- Reuses connection pool across requests
- Essential for serverless environments

## 9. Supabase Dashboard Access

### Table Editor
View and edit data directly in Supabase:
1. Navigate to: `https://supabase.com/dashboard/project/jcupcaaguknxtjnhyxge`
2. Click **Table Editor** in sidebar
3. Select table to view/edit

### SQL Editor
Run custom queries:
```sql
-- Check recent users
SELECT id, email, name, tier, "createdAt" 
FROM users 
ORDER BY "createdAt" DESC 
LIMIT 10;

-- View storage usage by user
SELECT email, tier, "storageUsed", "storageQuota"
FROM users 
WHERE "storageUsed" > 0
ORDER BY "storageUsed" DESC;

-- Contact form analytics
SELECT 
    service, 
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending
FROM contact_submissions
GROUP BY service;
```

## 10. Deployment Considerations

### Vercel Configuration

Ensure these environment variables are set in Vercel:

**Database**:
- `DATABASE_URL` (pooler connection)
- `DIRECT_URL` (direct connection)

**Supabase** (optional):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**WorkOS**:
- `WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `WORKOS_REDIRECT_URI` (must be production URL)
- `WORKOS_COOKIE_PASSWORD`

### Connection Pooling

Supabase provides PgBouncer pooling automatically:
- **Session Mode**: Full PostgreSQL features
- **Transaction Mode**: Better for serverless (used via port 6543)
- **Statement Mode**: Not recommended for ORMs

Our configuration uses **Transaction Mode** via the pooler URL.

### Cold Start Optimization

```typescript
// Prisma Client best practices for edge/serverless
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
```

## 11. Backup & Recovery

### Automated Backups (Supabase)
Supabase automatically backs up your database:
- Daily backups retained for 7 days (free tier)
- Point-in-time recovery available on paid plans

### Manual Export

Via Supabase Dashboard:
1. Go to **Database** → **Backups**
2. Click **Download** on any backup
3. Restore using `psql` or pgAdmin

Via Command Line:
```bash
# Export entire database
pg_dump "postgresql://postgres.jcupcaaguknxtjnhyxge:PASSWORD@aws-1-us-west-1.pooler.supabase.com:5432/postgres" > backup.sql

# Restore from backup
psql "postgresql://postgres.jcupcaaguknxtjnhyxge:PASSWORD@aws-1-us-west-1.pooler.supabase.com:5432/postgres" < backup.sql
```

## 12. Troubleshooting

### Issue: "Cannot find module '@prisma/client'"

**Solution**:
```bash
npx prisma generate
```

### Issue: "Connection timeout" or "Connection pool exhausted"

**Causes**:
- Not using the pooler URL (port 6543)
- Too many concurrent connections
- Prisma Client not using singleton pattern

**Solution**:
- Verify `DATABASE_URL` uses port 6543 with `?pgbouncer=true`
- Check `src/lib/prisma.ts` uses singleton pattern
- Reduce `connection_limit` in Prisma schema (if needed)

### Issue: Migrations fail with "relation already exists"

**Solution**:
```bash
# Reset migration state
npx prisma migrate resolve --applied <migration_name>

# Or push schema directly (dev only)
npx prisma db push --accept-data-loss
```

### Issue: User not appearing in database after login

**Debug Steps**:
1. Check server logs for "Syncing user to database" message
2. Verify WorkOS callback is executing
3. Check `workosId` field is being set correctly
4. Run query in Supabase SQL Editor:
```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

## 13. Performance Optimization

### Indexes

PostgreSQL automatically creates indexes for:
- `@id` fields
- `@unique` fields
- Foreign key relations

Additional indexes can be added in schema:
```prisma
model User {
  email String @unique
  
  @@index([createdAt])
  @@index([tier])
}
```

### Query Optimization

Use Prisma's query optimization features:
```typescript
// Select only needed fields
const users = await prisma.user.findMany({
    select: {
        id: true,
        email: true,
        tier: true,
    }
});

// Paginate large datasets
const users = await prisma.user.findMany({
    take: 20,
    skip: page * 20,
    orderBy: { createdAt: 'desc' }
});
```

## 14. Security Considerations

### Row Level Security (RLS)

Supabase supports RLS, but we're using Prisma exclusively:
- All database access goes through Prisma ORM
- Authentication handled by WorkOS
- Tier-based access control in application layer

### Connection String Security

**✅ DO**:
- Store credentials in environment variables
- Use different credentials for dev/staging/production
- Rotate passwords periodically

**❌ DON'T**:
- Commit `.env.local` to git
- Share connection strings publicly
- Use root credentials in application

### API Route Security

```typescript
// Always verify authentication
const { user } = await withAuth();
if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Verify user owns the resource
const resource = await prisma.file.findUnique({
    where: { id: resourceId }
});

if (resource.ownerId !== dbUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

## 15. Monitoring & Analytics

### Supabase Monitoring

Dashboard provides:
- Active connections
- Database size
- Query performance
- Error logs

### Application-Level Monitoring

Use Prisma's built-in logging:
```typescript
const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});
```

### Storage Analytics

Track storage usage with `StorageAnalytics` table:
```typescript
await prisma.storageAnalytics.create({
    data: {
        userId: user.id,
        date: new Date(),
        uploads: 5,
        downloads: 10,
        storageUsed: currentUsage,
    }
});
```

## 16. Testing Checklist

- [ ] Database connection works in development
- [ ] Database connection works in production (Vercel)
- [ ] User created automatically on WorkOS login
- [ ] User `tier` defaults to `TIER1`
- [ ] Subsequent logins update user but preserve tier
- [ ] `workosId` is unique and properly indexed
- [ ] All 20+ tables exist in Supabase
- [ ] Prisma Studio can connect and view data
- [ ] Migrations can be applied successfully

## 17. Change Log

### v2.0.0 - PostgreSQL Migration (2025-11-30)
- ✅ Migrated from SQLite to Supabase PostgreSQL
- ✅ Added connection pooling via PgBouncer
- ✅ Removed migration provider lock
- ✅ Pushed schema with `db push --accept-data-loss`
- ✅ Verified all tables created successfully
- ✅ Tested WorkOS user sync to PostgreSQL

### v1.0.0 - Initial Schema
- Created user management system
- Implemented file storage schema
- Added contact form database
- Configured hero slides management
- Set up diagnostic tracking

## 18. References

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [WorkOS AuthKit Guide](https://workos.com/docs/user-management/authkit)
- [PgBouncer Configuration](https://www.pgbouncer.org/config.html)
