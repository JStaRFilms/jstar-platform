import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cache for GenAI instance per API key
let genAI: GoogleGenerativeAI | null = null;
let cachedApiKey: string | null = null;

/**
 * Get Google Generative AI instance with database-first API key lookup
 */
async function getGenAI(): Promise<GoogleGenerativeAI> {
    // Try to get API key from database first
    let apiKey: string | null = null;

    try {
        const googleProvider = await prisma.aIProvider.findFirst({
            where: {
                name: { in: ['google', 'gemini'] },
                isEnabled: true,
                apiKey: { not: null },
            },
        });

        if (googleProvider?.apiKey) {
            console.log('[RAG] Using Google API key from database');
            apiKey = googleProvider.apiKey;
        }
    } catch (error) {
        console.warn('[RAG] Database lookup failed, falling back to env:', error);
    }

    // Fall back to env var
    if (!apiKey) {
        apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || null;
        if (apiKey) {
            console.log('[RAG] Using Google API key from environment');
        }
    }

    if (!apiKey) {
        throw new Error('No Google API key found in database or environment variables');
    }

    // Reuse cached instance if same API key
    if (genAI && cachedApiKey === apiKey) {
        return genAI;
    }

    // Create new instance
    genAI = new GoogleGenerativeAI(apiKey);
    cachedApiKey = apiKey;
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
    const ai = await getGenAI();
    const model = ai.getGenerativeModel({ model: 'text-embedding-004' });
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
