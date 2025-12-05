import { prisma } from '../prisma';

// Define a concrete type for User
interface UserProfile {
    tier?: 'GUEST' | 'TIER1' | 'TIER2' | 'TIER3' | 'ADMIN';
    name?: string | null;
    [key: string]: any;
}

export type ChatContext = 'widget' | 'full-page';

export type PromptOptions = {
    role: string; // 'Universal', 'Coder', 'Creative', etc.
    context: ChatContext;
    user?: UserProfile | null;
};

// THE POWERFUL UNIVERSAL PROMPT (As the default fallback)
const UNIVERSAL_CORE_IDENTITY = `
# CORE IDENTITY
You are JohnGPT, the intelligent interface for the J StaR Platform.
You act as a "Creative Operating System"—a strategic partner for filmmakers, developers, and creators.

# CORE OPERATING PRINCIPLES
1. **Objective Truth:** Separate facts from emotions. Do not sugarcoat things. If a user's premise is flawed, correct it politely but firmly.
2. **Ruthless Proactivity:** If the user asks for X, but Y is standard/better, mention Y immediately.
3. **Faith-Grounded Pragmatism:** Your advice reflects values of integrity and wisdom, but you do not preach unless asked.
4. **No Fluff:** Start directly with the answer. Do not say "That's a great question."

# BEHAVIORAL MODES (Auto-Switching)
- **Normal Mode:** If the chat is casual (jokes, life, "hello"), be a normal, witty human. Do not lecture about business.
- **Pro Mode:** If the chat is technical (Code, Strategy), be an Expert Consultant. High competence, low latency.
`;

export class PromptManager {
    /**
     * Generates the final system prompt by assembling structured blocks.
     */
    static async getSystemPrompt(options: PromptOptions): Promise<string> {
        const { role, context, user } = options;

        // 1. Fetch Identity (Who am I?)
        let baseIdentity = '';
        try {
            const persona = await prisma.persona.findFirst({
                where: { role: role },
                select: { systemPrompt: true },
            });
            // If DB has a custom prompt, use it. Otherwise, use the Universal Core.
            baseIdentity = persona?.systemPrompt || UNIVERSAL_CORE_IDENTITY;
        } catch (error) {
            console.error('[PromptManager] DB Error:', error);
            baseIdentity = UNIVERSAL_CORE_IDENTITY;
        }

        // If strictly a specialized role (like 'coder') requested via slash command, return just the base to avoid noise.
        // But for 'Universal' (default), we want all the context wrapper.
        if (role !== 'Universal') {
            return baseIdentity;
        }

        // 2. Build the Structured Prompt
        const promptParts = [
            `<identity>\n${baseIdentity}\n</identity>`,
            this.getUserContextBlock(user),
            this.getEnvironmentBlock(context, user),
            this.getToolingRules(context)
        ];

        return promptParts.join('\n\n');
    }

    /**
     * Defines who the user is.
     */
    private static getUserContextBlock(user?: UserProfile | null): string {
        const tier = user?.tier || 'GUEST';
        return `
<user_profile>
  <tier>${tier}</tier>
  <name>${user?.name || 'Visitor'}</name>
</user_profile>`;
    }

    /**
     * Defines the environment (Widget vs Full Page) and behavioral "temperature".
     */
    private static getEnvironmentBlock(context: ChatContext, user?: UserProfile | null): string {
        const tier = user?.tier || 'GUEST';
        const isVIP = ['TIER1', 'TIER2', 'TIER3', 'ADMIN'].includes(tier);

        // FULL PAGE EXPERIENCE (Always powerful)
        if (context === 'full-page') {
            return `
<environment_context>
  Current View: Full-Page Interface.
  Role: Powerful General-Purpose Assistant.
  Directives:
  - Engage deeply with ANY topic (coding, life, relationships, creative work).
  - Provide detailed, comprehensive answers.
  - Do NOT pivot to J StaR brand topics unless explicitly asked.
</environment_context>`;
        }

        // WIDGET - VIP USER (Treat like full page, but shorter)
        if (isVIP) {
            return `
<environment_context>
  Current View: Floating Widget (VIP User).
  Role: Helpful Assistant.
  Directives:
  - Be concise due to limited screen space.
  - Discuss general topics freely (no brand restrictions).
</environment_context>`;
        }

        // WIDGET - GUEST (Brand Ambassador)
        // Note: I softened the "Pivot" rule so it doesn't annoy people asking for jokes.
        return `
<environment_context>
  Current View: Floating Widget (Guest).
  Role: Brand Ambassador for J StaR.
  Directives:
  - Be helpful and welcoming.
  - If the user asks about J StaR, sell the vision.
  - If the user asks general questions (e.g., "Tell me a joke"), answer briefly and friendly. Do NOT aggressively pivot back to business.
</environment_context>`;
    }

    /**
     * Specific rules for Tool Usage.
     */
    private static getToolingRules(context: ChatContext): string {
        return `
<tool_guidelines>
  1. SEARCH_KNOWLEDGE:
     - TRIGGER: Questions about J StaR PRICING, J StaR SERVICES, or John's PORTFOLIO.
     - FORBIDDEN: DO NOT search the database for jokes, general life advice, coding questions, or generic small talk.
     - BEHAVIOR: If asked for a joke, just tell a joke from your internal training. Do not search.
     - Action: query("search query").

  2. NAVIGATE_TOOL:
     - TRIGGER: Explicit user intent to change view (e.g., "Go to X", "Show me the store").
     - CRITICAL RULE: You MUST call the \`Maps\` tool if you say you are taking them somewhere.
     - Action: navigate({ path: "target" }).
</tool_guidelines>`;
    }
}