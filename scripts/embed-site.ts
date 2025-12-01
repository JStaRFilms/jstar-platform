import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

interface PageContent {
    url: string;
    title: string;
    chunks: string[];
}

interface EmbeddingResult {
    pageUrl: string;
    pageTitle: string;
    contentChunk: string;
    embedding: number[];
    metadata: any;
}

/**
 * Crawl the deployed site and extract content from key pages
 */
async function crawlSite(baseUrl: string): Promise<PageContent[]> {
    const pages: PageContent[] = [];

    // Define pages to crawl
    const pagesToCrawl = [
        { path: '/', title: 'Home' },
        { path: '/about', title: 'About' },
        { path: '/portfolio', title: 'Portfolio' },
        { path: '/services', title: 'Services' },
        { path: '/store', title: 'Store' },
        { path: '/contact', title: 'Contact' },
    ];

    console.log(`🕷️  Crawling ${pagesToCrawl.length} pages from ${baseUrl}...`);

    for (const page of pagesToCrawl) {
        const url = `${baseUrl}${page.path}`;
        console.log(`  📄 Fetching: ${url}`);

        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove scripts, styles, nav, footer
            $('script, style, nav, footer, header').remove();

            // Extract main content
            const mainContent = $('main').text() || $('body').text();

            // Clean up whitespace
            const cleaned = mainContent
                .replace(/\s+/g, ' ')
                .trim();

            // Chunk by sentences (smart chunking)
            const chunks = chunkText(cleaned, 500); // ~500 chars per chunk

            pages.push({
                url: page.path,
                title: page.title,
                chunks: chunks.filter(c => c.length > 50), // Filter out tiny chunks
            });

            console.log(`  ✅ Extracted ${chunks.length} chunks from ${page.title}`);
        } catch (error) {
            console.error(`  ❌ Failed to fetch ${url}:`, error);
        }
    }

    return pages;
}

/**
 * Chunk text into smaller pieces (by sentence boundaries)
 */
function chunkText(text: string, maxChunkSize: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

/**
 * Generate embeddings using Google Gemini
 */
async function generateEmbeddings(pages: PageContent[]): Promise<EmbeddingResult[]> {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const results: EmbeddingResult[] = [];

    console.log(`\n🧠 Generating embeddings with Gemini...`);

    let totalChunks = 0;
    for (const page of pages) {
        totalChunks += page.chunks.length;
    }

    let processedChunks = 0;

    for (const page of pages) {
        console.log(`  📖 Processing: ${page.title} (${page.chunks.length} chunks)`);

        for (const chunk of page.chunks) {
            try {
                const result = await model.embedContent(chunk);
                const embedding = result.embedding.values;

                results.push({
                    pageUrl: page.url,
                    pageTitle: page.title,
                    contentChunk: chunk,
                    embedding: Array.from(embedding),
                    metadata: {
                        chunkLength: chunk.length,
                        generatedAt: new Date().toISOString(),
                    },
                });

                processedChunks++;
                process.stdout.write(`\r  Progress: ${processedChunks}/${totalChunks} chunks`);
            } catch (error) {
                console.error(`\n  ❌ Failed to embed chunk:`, error);
            }
        }
    }

    console.log(`\n  ✅ Generated ${results.length} embeddings`);
    return results;
}

/**
 * Store embeddings in Neon database
 */
async function storeEmbeddings(embeddings: EmbeddingResult[]): Promise<void> {
    console.log(`\n💾 Storing embeddings in database...`);

    // Clear existing embeddings
    await prisma.$executeRaw`DELETE FROM site_embeddings`;
    console.log(`  🗑️  Cleared existing embeddings`);

    // Insert new embeddings
    for (const emb of embeddings) {
        await prisma.$executeRaw`
      INSERT INTO site_embeddings (id, page_url, page_title, content_chunk, embedding, metadata, created_at, updated_at)
      VALUES (
        gen_random_uuid()::text,
        ${emb.pageUrl},
        ${emb.pageTitle},
        ${emb.contentChunk},
        ${JSON.stringify(emb.embedding)}::vector,
        ${JSON.stringify(emb.metadata)}::jsonb,
        NOW(),
        NOW()
      )
    `;
    }

    console.log(`  ✅ Stored ${embeddings.length} embeddings in database`);
}

/**
 * Main execution
 */
async function main() {
    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';

    console.log('🚀 JohnGPT Site Embedding Script\n');
    console.log(`Base URL: ${baseUrl}\n`);

    try {
        // Step 1: Crawl site
        const pages = await crawlSite(baseUrl);

        if (pages.length === 0) {
            console.error('❌ No pages found to embed');
            process.exit(1);
        }

        // Step 2: Generate embeddings
        const embeddings = await generateEmbeddings(pages);

        // Step 3: Store in database
        await storeEmbeddings(embeddings);

        console.log('\n✨ Embedding complete!\n');
        console.log(`📊 Summary:`);
        console.log(`   Pages crawled: ${pages.length}`);
        console.log(`   Total chunks: ${embeddings.length}`);
        console.log(`   Storage: ${(JSON.stringify(embeddings).length / 1024).toFixed(2)} KB\n`);
    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
