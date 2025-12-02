import { streamText, tool, stepCountIs } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { searchKnowledgeBase, formatSearchResults } from '../../../lib/ai/rag-utils';
import { PromptManager, ChatContext } from '../../../lib/ai/prompt-manager';
import { classifyIntent } from '../../../lib/ai/intent-classifier';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;

  // Detect context from the Referer header - much more reliable than client-side
  const referer = req.headers.get('referer') || '';
  const context = referer.includes('/john-gpt') ? 'full-page' : 'widget';

  console.log('API /api/chat received body:', JSON.stringify({ ...body, messages: messages.length }, null, 2));
  console.log(`Context detected from referer: ${referer} => ${context}`);

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

  // --- INTELLIGENT ROUTING (The "Invisible Router") ---
  // 1. Analyze the LAST message for slash commands to determine the mode
  const lastMessage = modelMessages[modelMessages.length - 1];
  let targetRole = 'Universal'; // Default to JohnGPT
  let isExplicitCommand = false;

  // Check for slash commands first - they override context
  if (lastMessage && lastMessage.role === 'user') {
    const content = lastMessage.content.trim();

    if (content.startsWith('/code')) {
      targetRole = 'code';
      isExplicitCommand = true;
    } else if (content.startsWith('/roast')) {
      targetRole = 'roast';
      isExplicitCommand = true;
    } else if (content.startsWith('/simplify')) {
      targetRole = 'simplify';
      isExplicitCommand = true;
    } else if (content.startsWith('/bible')) {
      targetRole = 'bible';
      isExplicitCommand = true;
    }
  }

  // If no explicit command, try to classify intent
  if (!isExplicitCommand && lastMessage && lastMessage.role === 'user') {
    targetRole = await classifyIntent(modelMessages);
  }

  console.log(`Routing to Persona Role: ${targetRole} (Context: ${context})`);

  // 2. Fetch the appropriate System Prompt using PromptManager
  // We need to fetch the full user from DB if authenticated to get the tier
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { workosId: user.id },
    });
  }

  const systemPrompt = await PromptManager.getSystemPrompt({
    role: targetRole,
    context: context as ChatContext,
    user: dbUser, // Pass full DB user object (includes tier)
  });

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

  // 5. Return the stream with the detected mode in headers
  return result.toUIMessageStreamResponse({
    headers: {
      'X-JohnGPT-Mode': targetRole,
      'Access-Control-Expose-Headers': 'X-JohnGPT-Mode', // Ensure client can see it
    },
  });
}
