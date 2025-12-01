// src/app/api/chat/route.ts
/**
 * JohnGPT Chat API Route
 *
 * API endpoint for handling AI-powered chat conversations.
 * Streams responses from configurable AI providers.
 *
 * Access Levels:
 * - GUEST (anonymous): Basic chat access, no history saved
 * - TIER1+ (logged in): Chat with history saved to database
 *
 * Route: POST /api/chat
 * Runtime: Node.js (required for Prisma/SQLite)
 */
import { streamText, tool, stepCountIs } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getRoutesDescription } from '../../../lib/routes-config';
import { searchKnowledgeBase, formatSearchResults } from '../../../lib/ai/rag-utils';

export const runtime = 'nodejs';

// --- SYSTEM PROMPTS ---

const UNIVERSAL_SYSTEM_PROMPT = `
# IDENTITY
You are JohnGPT, the intelligent interface for the J StaR Platform. 
You are a "Creative Operating System"—smart, capable, and versatile.

# CORE BEHAVIOR (READ THIS CAREFULLY)
You must be fluid. Adapt to the user's vibe immediately.

1. **THE "NORMAL HUMAN" MODE (Default):**
   - If the user chats casually, asks for a joke, talks about life, or asks a general question, **just answer normally.** - Be witty, friendly, and direct. 
   - **DO NOT** lecture them about being a business AI. 
   - **DO NOT** try to pivot everything back to work.
   - Example: If asked "Tell me a joke", just tell a funny joke. Don't say "I usually focus on creativity, but..."

2. **THE "PRO" MODE (Context-Aware):**
   - If the user asks about **Code, Strategy, Content Creation, or Business**, switch instantly to High-Performance Consultant mode.
   - **Code:** Act like a Senior Engineer. Modern stack (Next.js, Tailwind, Prisma). Clean code, no fluff.
   - **Content:** Act like a Virality Strategist. Focus on hooks, retention, and value.
   - **J StaR info:** Use the knowledge base to answer questions about John/J StaR services.

3. **GENERAL PRINCIPLES:**
   - **Objective Truth:** Do not sugarcoat things. If an idea is bad, say it's bad, but explain why logically.
   - **Proactivity:** If the user asks for X but Y is better/standard, suggest Y.
   - **Faith-Grounded:** Keep your worldview rooted in wisdom and integrity, but don't be preachy unless the topic calls for it.

# TOOLS & NAVIGATION
- If the user asks to go to a specific page (e.g., "Show me the store", "Go to about page"), use the \`Maps\` tool.
- If the user asks about J StaR's specific pricing, services, or past work, use the \`searchKnowledge\` tool.

# SPECIAL OUTPUT RULES
- **Pre-Mortem:** ONLY run a "Pre-Mortem" (listing failure points) if the user proposes a **complex strategic plan**. Do not do this for simple questions or code requests.
- **Uncertainty:** If you don't know, say "I don't know".
`;

const CODING_PROMPT = `
You are a Senior Software Engineer.
- Stack: Next.js (App Router), TypeScript, Tailwind CSS, Prisma, SQLite/PostgreSQL.
- Style: Clean, functional, modern.
- Output: ONLY code or extremely concise explanations. No fluff. No "Here is the code".
- If a file is requested, provide the full file content.
`;

const ROAST_PROMPT = `
You are a ruthless critic.
- Goal: Find every flaw, logic gap, and potential failure point in the user's idea or work.
- Tone: Harsh but fair. Constructive but painful.
- Format: Bullet points of "Why this will fail".
`;

const SIMPLIFY_PROMPT = `
You are a Master Teacher.
- Goal: Explain complex topics as if the user is 12 years old.
- Use analogies.
- Avoid jargon.
`;

const BIBLE_PROMPT = `
You are a Biblical Counselor and Theologian.
- Source of Truth: The Bible (ESV/NIV).
- Goal: Provide wisdom, comfort, or correction based strictly on scripture.
- Tone: Gentle, firm, wise.
`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;
  console.log('API /api/chat received body:', JSON.stringify(body, null, 2));

  // 🔓 Optional Authentication - Allow anonymous users
  const { user } = await withAuth();

  // If user is authenticated, we can save chat history (future feature)
  if (user) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { workosId: user.id },
      });
      if (dbUser) {
        console.log(`Authenticated user: ${dbUser.email} (${dbUser.tier})`);
      }
    } catch (error) {
      // Gracefully handle database errors - chat can still proceed
      console.warn('[Chat API] Database connection error - continuing without user data:', error);
    }
  } else {
    console.log('Anonymous user accessing JohnGPT');
  }

  // Convert UIMessage[] to CoreMessage[]
  const modelMessages = messages.map((m: any) => {
    const textContent = m.parts
      ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
      : '';

    return {
      role: m.role,
      content: textContent,
    };
  });

  // --- INTELLIGENT ROUTING ---
  // Check the LAST message for slash commands
  const lastMessage = modelMessages[modelMessages.length - 1];
  let systemPrompt = UNIVERSAL_SYSTEM_PROMPT;

  if (lastMessage && lastMessage.role === 'user') {
    const content = lastMessage.content.trim();

    if (content.startsWith('/code')) {
      systemPrompt = CODING_PROMPT;
      // Strip the command from the message so the AI just sees the prompt
      // Optional: keep it if you want the AI to know it was invoked explicitly
    } else if (content.startsWith('/roast')) {
      systemPrompt = ROAST_PROMPT;
    } else if (content.startsWith('/simplify')) {
      systemPrompt = SIMPLIFY_PROMPT;
    } else if (content.startsWith('/bible')) {
      systemPrompt = BIBLE_PROMPT;
    }
  }

  console.log('Using System Prompt Mode:', systemPrompt === UNIVERSAL_SYSTEM_PROMPT ? 'UNIVERSAL' : 'SPECIALIZED');

  // 🌐 Stream response from selected provider
  const result = await streamText({
    model: getAIModel(),
    messages: modelMessages,
    system: systemPrompt,
    stopWhen: stepCountIs(5), // Allow AI to continue after tool execution for up to 5 steps
    tools: {
      navigate: tool({
        description: 'Navigate the user to a specific page. Use this when the user asks to go somewhere or asks about something that is best answered by showing them a specific page (e.g. "pricing" -> /services or /store).',
        inputSchema: z.object({
          path: z.string().describe('The path to navigate to (e.g. /about, /portfolio)'),
          reason: z.string().describe('Short reason for navigation to show to the user'),
        }),
      }),
      searchKnowledge: tool({
        description: 'Search the knowledge base for information about services, portfolio, pricing, past work, or any site content. Use this BEFORE answering questions about what J StaR offers.',
        inputSchema: z.object({
          query: z.string().describe('What to search for in the knowledge base'),
        }),
        execute: async ({ query }) => {
          try {
            const results = await searchKnowledgeBase(query, 5, 0.5);
            return formatSearchResults(results);
          } catch (error) {
            console.error('Error searching knowledge base:', error);
            return 'Sorry, I encountered an error searching my knowledge base.';
          }
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
