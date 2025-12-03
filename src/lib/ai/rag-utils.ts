import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lazy initialization to ensure env vars are loaded
let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
    if (!genAI) {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables');
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

interface SearchResult {
    pageUrl: string;
    pageTitle: string;
    content: string;
    similarity: number;
}

/**
 * Generate embedding for a query using Gemini
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
    const model = getGenAI().getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(query);
    return Array.from(result.embedding.values);
}

/**
 * Search site embeddings for content similar to the query
 * Uses cosine similarity via pgvector
 */
export async function searchKnowledgeBase(
    query: string,
    limit: number = 5,
    similarityThreshold: number = 0.3
): Promise<SearchResult[]> {
    try {
        // Generate embedding for the query
        const queryEmbedding = await generateQueryEmbedding(query);
        const embeddingString = JSON.stringify(queryEmbedding);

        // Search for similar content using cosine similarity
        const results = await prisma.$queryRaw<SearchResult[]>`
      SELECT 
        page_url as "pageUrl",
        page_title as "pageTitle",
        content_chunk as content,
        1 - (embedding <=> ${embeddingString}::vector) as similarity
      FROM site_embeddings
      WHERE 1 - (embedding <=> ${embeddingString}::vector) > ${similarityThreshold}
      ORDER BY embedding <=> ${embeddingString}::vector
      LIMIT ${limit}
    `;

        return results;
    } catch (error) {
        console.error('Error searching knowledge base:', error);
        throw error;
    }
}

/**
 * Format search results for AI context
 */
export function formatSearchResults(results: SearchResult[]): string {
    if (results.length === 0) {
        return 'No relevant information found in knowledge base.';
    }

    return results
        .map((result, index) => {
            return `[${index + 1}] ${result.pageTitle} (${result.pageUrl})
${result.content}
Relevance: ${(result.similarity * 100).toFixed(1)}%`;
        })
        .join('\n\n---\n\n');
}
