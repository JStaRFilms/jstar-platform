import { PrismaClient, UserTier } from '@prisma/client';
import { generateQueryEmbedding } from './rag-utils';

const prisma = new PrismaClient();

export interface PageMatch {
    url: string;
    title: string;
    description: string;
    requiredTier: UserTier;
    category: string;
    similarity: number;
}

/**
 * Find the best matching page for a natural language query
 * Uses vector similarity search on the page_navigation table
 */
export async function findPage(
    query: string,
    // The tier argument remains accepted; matches are not filtered by tier.
    ...[, limit = 3]: [userTier?: UserTier, limit?: number]
): Promise<PageMatch[]> {
    try {
        // Generate embedding for the query
        const queryEmbedding = await generateQueryEmbedding(query);
        const embeddingString = JSON.stringify(queryEmbedding);

        // Search for similar pages
        // We filter by isActive=true
        // We use a similarity threshold of 0.5 to ensure relevance
        const results = await prisma.$queryRaw<PageMatch[]>`
      SELECT 
        url,
        title,
        description,
        "requiredTier",
        category,
        1 - (embedding <=> ${embeddingString}::vector) as similarity
      FROM "page_navigation"
      WHERE "isActive" = true
      AND 1 - (embedding <=> ${embeddingString}::vector) > 0.5
      ORDER BY similarity DESC, priority DESC
      LIMIT ${limit};
    `;

        return results;
    } catch (error) {
        console.error('Error finding page:', error);
        // Return empty array on error to allow graceful degradation
        return [];
    }
}
