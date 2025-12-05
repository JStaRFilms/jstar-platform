import { PrismaClient } from '@prisma/client';
import { generateQueryEmbedding } from './src/lib/ai/rag-utils';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Checking Pages ---');
        const pages = await prisma.pageNavigation.findMany({
            select: { title: true, url: true }
        });
        console.log('Total pages:', pages.length);
        pages.forEach(p => console.log(`- ${p.title} (${p.url})`));

        console.log('\n--- Testing Search ---');
        const query = "store";
        console.log(`Query: "${query}"`);

        const embedding = await generateQueryEmbedding(query);
        const embeddingString = JSON.stringify(embedding);

        const results = await prisma.$queryRaw`
      SELECT title, url, 1 - (embedding <=> ${embeddingString}::vector) as similarity
      FROM page_navigation
      WHERE "isActive" = true
      ORDER BY similarity DESC
      LIMIT 3;
    `;
        console.log('Results:', results);

    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
