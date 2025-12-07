import { NextRequest, NextResponse } from 'next/server';
import { generateText, convertToModelMessages } from 'ai';
import { getFastModel } from '@/lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function POST(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Use the fast model for title generation
        const model = await getFastModel();

        // Convert UIMessage[] to ModelMessage[] for generateText
        const modelMessages = convertToModelMessages(messages);

        const { text } = await generateText({
            model,
            system: `You are a helpful assistant that generates concise and relevant titles for chat conversations.
      The title should be a short summary of the user's intent or the main topic.
      Keep it under 50 characters.
      Do not use quotes.
      Do not use "Title:" prefix.
      Just return the title text.`,
            messages: modelMessages,
        });

        return NextResponse.json({ title: text.trim() });
    } catch (error) {
        console.error('Error generating title:', error);
        return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
    }
}
