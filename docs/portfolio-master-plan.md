# Portfolio Enhancement Master Plan

**Project:** JStaR Platform - Multi-Platform Portfolio System  
**Date:** January 3, 2026  
**Version:** 2.0 (Unified)

---

## Executive Summary

This is the **unified master plan** for enhancing the portfolio system to support multi-platform content (YouTube, TikTok, Instagram) with AI-generated summaries stored in the database.

### Key Decisions (From User Feedback)

| Decision | Approach |
|----------|----------|
| **Instagram/TikTok** | Use **iframe embeds** (not API fetching) - simpler, no business account needed |
| **YouTube** | Keep existing API integration, add AI summarization |
| **Priority Order** | YouTube → TikTok → Instagram (for duplicate content) |
| **AI Summaries** | Auto-generate with Gemini Flash, store in database |
| **Duplicate Content** | Detect cross-platform duplicates, show YouTube version |
| **Build Tool** | `pnpm` (not npm) |

---

## Current State Analysis

### What's Working ✅

| Component | Status |
|-----------|--------|
| `PortfolioSection.tsx` | Fetches from YouTube API + manual projects |
| `youtube-playlist` route | Fetches from playlist, caches 1 hour |
| `PortfolioCard.tsx` | YouTube player integration, hover preview |
| `PortfolioModal.tsx` | Split layout, custom controls |

### What's Broken ❌

| Component | Issue |
|-----------|-------|
| `PortfolioGrid.tsx` | **Uses hardcoded fake data** - 6 placeholder projects |
| No database storage | Portfolio data only in memory/API |
| No AI summaries | Descriptions are manual or truncated YouTube descriptions |

---

## Phase 1: Fix Current Issues

### Task 1.1: Connect PortfolioGrid to Real Data

**Problem:** `PortfolioGrid.tsx` has hardcoded `portfolioItems` array with fake projects.

**Solution:** Convert to client component that fetches from the same sources as homepage.

**File:** `src/features/PortfolioPage/components/PortfolioGrid.tsx`

```diff
- const portfolioItems = [
-   { id: 'wedding1', title: 'The Johnson Wedding', ... },
-   // ... 6 hardcoded items
- ];

+ // Fetch from API + manual projects
+ const [portfolioItems, setPortfolioItems] = useState<PortfolioProject[]>([]);
+ 
+ useEffect(() => {
+   const fetchData = async () => {
+     const response = await fetch('/api/portfolio/youtube-playlist');
+     const youtube = response.ok ? await response.json() : { projects: [] };
+     const combined = [...manualProjects, ...youtube.projects];
+     setPortfolioItems(combined);
+   };
+   fetchData();
+ }, []);
```

---

## Phase 2: Database Schema

### Task 2.1: Add Portfolio Models to Prisma

**File:** `prisma/schema.prisma`

Add new models for persistent portfolio storage:

```prisma
// ============================================
// PORTFOLIO SYSTEM
// ============================================

enum PortfolioPlatform {
  YOUTUBE
  TIKTOK
  INSTAGRAM
  MANUAL
}

enum PortfolioCategory {
  VIDEO
  WEB
  BRANDING
  OTHER
}

model PortfolioItem {
  id          String   @id @default(cuid())
  
  // External IDs
  externalId  String?  // Platform-specific ID (YouTube video ID, TikTok ID, etc.)
  platform    PortfolioPlatform
  
  // Content
  title       String
  description String?  @db.Text
  aiSummary   String?  @db.Text  // AI-generated summary
  
  // Media
  thumbnailUrl String?
  mediaUrl     String?  // Direct media URL or embed URL
  embedHtml    String?  @db.Text  // Pre-generated embed HTML for iframes
  
  // Metadata
  category    PortfolioCategory @default(VIDEO)
  tags        String[]
  duration    String?  // "4:32" format
  views       Int?
  publishedAt DateTime?
  
  // Case Study (optional)
  hasDetailedCaseStudy Boolean @default(false)
  challenge   String?  @db.Text
  solution    String?  @db.Text
  results     String?  @db.Text
  liveUrl     String?
  
  // Ordering & Visibility
  displayOrder Int      @default(0)
  isVisible    Boolean  @default(true)
  isPinned     Boolean  @default(false)
  
  // Cross-platform duplicate tracking
  duplicateGroupId String?  // Items with same ID are duplicates
  isPrimaryVersion Boolean @default(true)  // Only show primary version
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  credits     PortfolioCredit[]
  
  @@unique([platform, externalId])
  @@index([platform])
  @@index([category])
  @@index([duplicateGroupId])
}

model PortfolioCredit {
  id            String @id @default(cuid())
  portfolioItem PortfolioItem @relation(fields: [portfolioItemId], references: [id], onDelete: Cascade)
  portfolioItemId String
  
  name     String
  role     String
  linkedin String?
  website  String?
  
  @@index([portfolioItemId])
}

model PortfolioSyncLog {
  id        String   @id @default(cuid())
  platform  PortfolioPlatform
  status    String   // 'success', 'failed', 'partial'
  itemsAdded Int     @default(0)
  itemsUpdated Int   @default(0)
  errorMessage String?
  syncedAt  DateTime @default(now())
}
```

### Task 2.2: Create Seed Data

**File:** `prisma/seed-portfolio.ts`

Migrate existing `manualProjects` from `portfolio.ts` to database.

---

## Phase 3: Multi-Platform Embeds

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Portfolio Display                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   YouTube   │  │   TikTok    │  │  Instagram  │         │
│  │  (API+Embed)│  │  (Embed)    │  │  (Embed)    │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Duplicate Detection                     │   │
│  │  (Group by duplicateGroupId, show isPrimaryVersion)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 PortfolioItem DB                     │   │
│  │  (aiSummary, embedHtml, metadata)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Task 3.1: Embed Components

**File:** `src/components/embeds/TikTokEmbed.tsx`

```tsx
'use client';

interface TikTokEmbedProps {
  videoId: string;
  className?: string;
}

export function TikTokEmbed({ videoId, className }: TikTokEmbedProps) {
  return (
    <iframe
      src={`https://www.tiktok.com/embed/v2/${videoId}`}
      className={className}
      allowFullScreen
      allow="encrypted-media"
      style={{ border: 'none' }}
    />
  );
}
```

**File:** `src/components/embeds/InstagramEmbed.tsx`

```tsx
'use client';

import { useEffect } from 'react';

interface InstagramEmbedProps {
  postUrl: string;
  className?: string;
}

export function InstagramEmbed({ postUrl, className }: InstagramEmbedProps) {
  useEffect(() => {
    // Load Instagram embed script
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [postUrl]);

  return (
    <blockquote
      className={`instagram-media ${className}`}
      data-instgrm-permalink={postUrl}
      data-instgrm-version="14"
    />
  );
}
```

### Task 3.2: Unified Portfolio Card

**File:** `src/features/PortfolioPage/components/UniversalPortfolioCard.tsx`

A card component that handles all platforms:

```tsx
interface UniversalPortfolioCardProps {
  item: PortfolioItem;
  onClick: () => void;
}

export function UniversalPortfolioCard({ item, onClick }: UniversalPortfolioCardProps) {
  const renderPreview = () => {
    switch (item.platform) {
      case 'YOUTUBE':
        return <YouTubePreview videoId={item.externalId} />;
      case 'TIKTOK':
        return <TikTokEmbed videoId={item.externalId} />;
      case 'INSTAGRAM':
        return <InstagramEmbed postUrl={item.mediaUrl} />;
      default:
        return <Image src={item.thumbnailUrl} alt={item.title} />;
    }
  };

  return (
    <div className="portfolio-card" onClick={onClick}>
      {renderPreview()}
      <div className="portfolio-card-content">
        <PlatformBadge platform={item.platform} />
        <h3>{item.title}</h3>
        <p>{item.aiSummary || item.description}</p>
      </div>
    </div>
  );
}
```

### Task 3.3: Duplicate Detection

When adding content, check if the same content exists on another platform:

```typescript
async function addPortfolioItem(item: CreatePortfolioInput) {
  // Check for duplicates by title similarity
  const existing = await prisma.portfolioItem.findFirst({
    where: {
      OR: [
        { title: { contains: item.title.slice(0, 30) } },
        { duplicateGroupId: item.duplicateGroupId }
      ]
    }
  });

  if (existing) {
    // Mark as duplicate, set primary based on priority
    const platform_priority = { YOUTUBE: 1, TIKTOK: 2, INSTAGRAM: 3, MANUAL: 0 };
    const isPrimary = platform_priority[item.platform] < platform_priority[existing.platform];
    
    return prisma.portfolioItem.create({
      data: {
        ...item,
        duplicateGroupId: existing.duplicateGroupId || existing.id,
        isPrimaryVersion: isPrimary
      }
    });
  }

  return prisma.portfolioItem.create({ data: item });
}
```

---

## Phase 4: AI Summarization

### Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   YouTube    │────▶│  Transcript  │────▶│   Gemini     │
│   Video ID   │     │  Extraction  │     │    Flash     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │   aiSummary  │
                                          │   in DB      │
                                          └──────────────┘
```

### Task 4.1: YouTube Transcript Service

**File:** `src/services/portfolio/transcript.service.ts`

```typescript
import { YoutubeTranscript } from 'youtube-transcript';

export async function getYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' ');
  } catch (error) {
    console.error(`Failed to get transcript for ${videoId}:`, error);
    return null;
  }
}
```

### Task 4.2: AI Summary Service

**File:** `src/services/portfolio/summary.service.ts`

```typescript
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import prisma from '@/lib/prisma';

export async function generateAISummary(
  portfolioItemId: string, 
  content: string
): Promise<string> {
  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    prompt: `You are summarizing a video for a portfolio website. 
Create a compelling 2-3 sentence summary that highlights:
- What the video is about
- Key takeaways or skills demonstrated
- Why it's valuable to potential clients/employers

Transcript/Description:
${content}

Write in third person, professional tone. No emojis.`,
    maxTokens: 200
  });

  // Store in database
  await prisma.portfolioItem.update({
    where: { id: portfolioItemId },
    data: { aiSummary: text }
  });

  return text;
}
```

### Task 4.3: Background Processing Endpoint

**File:** `src/app/api/portfolio/generate-summaries/route.ts`

Admin-only endpoint to batch generate summaries:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getYouTubeTranscript } from '@/services/portfolio/transcript.service';
import { generateAISummary } from '@/services/portfolio/summary.service';

export async function POST(request: NextRequest) {
  // Auth check (admin only)
  
  // Get items without summaries
  const items = await prisma.portfolioItem.findMany({
    where: { 
      aiSummary: null,
      platform: 'YOUTUBE'
    },
    take: 10 // Process 10 at a time
  });

  for (const item of items) {
    const transcript = await getYouTubeTranscript(item.externalId!);
    if (transcript) {
      await generateAISummary(item.id, transcript);
    } else if (item.description) {
      // Fallback to description if no transcript
      await generateAISummary(item.id, item.description);
    }
  }

  return NextResponse.json({ processed: items.length });
}
```

---

## Phase 5: Updated API Routes

### Task 5.1: Unified Portfolio API

**File:** `src/app/api/portfolio/route.ts`

Main endpoint that returns all portfolio items:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const platform = searchParams.get('platform');

  const items = await prisma.portfolioItem.findMany({
    where: {
      isVisible: true,
      isPrimaryVersion: true, // Only show primary versions (no duplicates)
      ...(category && { category: category as any }),
      ...(platform && { platform: platform as any })
    },
    include: {
      credits: true
    },
    orderBy: [
      { isPinned: 'desc' },
      { displayOrder: 'asc' },
      { publishedAt: 'desc' }
    ]
  });

  return NextResponse.json({ items });
}
```

---

## Implementation Checklist

### Phase 1: Fix Current Issues (Week 1)
- [ ] Refactor `PortfolioGrid.tsx` to use real data
- [ ] Test homepage and portfolio page consistency
- [ ] Fix any styling/animation issues

### Phase 2: Database Schema (Week 1)
- [ ] Add Prisma models to `schema.prisma`
- [ ] Run `pnpm prisma db push`
- [ ] Create `seed-portfolio.ts` to migrate manual projects
- [ ] Run `pnpm db:seed`

### Phase 3: Multi-Platform Embeds (Week 2)
- [ ] Create `TikTokEmbed.tsx` component
- [ ] Create `InstagramEmbed.tsx` component
- [ ] Create `UniversalPortfolioCard.tsx`
- [ ] Implement duplicate detection logic
- [ ] Add platform badge component

### Phase 4: AI Summarization (Week 2-3)
- [ ] Install `youtube-transcript` package
- [ ] Create `transcript.service.ts`
- [ ] Create `summary.service.ts`
- [ ] Create `/api/portfolio/generate-summaries` route
- [ ] Add admin UI for triggering summary generation

### Phase 5: Integration & Polish (Week 3)
- [ ] Create unified `/api/portfolio` route
- [ ] Update all components to use database
- [ ] Add loading states and error handling
- [ ] Add caching layer (Redis or in-memory)

---

## Your Part

| Task | Notes |
|------|-------|
| **Curate TikTok content** | Provide video URLs you want to feature |
| **Curate Instagram content** | Provide post URLs you want to feature |
| **Review AI summaries** | After generation, review and tweak if needed |
| **YouTube playlist** | Continue using existing playlist, or create a new "Featured" playlist |

---

## Verification Plan

### Automated Tests
```bash
pnpm run build          # Build passes
pnpm prisma db push     # Schema applies correctly
pnpm db:seed            # Seed data works
```

### Manual Verification
1. Navigate to `/portfolio` - real projects appear
2. Filter by category - works correctly
3. Click card - modal/preview opens
4. Check AI summary displays in modal
5. Verify YouTube priority for duplicates
6. Test TikTok/Instagram embeds render
7. Homepage portfolio section unchanged

---

## Dependencies to Install

```bash
pnpm add youtube-transcript
```

---

## Files to Create/Modify Summary

| Action | File |
|--------|------|
| MODIFY | `prisma/schema.prisma` - Add portfolio models |
| NEW | `prisma/seed-portfolio.ts` - Seed existing projects |
| MODIFY | `src/features/PortfolioPage/components/PortfolioGrid.tsx` - Use real data |
| NEW | `src/components/embeds/TikTokEmbed.tsx` |
| NEW | `src/components/embeds/InstagramEmbed.tsx` |
| NEW | `src/features/PortfolioPage/components/UniversalPortfolioCard.tsx` |
| NEW | `src/services/portfolio/transcript.service.ts` |
| NEW | `src/services/portfolio/summary.service.ts` |
| NEW | `src/app/api/portfolio/route.ts` - Unified portfolio API |
| NEW | `src/app/api/portfolio/generate-summaries/route.ts` |
