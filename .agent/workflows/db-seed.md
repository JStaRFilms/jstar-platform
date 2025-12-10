---
description: How to seed/reset the database with constant data (AI models, personas, configs, etc.)
---

# Database Seeding Workflow

Use this workflow when you need to restore constant data after a database reset, or when adding new seed data.

## Quick Commands

| Command | What it Does | Destructive? |
|---------|--------------|--------------|
| `npm run db:seed` | Seeds: Personas, AI Models, Configs | ❌ Safe |
| `npm run db:embeddings` | Regenerates: Navigation + RAG embeddings | ❌ Safe |
| `npm run db:reset` | **Full wipe + restore everything** | ⚠️ **YES** |

### Seed Only (Safe - won't delete data)
```bash
npm run db:seed
```
Runs all seed scripts using `upsert` - if data exists, it updates it. Safe to run anytime.

### Regenerate Embeddings Only
```bash
npm run db:embeddings
```
Regenerates all vector embeddings (navigation + RAG). Safe to run anytime.

### Full Reset (⚠️ Destructive - clears ALL data)
```bash
npm run db:reset
```
This will:
1. Force-reset the database schema (`prisma db push --force-reset`)
2. Run all seeders (`npm run db:seed`) - Personas, AI Models, Configs
3. Regenerate ALL embeddings (`npm run db:embeddings`) - Navigation, Sections, RAG

## What Gets Restored

| Data | Script | Included in `db:reset`? |
|------|--------|------------------------|
| AI Personas | `prisma/seed-personas.ts` | ✅ |
| AI Providers | `prisma/seed-ai-models.ts` | ✅ |
| AI Models | `prisma/seed-ai-models.ts` | ✅ |
| Default Configs | `prisma/seed-configs.ts` | ✅ |
| Page Navigation (vectors) | `src/scripts/populate-navigation.ts` | ✅ |
| Page Sections (vectors) | `src/scripts/populate-sections.ts` | ✅ |
| Site RAG Embeddings | `scripts/embed-site.ts` | ✅ |

## Adding a New Seeder (Auto-Discovery)

1. Create a new file: `prisma/seed-YOUR_NAME.ts`
2. Export a `seed()` function:

```typescript
import { PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
    console.log('🌱 Seeding YOUR_NAME...');

    await prisma.yourModel.upsert({
        where: { uniqueField: 'value' },
        update: { /* fields to update */ },
        create: { /* fields to create */ },
    });

    console.log('   ✅ YOUR_NAME seeded');
}
```

3. Run `npm run db:seed` - **auto-discovered!**

## How Idempotency Works

All seeders use Prisma's `upsert` pattern:
- **Unique Key Match**: Updates the existing record
- **No Match**: Creates a new record
- **Safe to Repeat**: Running seeds multiple times won't duplicate data

## After a Production Database Reset

// turbo-all
1. Set your DATABASE_URL and DIRECT_URL environment variables
2. Push schema: `npx prisma db push`
3. Restore everything: `npm run db:seed && npm run db:embeddings`

Or use the one-liner (if starting fresh):
```bash
npm run db:reset
```

## Troubleshooting

**Error: "Database connection failed"**
- Check `DATABASE_URL` and `DIRECT_URL` in `.env`
- Ensure Neon database is active (not sleeping)

**Error: "Only URLs with scheme file:// supported"**
- This is a Windows ESM issue. Make sure you're using the latest `tsx`.

**RAG not working after reset**
- Run `npm run embed-site` to regenerate site embeddings

**Navigation/goTo not working**
- Run `npm run db:sync-nav` to regenerate navigation embeddings
