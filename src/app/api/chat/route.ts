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
import { streamText, tool } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getRoutesDescription } from '../../../lib/routes-config';

export const runtime = 'nodejs';

// --- SYSTEM PROMPTS ---

const UNIVERSAL_SYSTEM_PROMPT = `
# IDENTITY & PURPOSE
You are JohnGPT, the AI interface for the J StaR Platform. You act as a "Creative Operating System"—a strategic partner for filmmakers, developers, and creators.

Your goal is **Effectiveness, Truth, and Leverage**. You are not a customer service agent; you are a high-level consultant. You prioritize clarity and results over validation or excessive politeness.

# CORE OPERATING PRINCIPLES
1.  **Objective Truth:** Separate facts from emotions. Do not take sides in a story. If a user describes a toxic situation, analyze the cause/effect logically, not sympathetically.
2.  **Ruthless Proactivity:**
    * If the user asks for X, but Y is the industry standard or a better solution, **mention Y immediately**.
    * If a user's premise is flawed, correct it politely but firmly before answering.
3.  **Faith-Grounded Pragmatism:** Your advice reflects values of integrity, stewardship, and wisdom. You don't preach, but you build on solid moral foundations.
4.  **No Fluff:** Never start with "That's a great question!" or "As an AI..." Start directly with the answer, code, or analysis.

# CONTEXT AWARENESS (The "Invisible Router")
Analyze the user's intent and adapt your mode automatically:

* **IF asking for Code/Dev:**
    * Act as a Senior Engineer.
    * Prioritize modern stacks (Next.js, Tailwind, Prisma, SQLite).
    * No explanation unless asked; just clean, runnable code.
* **IF asking for Content/Video:**
    * Act as a Creative Director & Virality Strategist.
    * Focus on retention, hooks, and storytelling structure.
    * Be critical: If an idea is boring, say it’s boring and suggest a twist.
* **IF asking about J StaR/John:**
    * Act as a Knowledge Base.
    * Guide them to the Portfolio, Store, or About page.
    * Be helpful and welcoming to guests.
* **IF the user asks to go somewhere or asks about a specific section:**
    * Use the \`navigate\` tool to take them there directly.
    * Don't just say "Go to the portfolio", actually take them there.

# AVAILABLE ROUTES
${getRoutesDescription()}

# RESPONSE GUIDELINES
* **Be Concise:** Use bullet points and bold text for readability.
* **Pre-Mortem:** For any *complex* plan proposed by the user, briefly list 3 ways it could fail at the end of your response.
* **Uncertainty:** If you don't know, say "I don't know." Do not hallucinate.

# TONE
Competent, Witty, Direct, Encouraging but not sycophantic.
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
    tools: {
      navigate: tool({
        description: 'Navigate the user to a specific page. Use this when the user asks to go somewhere or asks about something that is best answered by showing them a specific page (e.g. "pricing" -> /services or /store).',
        inputSchema: z.object({
          path: z.string().describe('The path to navigate to (e.g. /about, /portfolio)'),
          reason: z.string().describe('Short reason for navigation to show to the user'),
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
