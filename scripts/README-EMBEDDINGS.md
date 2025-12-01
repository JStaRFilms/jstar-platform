# RAG Knowledge Base Setup

This guide explains how to populate JohnGPT's knowledge base with site content.

## Prerequisites

- ✅ Google AI API key (Gemini) set in `.env` as `GOOGLE_GENERATIVE_AI_API_KEY`
- ✅ Neon database with `pgvector` extension enabled
- ✅ Dependencies installed (`npm install`)

## Step 1: Update Database Schema

### ⚠️ Important: Development Database Safety

If you see a "drift detected" error, **DON'T run `prisma migrate reset`** - it will delete all your data!

**Use this safer approach instead:**

```bash
# This adds the new table WITHOUT deleting existing data
npx prisma db push

# Then generate the Prisma client
npx prisma generate
```

### Why This Happens

- **Drift** = Your database has tables created via `prisma db push` instead of migrations
- This is **normal in development**
- `prisma db push` is actually easier for solo projects
- Migrations are more important for team projects and production

### Alternative: Migrations (If You Want)

If you prefer formal migrations:

```bash
npx prisma migrate dev --name add_site_embeddings
```

**Note**: This may require resetting your dev database (losing data). Only use if you're comfortable with that.

## Step 2: Run the Embedding Script

The embedding script will:
1. Crawl your site pages
2. Chunk the content
3. Generate embeddings via Gemini
4. Store in Neon database

### Option A: Crawl Deployed Site (Recommended)

**Windows PowerShell:**
```powershell
$env:SITE_URL="https://your-site.com"; npm run embed-site
```

**macOS/Linux:**
```bash
SITE_URL=https://your-site.com npm run embed-site
```

### Option B: Crawl Local Development Server

```bash
# Start your dev server first
npm run dev

# Then in another terminal:
```

**Windows PowerShell:**
```powershell
$env:SITE_URL="http://localhost:5782"; npm run embed-site
```

**macOS/Linux:**
```bash
SITE_URL=http://localhost:5782 npm run embed-site
```

### What It Does

- Crawls 6 key pages (Home, About, Portfolio, Services, Store, Contact)
- Generates ~10-50 embeddings per page (depending on content)
- Uses Gemini embedding model (`text-embedding-004`) - FREE tier
- Stores in Neon with pgvector for fast similarity search

## Step 3: Test It

Ask JohnGPT a question:
- "What services do you offer?"
- "Tell me about your video production work"
- "What are your rates?"

JohnGPT will automatically search the knowledge base and answer using actual site content!

## Re-Running the Script

Run the script whenever you update site content:

```bash
npm run embed-site
```

The script clears old embeddings and re-indexes everything.

## Costs

**Embedding**: FREE (Gemini free tier: 1,500 requests/day)
**Storage**: FREE (well within Neon free tier: 512MB)

For a personal site, expect:
- ~200 embeddings total
- ~1-2 MB storage
- Re-run monthly or after major content updates

## Troubleshooting

### "pgvector extension not found"
Enable pgvector in your Neon database:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### "Cannot find module '@google/generative-ai'"
Install dependencies:
```bash
npm install
```

### "Rate limit exceeded"
You've hit Gemini's free tier limit (1,500/day). Wait 24 hours or upgrade to paid tier.
