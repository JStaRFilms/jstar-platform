import { generateObject } from 'ai';
import { z } from 'zod';
import { getClassifierModel } from '../ai-providers';

export type DetectedIntent = 'code' | 'roast' | 'simplify' | 'bible' | 'Universal';

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

    // 2. Fast heuristic check (optional, but saves tokens)
    const lowerContent = content.toLowerCase();
    if (lowerContent.startsWith('/code')) return 'code';
    if (lowerContent.startsWith('/roast')) return 'roast';
    if (lowerContent.startsWith('/simplify')) return 'simplify';
    if (lowerContent.startsWith('/bible')) return 'bible';

    // 3. AI Classification
    try {
        const { object } = await generateObject({
            model: await getClassifierModel(), // Use specific classifier model (Groq/Qwen) - now async
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
        });

        // Only switch if confidence is high enough, otherwise stick to Universal to avoid jarring switches
        if (object.confidence > 0.6) {
            return object.intent;
        }

        return 'Universal';

    } catch (error) {
        console.error('[IntentClassifier] Error classifying intent:', error);
        return 'Universal';
    }
}
