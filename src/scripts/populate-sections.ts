import { PrismaClient } from '@prisma/client';
import { generateQueryEmbedding } from '../lib/ai/rag-utils';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// ============================================================================
// CONFIGURATION: Section Override Definitions
// ============================================================================
// Define metadata for sections that need custom descriptions or keywords.
// Sections not listed will use auto-generated defaults from the ID.
// ============================================================================

interface SectionOverride {
    title?: string;
    description?: string;
    keywords?: string[];
    order?: number;
    skip?: boolean; // Set to true to skip this section
}

// Map: pageUrl -> { sectionId -> override }
const SECTION_OVERRIDES: Record<string, Record<string, SectionOverride>> = {
    '/': {
        // Homepage sections
        'hero-section': {
            title: 'Hero',
            description: 'Main banner showcasing J StaR Films creative services and brand introduction',
            keywords: ['hero', 'banner', 'intro', 'welcome', 'main'],
            order: 1,
        },
        'services-section': {
            title: 'Services',
            description: 'Overview of video production, web development, and creative services offered by J StaR Films',
            keywords: ['services', 'offerings', 'what we do', 'video', 'web', 'production'],
            order: 2,
        },
        'portfolio-section': {
            title: 'Portfolio',
            description: 'Showcase of past projects, films, commercials, and creative work samples',
            keywords: ['portfolio', 'work', 'projects', 'samples', 'showcase'],
            order: 3,
        },
        'testimonials-section': {
            title: 'Testimonials',
            description: 'Client reviews, feedback, and success stories from past projects',
            keywords: ['testimonials', 'reviews', 'feedback', 'clients', 'stories'],
            order: 4,
        },
        'pricing-section': {
            title: 'Pricing',
            description: 'Pricing packages and plans for video production and web development services',
            keywords: ['pricing', 'cost', 'packages', 'rates', 'plans', 'fees'],
            order: 5,
        },
        'process-section': {
            title: 'Process',
            description: 'Our creative workflow and project execution process from start to finish',
            keywords: ['process', 'workflow', 'how we work', 'steps', 'methodology'],
            order: 6,
        },
        'about-section': {
            title: 'About',
            description: 'About J StaR Films, the team, mission, and company background',
            keywords: ['about', 'team', 'mission', 'who we are', 'background'],
            order: 7,
        },
        'contact-section': {
            title: 'Contact',
            description: 'Contact form and information to get in touch with J StaR Films',
            keywords: ['contact', 'reach out', 'message', 'email', 'get in touch'],
            order: 8,
        },
    },
    // Add other pages as needed
    '/services': {
        // Example: If /services page has sections
    },
    '/about': {
        // Example: If /about page has sections
    },
};

// ============================================================================
// File-to-Page Mapping
// ============================================================================
// Maps source file directories to their corresponding page URLs
// ============================================================================

const FILE_PATH_TO_PAGE: Record<string, string> = {
    'features/HomePage/components': '/',
    'features/ServicesPage/components': '/services',
    'features/AboutPage/components': '/about',
    'features/ContactPage/components': '/contact',
    'features/PortfolioPage/components': '/portfolio',
};

function getPageUrlFromFilePath(filePath: string): string | null {
    for (const [pattern, url] of Object.entries(FILE_PATH_TO_PAGE)) {
        if (filePath.includes(pattern.replace(/\//g, path.sep))) {
            return url;
        }
    }
    return null;
}

// ============================================================================
// Section Discovery Logic
// ============================================================================

interface DiscoveredSection {
    elementId: string;
    filePath: string;
    pageUrl: string;
}

function discoverSections(srcDir: string): DiscoveredSection[] {
    const sections: DiscoveredSection[] = [];

    // Regex pattern to find: id="xxx-section" in TSX files
    const sectionIdPattern = /id=["']([a-z0-9-]+-section)["']/gi;

    function walk(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip node_modules, .next, etc.
                if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                    continue;
                }
                walk(fullPath);
            } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
                // Read file and scan for section IDs
                const content = fs.readFileSync(fullPath, 'utf8');
                let match;

                while ((match = sectionIdPattern.exec(content)) !== null) {
                    const elementId = match[1];
                    const pageUrl = getPageUrlFromFilePath(fullPath);

                    if (pageUrl) {
                        sections.push({
                            elementId,
                            filePath: fullPath,
                            pageUrl,
                        });
                    }
                }

                // Reset regex lastIndex for next file
                sectionIdPattern.lastIndex = 0;
            }
        }
    }

    walk(srcDir);
    return sections;
}

// ============================================================================
// Main Script
// ============================================================================

async function main() {
    console.log('🚀 Starting section auto-discovery...\n');

    // Check connection
    try {
        await prisma.$connect();
        console.log('✅ Connected to database');
    } catch (error) {
        console.error('❌ Failed to connect to database:', error);
        process.exit(1);
    }

    // Discover sections from source files
    const srcDir = path.join(process.cwd(), 'src');
    const discoveredSections = discoverSections(srcDir);
    console.log(`\n📂 Discovered ${discoveredSections.length} sections in source files\n`);

    let added = 0;
    let skipped = 0;

    for (const section of discoveredSections) {
        const { elementId, pageUrl } = section;

        // Get override config if exists
        const pageOverrides = SECTION_OVERRIDES[pageUrl] || {};
        const override = pageOverrides[elementId] || {};

        // Skip if marked
        if (override.skip) {
            console.log(`⏭️  Skipping ${elementId} (marked as skip)`);
            skipped++;
            continue;
        }

        // Find the parent page in page_navigation
        const parentPage = await prisma.pageNavigation.findUnique({
            where: { url: pageUrl },
        });

        if (!parentPage) {
            console.log(`⚠️  Skipping ${elementId} - parent page "${pageUrl}" not found in page_navigation`);
            skipped++;
            continue;
        }

        // Build section config with smart defaults
        const baseName = elementId.replace('-section', '');
        const sectionData = {
            pageId: parentPage.id,
            elementId,
            title: override.title || toTitleCase(baseName),
            description: override.description || `The ${toTitleCase(baseName)} section of the ${parentPage.title} page.`,
            order: override.order || 0,
            metadata: override.keywords ? { keywords: override.keywords } : null,
        };

        process.stdout.write(`📝 Processing ${pageUrl} → ${elementId}... `);

        try {
            // Generate embedding
            const textToEmbed = `${sectionData.title}: ${sectionData.description} ${override.keywords?.join(', ') || ''}`;
            const embedding = await generateQueryEmbedding(textToEmbed);
            const embeddingString = `[${embedding.join(',')}]`;

            // Upsert
            await prisma.$executeRaw`
        INSERT INTO "page_sections" (id, page_id, element_id, title, description, "order", embedding, metadata, "isActive", updated_at, created_at)
        VALUES (
          ${randomUUID()},
          ${sectionData.pageId},
          ${sectionData.elementId},
          ${sectionData.title},
          ${sectionData.description},
          ${sectionData.order},
          ${embeddingString}::vector,
          ${sectionData.metadata ? JSON.stringify(sectionData.metadata) : null}::jsonb,
          true,
          NOW(),
          NOW()
        )
        ON CONFLICT (page_id, element_id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          "order" = EXCLUDED."order",
          embedding = EXCLUDED.embedding,
          metadata = EXCLUDED.metadata,
          updated_at = NOW();
      `;

            console.log('✅');
            added++;
        } catch (error) {
            console.log('❌');
            console.error(`   Error: ${error}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✨ Section sync complete!`);
    console.log(`   📝 Processed: ${added}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log('='.repeat(50));
}

function toTitleCase(str: string): string {
    return str
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
