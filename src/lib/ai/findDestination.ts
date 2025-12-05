import { PrismaClient, UserTier } from '@prisma/client';
import { generateQueryEmbedding } from './rag-utils';

const prisma = new PrismaClient();

export type DestinationType = 'page' | 'section' | 'page_and_section';

export interface DestinationMatch {
    type: DestinationType;
    pageUrl: string;
    pageTitle: string;
    requiredTier: UserTier;
    sectionId?: string;
    sectionTitle?: string;
    similarity: number;
    // For disambiguation - helps AI explain context
    isOnCurrentPage?: boolean;
    alternativeExists?: boolean;
}

interface PageResult {
    id: string;
    url: string;
    title: string;
    requiredTier: UserTier;
    similarity: number;
}

interface SectionResult {
    id: string;
    elementId: string;
    title: string;
    pageUrl: string;
    pageTitle: string;
    requiredTier: UserTier;
    similarity: number;
}

/**
 * Smart destination resolver that searches both pages and sections.
 * Uses context (currentPath) to decide between scroll, navigate, or both.
 * 
 * @param query - Natural language destination query (e.g., "show me pricing")
 * @param currentPath - The page the user is currently viewing
 * @param userTier - User's access tier
 * @returns Best matching destination with smart resolution
 */
export async function findDestination(
    query: string,
    currentPath: string = '/',
    userTier: UserTier = 'GUEST'
): Promise<DestinationMatch | null> {
    try {
        // Generate embedding for the query
        const queryEmbedding = await generateQueryEmbedding(query);
        const embeddingString = JSON.stringify(queryEmbedding);

        // Search pages
        const pageResults = await prisma.$queryRaw<PageResult[]>`
      SELECT 
        id,
        url,
        title,
        "requiredTier",
        1 - (embedding <=> ${embeddingString}::vector) as similarity
      FROM "page_navigation"
      WHERE "isActive" = true
      AND 1 - (embedding <=> ${embeddingString}::vector) > 0.4
      ORDER BY similarity DESC
      LIMIT 3;
    `;

        // Search sections (with page info via join)
        const sectionResults = await prisma.$queryRaw<SectionResult[]>`
      SELECT 
        s.id,
        s.element_id as "elementId",
        s.title,
        p.url as "pageUrl",
        p.title as "pageTitle",
        p."requiredTier",
        1 - (s.embedding <=> ${embeddingString}::vector) as similarity
      FROM "page_sections" s
      JOIN "page_navigation" p ON s.page_id = p.id
      WHERE s."isActive" = true
      AND p."isActive" = true
      AND 1 - (s.embedding <=> ${embeddingString}::vector) > 0.4
      ORDER BY similarity DESC
      LIMIT 3;
    `;

        // Normalize query for keyword detection
        const normalizedQuery = query.toLowerCase();
        const wantsPage = normalizedQuery.includes('page');
        const wantsSection = normalizedQuery.includes('section');

        // Get best matches
        const bestPage = pageResults[0] || null;
        const bestSection = sectionResults[0] || null;

        // No matches at all
        if (!bestPage && !bestSection) {
            return null;
        }

        // Determine the winner with smart logic
        let result: DestinationMatch;

        // Case 1: User explicitly said "page" → prefer page
        if (wantsPage && bestPage) {
            result = {
                type: 'page',
                pageUrl: bestPage.url,
                pageTitle: bestPage.title,
                requiredTier: bestPage.requiredTier,
                similarity: bestPage.similarity,
                alternativeExists: bestSection !== null,
            };
        }
        // Case 2: User explicitly said "section" → prefer section
        else if (wantsSection && bestSection) {
            result = {
                type: bestSection.pageUrl === currentPath ? 'section' : 'page_and_section',
                pageUrl: bestSection.pageUrl,
                pageTitle: bestSection.pageTitle,
                requiredTier: bestSection.requiredTier,
                sectionId: bestSection.elementId,
                sectionTitle: bestSection.title,
                similarity: bestSection.similarity,
                isOnCurrentPage: bestSection.pageUrl === currentPath,
            };
        }
        // Case 3: Section exists on CURRENT page → scroll (faster, better UX)
        else if (bestSection && bestSection.pageUrl === currentPath) {
            result = {
                type: 'section',
                pageUrl: bestSection.pageUrl,
                pageTitle: bestSection.pageTitle,
                requiredTier: bestSection.requiredTier,
                sectionId: bestSection.elementId,
                sectionTitle: bestSection.title,
                similarity: bestSection.similarity,
                isOnCurrentPage: true,
                alternativeExists: bestPage !== null && bestPage.url !== currentPath,
            };
        }
        // Case 4: Compare page vs section similarity
        else if (bestPage && bestSection) {
            // If page has significantly higher similarity, use page
            if (bestPage.similarity > bestSection.similarity + 0.1) {
                result = {
                    type: 'page',
                    pageUrl: bestPage.url,
                    pageTitle: bestPage.title,
                    requiredTier: bestPage.requiredTier,
                    similarity: bestPage.similarity,
                    alternativeExists: true,
                };
            }
            // If section has higher similarity, navigate + scroll
            else {
                result = {
                    type: 'page_and_section',
                    pageUrl: bestSection.pageUrl,
                    pageTitle: bestSection.pageTitle,
                    requiredTier: bestSection.requiredTier,
                    sectionId: bestSection.elementId,
                    sectionTitle: bestSection.title,
                    similarity: bestSection.similarity,
                    isOnCurrentPage: false,
                };
            }
        }
        // Case 5: Only page matched
        else if (bestPage) {
            result = {
                type: 'page',
                pageUrl: bestPage.url,
                pageTitle: bestPage.title,
                requiredTier: bestPage.requiredTier,
                similarity: bestPage.similarity,
            };
        }
        // Case 6: Only section matched
        else {
            result = {
                type: bestSection!.pageUrl === currentPath ? 'section' : 'page_and_section',
                pageUrl: bestSection!.pageUrl,
                pageTitle: bestSection!.pageTitle,
                requiredTier: bestSection!.requiredTier,
                sectionId: bestSection!.elementId,
                sectionTitle: bestSection!.title,
                similarity: bestSection!.similarity,
                isOnCurrentPage: bestSection!.pageUrl === currentPath,
            };
        }

        return result;

    } catch (error) {
        console.error('[findDestination] Error:', error);
        return null;
    }
}
