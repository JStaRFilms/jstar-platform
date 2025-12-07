import { generateObject } from 'ai';
import { z } from 'zod';
import { getClassifierModel } from '../ai-providers';

export type DetectedIntent = 'code' | 'roast' | 'simplify' | 'bible' | 'Universal';

// Keywords that suggest specific intents without needing AI
const INTENT_KEYWORDS: Record<DetectedIntent, string[]> = {
    code: ['code', 'debug', 'programming', 'javascript', 'typescript', 'python', 'function', 'api', 'bug', 'error', 'syntax'],
    roast: ['roast', 'roast me', 'mock me', 'critique'],
    simplify: ['eli5', 'explain like', 'simple terms', 'simplify', 'break down', 'dumb it down'],
    bible: ['bible', 'scripture', 'biblical', 'verse', 'god says', 'jesus', 'proverbs', 'psalm', 'spiritual'],
    Universal: [],
};

export async function classifyIntent(messages: any[]): Promise<DetectedIntent> {
    // 1. Get the last 3 messages for better context
    const recentMessages = messages.slice(-3);

    const content = recentMessages.map((m: any) => {
        const role = m.role === 'user' ? 'User' : 'AI';
        const text = typeof m.content === 'string'
            ? m.content
            : Array.isArray(m.content)
                ? m.content.map((c: any) => c.text || '').join(' ')
                : '';
        return `${role}: ${text}`;
    }).join('\n');

    // 2. Fast heuristic: Check for slash commands first
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('/code')) return 'code';
    if (lowerContent.includes('/roast')) return 'roast';
    if (lowerContent.includes('/simplify')) return 'simplify';
    if (lowerContent.includes('/bible')) return 'bible';

    // 3. Fast heuristic: Keyword matching (skips AI call entirely!)
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
        if (intent === 'Universal') continue;
        for (const keyword of keywords) {
            if (lowerContent.includes(keyword)) {
                console.log(`[IntentClassifier] Matched keyword "${keyword}" → ${intent}`);
                return intent as DetectedIntent;
            }
        }
    }

    // 4. For short messages (greetings, simple questions), skip AI call
    const lastUserMessage = recentMessages.filter((m: any) => m.role === 'user').pop();
    const lastUserText = typeof lastUserMessage?.content === 'string'
        ? lastUserMessage.content
        : '';
    if (lastUserText.length < 20) {
        console.log('[IntentClassifier] Short message, skipping AI classification');
        return 'Universal';
    }

    // 5. AI Classification (only for complex messages)
    try {
        const { object } = await generateObject({
            model: await getClassifierModel(),
            mode: 'json',
            schema: z.object({
                intent: z.enum(['code', 'roast', 'simplify', 'bible', 'Universal']),
                confidence: z.number().describe('Confidence score between 0 and 1'),
            }),
            prompt: `
            Analyze the recent conversation history and determine the most appropriate "mode" or persona for the AI to adopt for the NEXT response.
            
            Modes:
            - 'code': User is asking for code, debugging, technical explanation, or software architecture.
            - 'roast': User specifically asks to be roasted, mocked, or critiqued humorously.
            - 'simplify': User asks for a simple explanation, ELI5, or to break down a complex topic.
            - 'bible': User asks for biblical advice, scripture, theological perspective, or spiritual guidance.
            - 'Universal': Default mode. General conversation, questions about the brand (J StaR), greetings, or anything that doesn't fit the above strictly.
            
            Conversation History:
            ${content}
            
            Select the best fit for the AI's NEXT response. If unsure, choose 'Universal'.
            `,
            maxRetries: 1, // Reduce retries to avoid burning quota
        });

        // Only switch if confidence is high enough
        if (object.confidence > 0.6) {
            return object.intent;
        }

        return 'Universal';

    } catch (error) {
        console.error('[IntentClassifier] Error classifying intent:', error);
        return 'Universal';
    }
}
