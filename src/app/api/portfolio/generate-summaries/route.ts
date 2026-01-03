
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getYouTubeTranscript } from '@/services/portfolio/transcript.service';
import { generateAISummary } from '@/services/portfolio/summary.service';

export async function POST(request: NextRequest) {
    // TODO: Add robust authentication (Admin only)
    // For now, this is an internal utility.

    try {
        // 1. Find YouTube items that are missing AI summaries
        const items = await prisma.portfolioItem.findMany({
            where: {
                aiSummary: null,
                platform: 'YOUTUBE'
            },
            take: 10 // Limit batch size to prevent timeouts
        });

        if (items.length === 0) {
            return NextResponse.json({ message: 'No items need summarization.', processed: 0 });
        }

        let processedCount = 0;

        for (const item of items) {
            if (!item.externalId) continue;

            let contentToSummarize = '';

            // Try to get transcript
            const transcript = await getYouTubeTranscript(item.externalId);

            if (transcript) {
                contentToSummarize = transcript;
            } else if (item.description) {
                // Fallback to description if transcript fails
                contentToSummarize = item.description;
            } else {
                // Skip if no content available
                console.warn(`Skipping item ${item.id}: No transcript or description available.`);
                continue;
            }

            // Generate and store summary
            await generateAISummary(item.id, contentToSummarize);
            processedCount++;
        }

        return NextResponse.json({
            success: true,
            processed: processedCount,
            totalCandidates: items.length
        });

    } catch (error) {
        console.error('Error in generate-summaries:', error);
        return NextResponse.json(
            { error: 'Failed to generate summaries', details: (error as Error).message },
            { status: 500 }
        );
    }
}
