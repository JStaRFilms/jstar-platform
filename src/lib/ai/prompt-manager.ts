import { prisma } from '../prisma';

export type ChatContext = 'widget' | 'full-page';

export type PromptOptions = {
    role: string;
    context: ChatContext;
    user?: any; // Type as needed, e.g., WorkOS User or DB User
};

export class PromptManager {
    /**
     * Generates the final system prompt based on the requested role, context, and user details.
     */
    static async getSystemPrompt(options: PromptOptions): Promise<string> {
        const { role, context, user } = options;
        let systemPrompt = '';

        try {
            // 1. Fetch Base Prompt from Persona
            const persona = await prisma.persona.findFirst({
                where: { role: role },
                select: { systemPrompt: true },
            });

            if (persona) {
                systemPrompt = persona.systemPrompt;
            } else {
                console.warn(`[PromptManager] Persona '${role}' not found. Using default.`);
                systemPrompt = `You are JohnGPT, a creative strategic partner. Prioritize effectiveness and truth.`;
            }
        } catch (error) {
            console.error('[PromptManager] DB Error:', error);
            systemPrompt = `You are JohnGPT, a creative strategic partner. Prioritize effectiveness and truth.`;
        }

        // 2. Apply Context-Specific Logic (The "Framework" part)
        // Only apply if we are in the 'Universal' (default) role. 
        // Specialized roles like 'code' or 'roast' usually have their own strict prompts.
        if (role === 'Universal') {
            systemPrompt = this.applyContextModifiers(systemPrompt, context, user);
        }

        return systemPrompt;
    }

    /**
     * Appends context-specific instructions to the base prompt.
     * This is where we can easily add new tiers or contexts in the future.
     */
    private static applyContextModifiers(basePrompt: string, context: ChatContext, user?: any): string {
        let modifier = '';

        // Determine User Tier (Default to GUEST if no user)
        // Assuming user object comes from Prisma and has a 'tier' field
        const userTier = user?.tier || 'GUEST';
        const isTier1Plus = userTier === 'TIER1' || userTier === 'TIER2' || userTier === 'TIER3' || userTier === 'ADMIN';

        if (context === 'widget') {
            if (isTier1Plus) {
                // Tier 1+ Widget: 40% Brand, 60% Normal
                modifier = `
\n\nCONTEXT: You are currently operating as a floating widget for a REGISTERED USER (${userTier}).
- Your PRIMARY goal is to be a helpful assistant, but you are NOT restricted to just brand topics.
- You have access to tools to navigate the site and search the knowledge base. Use them if relevant.
- If the user asks about specific people (e.g. "Who is Monjola?"), services, or details, ALWAYS use the searchKnowledge tool first.
- Balance: 40% Brand Focus, 60% General Assistant.
- If the user asks about J StaR, answer thoroughly.
- If the user chats about life, coding, or other topics, engage FREELY and intelligently.
- Be concise in your responses as space is limited.`;
            } else {
                // Guest Widget: 80% Brand, 20% Normal
                modifier = `
\n\nCONTEXT: You are currently operating as a floating widget for a GUEST visitor.
- Your PRIMARY goal is to be a helpful BRAND AMBASSADOR for J StaR.
- You have access to tools to navigate the site and search the knowledge base. USE THEM ACTIVELY.
- If the user asks about specific people (e.g. "Who is Monjola?"), services, or details, ALWAYS use the searchKnowledge tool first.
- Balance: 80% Brand Focus, 20% General Chat.
- If the user asks general questions, answer briefly but try to pivot back to how J StaR can help them (if at all relevant).
- If the user chats about unrelated topics, be polite but keep it brief.
- Be concise in your responses as space is limited.`;
            }
        } else if (context === 'full-page') {
            // Full Page Mode: 5-10% Brand, 90-95% Normal (Same for all tiers for now, but explicitly powerful)
            modifier = `
\n\nCONTEXT: You are currently operating in the full-screen JohnGPT interface.
- You are a powerful, general-purpose AI assistant.
- Balance: 5% Brand Focus, 95% General Assistant.
- Do NOT aggressively push the J StaR brand unless the user specifically asks about it.
- If the user asks about J StaR specific topics (team, services, portfolio), use the searchKnowledge tool.
- Engage deeply with the user's topics, whether it's coding, life, relationships, or creative work.
- You have more space here, so you can provide detailed, comprehensive answers.`;
        }

        return basePrompt + modifier;
    }
}
