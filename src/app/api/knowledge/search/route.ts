import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase, formatSearchResults } from '../../../../lib/ai/rag-utils';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: 'Query parameter is required' },
                { status: 400 }
            );
        }

        const results = await searchKnowledgeBase(query, 5, 0.5);
        const formattedResults = formatSearchResults(results);

        return NextResponse.json({
            results: formattedResults,
            count: results.length,
        });
    } catch (error) {
        console.error('Error searching knowledge base:', error);
        return NextResponse.json(
            { error: 'Failed to search knowledge base' },
            { status: 500 }
        );
    }
}
