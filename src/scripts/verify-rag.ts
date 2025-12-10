import { searchKnowledgeBase } from '../lib/ai/rag-utils';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Verifying RAG System...\n');

    try {
        // 1. Check if embeddings exist
        const countResult = await prisma.$queryRaw<{ count: string }[]>`SELECT count(*) FROM site_embeddings`;

        // Safely extract count with proper error handling
        const embeddingsCount = countResult.length > 0 && countResult[0]?.count
            ? Number(countResult[0].count)
            : 0;

        console.log(`📊 Total Embeddings in DB: ${embeddingsCount}`);

        if (embeddingsCount === 0) {
            console.warn('⚠️  No embeddings found! You might need to run "npm run embed-site" first.');
            return;
        }

        // 2. Run a test search
        const query = "justina";
        console.log(`\n🔎 Testing Search Query: "${query}"`);

        const results = await searchKnowledgeBase(query, 5, 0.1);

        if (results.length > 0) {
            console.log(`✅ Found ${results.length} results:\n`);
            results.forEach((r, i) => {
                console.log(`[${i + 1}] ${r.pageTitle} (${r.pageUrl})`);
                console.log(`    Similarity: ${(r.similarity * 100).toFixed(2)}%`);
                console.log(`    Snippet: ${r.content.substring(0, 100)}...\n`);
            });
        } else {
            console.warn('⚠️  No results found for the query.');
        }

    } catch (error) {
        console.error('❌ Error verifying RAG:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
