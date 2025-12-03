import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

/**
 * POST /api/conversations/[id]/title
 * 
 * Generate a title for a conversation based on first messages
 * Uses AI (Groq Llama) to create a concise, descriptive title
 */
export async function POST(
    request: NextRequest,
    context: RouteContext
) {
    try {
        // Await params (Next.js 15 requirement)
        const params = await context.params;
        const conversationId = params.id;

        const { user } = await withAuth();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { messages } = body;

        // Require at least 6 messages (3 back-and-forth exchanges)
        if (!messages || messages.length < 6) {
            return NextResponse.json(
                { error: 'At least 6 messages (3 exchanges) required to generate title' },
                { status: 400 }
            );
        }

        // Build conversation context from first few messages
        const conversationContext = messages.slice(0, 6).map((m: any) => {
            if (m.parts) {
                const textPart = m.parts.find((p: any) => p.type === 'text');
                if (textPart && 'text' in textPart) {
                    return `${m.role}: ${textPart.text}`;
                }
            } else if (m.content) {
                return `${m.role}: ${m.content}`;
            }
            return '';
        }).filter(Boolean).join('\n');

        // Generate title using Groq Llama
        const titlePrompt = `Based on this conversation, generate a short, descriptive title (4-6 words max):

${conversationContext}

Requirements:
- Maximum 6 words
- No quotes or special formatting
- Capture the main topic
- Title case

Title:`;

        const groq = createGroq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const { text } = await generateText({
            model: groq('meta-llama/llama-4-scout-17b-16e-instruct'), // Use Llama 3.3 70B
            prompt: titlePrompt,
            temperature: 0.7,
        });

        let title = text.trim();

        // Fallback if generation fails
        if (!title || title.length === 0) {
            // Use first line of conversation as fallback
            const firstLine = conversationContext.split('\n')[0];
            title = firstLine.slice(0, 50);
            if (firstLine.length > 50) title += '...';
        }

        // Clean up title
        title = title.replace(/["']/g, '').trim();

        // Limit length
        if (title.length > 60) {
            title = title.slice(0, 57) + '...';
        }

        return NextResponse.json({
            title,
            conversationId,
        });
    } catch (error) {
        console.error(`[POST /api/conversations/title] Error:`, error);

        // Fallback: use first message text
        try {
            const body = await request.json();
            const { messages } = body;
            const firstUserMessage = messages?.find((m: any) => m.role === 'user');

            let fallbackTitle = 'New Chat';
            if (firstUserMessage?.parts) {
                const textPart = firstUserMessage.parts.find((p: any) => p.type === 'text');
                if (textPart && 'text' in textPart) {
                    fallbackTitle = textPart.text.slice(0, 50);
                    if (textPart.text.length > 50) fallbackTitle += '...';
                }
            }

            return NextResponse.json({ title: fallbackTitle });
        } catch {
            return NextResponse.json(
                { error: 'Failed to generate title' },
                { status: 500 }
            );
        }
    }
}
