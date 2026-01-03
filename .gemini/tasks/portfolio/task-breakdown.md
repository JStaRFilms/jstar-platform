# Portfolio Enhancement - Task Breakdown

## Phase 1: Fix Current Issues
- [ ] 1.1 - Refactor `PortfolioGrid.tsx` to use real data instead of hardcoded items
- [ ] 1.2 - Test homepage and portfolio page data consistency
- [ ] 1.3 - Fix any styling/animation discrepancies

## Phase 2: Database Schema
- [ ] 2.1 - Add `PortfolioItem`, `PortfolioCredit`, `PortfolioSyncLog` models to Prisma
- [ ] 2.2 - Run `pnpm prisma db push`
- [ ] 2.3 - Create `seed-portfolio.ts` to migrate existing `manualProjects`
- [ ] 2.4 - Run `pnpm db:seed`

## Phase 3: Multi-Platform Embeds
- [ ] 3.1 - Create `TikTokEmbed.tsx` component (iframe-based)
- [ ] 3.2 - Create `InstagramEmbed.tsx` component (iframe-based)
- [ ] 3.3 - Create `UniversalPortfolioCard.tsx` (handles all platforms)
- [ ] 3.4 - Implement duplicate detection (YouTube priority > TikTok > Instagram)
- [ ] 3.5 - Add platform badge component

## Phase 4: AI Summarization
- [ ] 4.1 - Install `youtube-transcript` package
- [ ] 4.2 - Create `transcript.service.ts` for YouTube transcripts
- [ ] 4.3 - Create `summary.service.ts` using Gemini Flash
- [ ] 4.4 - Create `/api/portfolio/generate-summaries` admin route
- [ ] 4.5 - Store AI summaries in database (`aiSummary` field)

## Phase 5: Integration & Polish
- [ ] 5.1 - Create unified `/api/portfolio` route
- [ ] 5.2 - Update all components to use database
- [ ] 5.3 - Add loading states and error handling
- [ ] 5.4 - Add caching layer
- [ ] 5.5 - Final testing

---

## User Tasks
- [ ] Curate TikTok video URLs to feature
- [ ] Curate Instagram post URLs to feature
- [ ] Review AI-generated summaries after generation
- [ ] Decide on YouTube playlist (existing vs. new "Featured" playlist)
