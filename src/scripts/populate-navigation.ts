import { PrismaClient, UserTier } from '@prisma/client';
import { generateQueryEmbedding } from '../lib/ai/rag-utils';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// ============================================================================
// CONFIGURATION: Manual Overrides
// ============================================================================
// Add entries here for pages that need custom tiers, descriptions, or titles.
// Pages not listed will use smart defaults (GUEST tier, auto-generated title).
// ============================================================================

interface PageOverride {
  title?: string;
  description?: string;
  requiredTier?: UserTier;
  category?: string;
  keywords?: string[];
  priority?: number;
  skip?: boolean; // Set to true to skip this page entirely
}

const MANUAL_OVERRIDES: Record<string, PageOverride> = {
  // Public pages with custom descriptions
  '/': {
    title: 'Home',
    description: 'The main landing page of J StaR Films. Overview of services, portfolio highlights, and brand introduction. Start here to explore everything we do.',
    keywords: ['home', 'landing', 'start', 'main', 'welcome'],
  },
  '/services': {
    title: 'Services',
    description: 'Detailed information about our video production, creative strategy, post-production, and content creation services.',
    keywords: ['services', 'offerings', 'what we do', 'production', 'editing', 'strategy'],
  },
  '/portfolio': {
    title: 'Portfolio',
    description: 'Showcase of our past projects, films, commercials, music videos, and creative work.',
    keywords: ['work', 'portfolio', 'projects', 'films', 'videos', 'case studies'],
  },
  '/about': {
    title: 'About Us',
    description: 'Learn about the J StaR Films team, our mission, vision, history, and the people behind the brand.',
    keywords: ['about', 'team', 'mission', 'story', 'who we are'],
  },
  '/contact': {
    title: 'Contact',
    description: 'Get in touch with us. Contact form, email address, location information, and how to hire us.',
    keywords: ['contact', 'email', 'reach out', 'message', 'hire'],
  },
  '/store': {
    title: 'Store',
    description: 'Browse our digital products, templates, presets, and free resources for creators.',
    keywords: ['store', 'shop', 'products', 'templates', 'assets', 'buy'],
  },
  '/blog': {
    title: 'Blog',
    description: 'Read our latest articles, tutorials, and insights on filmmaking and content creation.',
    keywords: ['blog', 'articles', 'news', 'tutorials', 'insights'],
  },
  '/john-gpt': {
    title: 'JohnGPT',
    description: 'Full-screen AI assistant for creative strategy, coding help, and general conversation.',
    keywords: ['johngpt', 'chat', 'ai', 'assistant', 'help'],
  },

  // Protected pages (require login)
  '/dashboard': {
    title: 'Dashboard',
    description: 'Personalized dashboard for clients to view project status, files, and updates.',
    requiredTier: 'TIER1',
    category: 'dashboard',
    keywords: ['dashboard', 'my account', 'client area', 'files'],
  },

  // Admin pages
  '/admin': {
    title: 'Admin Panel',
    description: 'Administrative control panel for managing the platform, users, and content.',
    requiredTier: 'ADMIN',
    category: 'admin',
    keywords: ['admin', 'control panel', 'settings', 'management'],
  },

  // Pages to skip (dynamic routes, API routes, etc.)
  '/john-gpt/[conversationId]': { skip: true },
  '/portfolio/[id]': { skip: true },
};

// ============================================================================
// Auto-Discovery Logic
// ============================================================================

function toTitleCase(str: string): string {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function discoverPages(appDir: string): string[] {
  const pages: string[] = [];

  function walk(dir: string, baseRoute: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip route groups (parentheses) and special folders
        if (entry.name.startsWith('(') || entry.name.startsWith('_') || entry.name === 'api') {
          continue;
        }
        walk(fullPath, `${baseRoute}/${entry.name}`);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
        // Found a page!
        const route = baseRoute || '/';
        pages.push(route);
      }
    }
  }

  walk(appDir);
  return pages;
}

async function main() {
  console.log('🚀 Starting navigation auto-discovery...\n');

  // Check connection
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }

  // Discover pages
  const appDir = path.join(process.cwd(), 'src', 'app');
  const discoveredRoutes = discoverPages(appDir);
  console.log(`\n📂 Discovered ${discoveredRoutes.length} pages in src/app\n`);

  let added = 0;
  let skipped = 0;

  for (const route of discoveredRoutes) {
    const override = MANUAL_OVERRIDES[route] || {};

    // Skip if marked
    if (override.skip) {
      console.log(`⏭️  Skipping ${route} (marked as skip)`);
      skipped++;
      continue;
    }

    // Skip dynamic routes (contains [param])
    if (route.includes('[')) {
      console.log(`⏭️  Skipping ${route} (dynamic route)`);
      skipped++;
      continue;
    }

    // Build page config with smart defaults
    const baseName = route === '/' ? 'home' : path.basename(route);
    const page = {
      url: route,
      title: override.title || toTitleCase(baseName),
      description: override.description || `The ${toTitleCase(baseName)} page of J StaR Films.`,
      category: override.category || (route.startsWith('/admin') ? 'admin' : 'public'),
      requiredTier: override.requiredTier || 'GUEST',
      keywords: override.keywords || [baseName],
      priority: override.priority || 0,
    };

    process.stdout.write(`📝 Processing ${route}... `);

    try {
      // Generate embedding
      const textToEmbed = `${page.title}: ${page.description} Keywords: ${page.keywords.join(', ')}`;
      const embedding = await generateQueryEmbedding(textToEmbed);
      const embeddingString = `[${embedding.join(',')}]`;

      // Upsert
      await prisma.$executeRaw`
        INSERT INTO "page_navigation" (id, url, title, description, category, "requiredTier", "isActive", priority, embedding, metadata, "updated_at", "created_at")
        VALUES (
          ${randomUUID()},
          ${page.url},
          ${page.title},
          ${page.description},
          ${page.category},
          ${page.requiredTier}::"UserTier",
          true,
          ${page.priority},
          ${embeddingString}::vector,
          ${JSON.stringify({ keywords: page.keywords })}::jsonb,
          NOW(),
          NOW()
        )
        ON CONFLICT (url) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          "requiredTier" = EXCLUDED."requiredTier",
          priority = EXCLUDED.priority,
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata,
          "updated_at" = NOW();
      `;

      console.log('✅');
      added++;
    } catch (error) {
      console.log('❌');
      console.error(`   Error: ${error}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Navigation sync complete!`);
  console.log(`   📝 Processed: ${added}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
