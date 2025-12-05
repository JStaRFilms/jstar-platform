import { streamText, tool, stepCountIs } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { searchKnowledgeBase, formatSearchResults } from '../../../lib/ai/rag-utils';
import { findDestination } from '../../../lib/ai/findDestination';
import { PromptManager, ChatContext } from '../../../lib/ai/prompt-manager';
import { classifyIntent } from '../../../lib/ai/intent-classifier';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, currentPath: bodyCurrentPath } = body;

  // Detect context from the Referer header - much more reliable than client-side
  const referer = req.headers.get('referer') || '';
  const context = referer.includes('/john-gpt') ? 'full-page' : 'widget';

  // Extract currentPath from referer (more reliable than body)
  let currentPath = '/';
  try {
    if (referer) {
      const refererUrl = new URL(referer);
      currentPath = refererUrl.pathname;
    }
  } catch (e) {
    // Fallback to body or default
    currentPath = bodyCurrentPath || '/';
  }

  console.log('API /api/chat received:', { messages: messages.length, currentPath, context });
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
      targetRole = 'Coder';
      isExplicitCommand = true;
    } else if (content.startsWith('/roast')) {
      targetRole = 'Roaster';
      isExplicitCommand = true;
    } else if (content.startsWith('/simplify')) {
      targetRole = 'Simplifier';
      isExplicitCommand = true;
    } else if (content.startsWith('/bible')) {
      targetRole = 'Theologian';
      isExplicitCommand = true;
    }
  }

  // If no explicit command, try to classify intent
  if (!isExplicitCommand && lastMessage && lastMessage.role === 'user') {
    targetRole = await classifyIntent(modelMessages);
  }

  // Double-Tap Injection: Add reminder for navigation requests
  if (lastMessage && lastMessage.role === 'user') {
    const content = lastMessage.content.trim().toLowerCase();
    const navigationTriggers = ['go to', 'show me', 'take me to', 'navigate to', 'open', 'visit'];

    if (navigationTriggers.some(trigger => content.includes(trigger))) {
      lastMessage.content += `\n\n[SYSTEM REMINDER: The user wants to move. You may provide a brief, engaging "Tour Guide" transition, but you MUST execute the 'navigate' tool. Text alone is not enough.]`;
    }
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
    user: dbUser,
  });

  // 🌐 Stream response from selected provider
  const result = await streamText({
    model: getAIModel(context as 'widget' | 'full-page'),
    messages: modelMessages,
    system: systemPrompt,
    stopWhen: stepCountIs(5), // Allow AI to continue after tool execution for up to 5 steps
    tools: {
      searchKnowledge: tool({
        description: 'Search the knowledge base for ANY information related to J StaR, including services, portfolio, team members, testimonials, pricing, or specific details found on the website. Use this whenever the user asks a question that might be answered by content on the site, even if it seems like a specific detail.',
        inputSchema: z.object({
          query: z.string().describe('What to search for in the knowledge base'),
        }),
        execute: async ({ query }) => {
          try {
            const results = await searchKnowledgeBase(query, 5);
            return formatSearchResults(results);
          } catch (error) {
            console.error('Error searching knowledge base:', error);
            return 'Sorry, I encountered an error searching my knowledge base.';
          }
        },
      }),
      goTo: tool({
        description: `Smart navigation tool. Handles BOTH page navigation AND section scrolling. Use when user says "go to X", "show me X", "take me to X".
EXAMPLES:
- "show me services" → goTo({destination: "services"})
- "take me to pricing" → goTo({destination: "pricing"})
- "go to contact page" → goTo({destination: "contact page"})
- "show me the portfolio section" → goTo({destination: "portfolio section"})
NEGATIVE: Do NOT use for general questions, greetings, or casual chat.`,
        inputSchema: z.object({
          destination: z.string().describe('Where the user wants to go (e.g., "services", "pricing page", "portfolio section")'),
        }),
        execute: async ({ destination }) => {
          try {
            const userTier = dbUser?.tier || 'GUEST';
            console.log(`[goTo] Query: "${destination}", currentPath: "${currentPath}", userTier: ${userTier}`);
            const match = await findDestination(destination, currentPath, userTier);

            if (!match) {
              return "I couldn't find that destination. Could you be more specific?";
            }

            console.log(`[goTo] Match: ${match.type} - Page: ${match.pageUrl}, Section: ${match.sectionId || 'none'}, isOnCurrentPage: ${match.isOnCurrentPage}`);

            // Check tier access
            const TIER_LEVELS: Record<string, number> = {
              'GUEST': 0, 'TIER1': 1, 'TIER2': 2, 'TIER3': 3, 'ADMIN': 4
            };
            const userLevel = TIER_LEVELS[userTier] ?? 0;
            const requiredLevel = TIER_LEVELS[match.requiredTier] ?? 0;

            if (userLevel < requiredLevel) {
              return {
                action: 'showLoginComponent',
                targetUrl: match.pageUrl,
                pageTitle: match.pageTitle,
                requiredTier: match.requiredTier,
                message: `The ${match.pageTitle} page requires ${match.requiredTier} access. Please log in.`
              };
            }

            // Return appropriate action based on match type
            switch (match.type) {
              case 'section':
                // Already on this page, just scroll
                return {
                  action: 'scrollToSection',
                  sectionId: match.sectionId,
                  message: `Showing the ${match.sectionTitle} section...`
                };

              case 'page':
                // Navigate to a different page
                return {
                  action: 'navigate',
                  url: match.pageUrl,
                  title: match.pageTitle,
                  message: `Taking you to ${match.pageTitle}...`
                };

              case 'page_and_section':
                // Navigate to page AND scroll to section
                return {
                  action: 'navigateAndScroll',
                  url: match.pageUrl,
                  title: match.pageTitle,
                  sectionId: match.sectionId,
                  sectionTitle: match.sectionTitle,
                  message: `Taking you to the ${match.sectionTitle} section on ${match.pageTitle}...`
                };

              default:
                return { action: 'navigate', url: match.pageUrl, title: match.pageTitle };
            }

          } catch (error) {
            console.error('[goTo] Error:', error);
            return "I'm having trouble navigating right now. Please try again.";
          }
        },
      }),
    },
  });

  // 5. Return the stream with the detected mode in message metadata
  console.log(`[API] Returning response with mode in metadata: ${targetRole}`);

  return result.toUIMessageStreamResponse({
    messageMetadata: () => ({ mode: targetRole }),
  });
}
