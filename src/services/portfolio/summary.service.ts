
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { prisma } from '@/lib/prisma';

export async function generateAISummary(
    portfolioItemId: string,
    content: string
): Promise<string> {
    // Use Gemini 1.5 Flash for reliable, fast summarization
    const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: `You are summarizing a video for a portfolio website. 
Create a compelling 2-3 sentence summary that highlights:
- What the video is about
- Key takeaways or skills demonstrated
- Why it's valuable to potential clients/employers

Transcript/Description:
${content}

Write in third person, professional tone. No emojis.`,

    });

    // Store in database
    await prisma.portfolioItem.update({
        where: { id: portfolioItemId },
        data: { aiSummary: text }
    });

    return text;
}
