import { streamText, tool, stepCountIs, convertToModelMessages, UIMessage } from 'ai';
import { getDynamicModel, getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { searchKnowledgeBase, formatSearchResults } from '../../../lib/ai/rag-utils';
import { findDestination } from '../../../lib/ai/findDestination';
import { PromptManager, ChatContext } from '../../../lib/ai/prompt-manager';
import { classifyIntent } from '../../../lib/ai/intent-classifier';
import { canAccessModel, canUsePremiumModel, PAID_MODEL_DAILY_LIMITS } from '../../../lib/ai/types';

export const runtime = 'nodejs';
// Allow streaming responses up to 60 seconds (max for Vercel Hobby plan)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, currentPath: bodyCurrentPath, modelId } = body;

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

  console.log('API /api/chat received:', { messages: messages.length, currentPath, context, modelId });
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

  // Extract simple text for intent classification and slash command detection
  const classifierMessages = messages.map((m: any) => ({
    role: m.role,
    content: m.parts
      ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
      : m.content || '',
  }));

  // --- INTELLIGENT ROUTING (The "Invisible Router") ---
  // 1. Analyze the LAST message for slash commands to determine the mode
  const lastClassifierMessage = classifierMessages[classifierMessages.length - 1];
  let targetRole = 'Universal'; // Default to JohnGPT
  let isExplicitCommand = false;

  // Check for slash commands first - they override context
  if (lastClassifierMessage && lastClassifierMessage.role === 'user') {
    const content = (lastClassifierMessage.content || '').trim();

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
  if (!isExplicitCommand && lastClassifierMessage && lastClassifierMessage.role === 'user') {
    targetRole = await classifyIntent(classifierMessages);
  }



  // Convert UIMessage[] to CoreMessage[] AFTER any modifications (preserves streaming metadata)
  const modelMessages = convertToModelMessages(messages as UIMessage[]);

  console.log(`Routing to Persona Role: ${targetRole} (Context: ${context})`);

  // 2. Fetch the appropriate System Prompt using PromptManager
  // We need to fetch the full user from DB if authenticated to get the tier
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { workosId: user.id },
    });
  }

  // 3. Handle dynamic model selection with tier validation
  let selectedModelId: string | null = modelId || null;
  let selectedModel = await getAIModel(context as 'widget' | 'full-page'); // Default fallback (database first, then env)

  if (selectedModelId) {
    try {
      // Fetch the model to validate access
      const aiModel = await prisma.aIModel.findUnique({
        where: { id: selectedModelId },
        include: { provider: true },
      });

      if (aiModel && aiModel.isActive && aiModel.provider.isEnabled) {
        const userTier = dbUser?.tier || 'GUEST';

        // Check tier access
        if (!canAccessModel(userTier, aiModel.minTier)) {
          console.warn(`User tier ${userTier} cannot access model requiring ${aiModel.minTier}`);
          selectedModelId = null; // Fall back to default
        }
        // Check premium usage limits for Tier 1 users
        else if (aiModel.isPremium && userTier === 'TIER1') {
          const canUse = canUsePremiumModel(
            userTier,
            dbUser?.paidModelUsageToday || 0,
            dbUser?.paidModelUsageResetAt || null
          );

          if (!canUse) {
            console.warn(`Tier 1 user exceeded daily limit for premium models`);
            selectedModelId = null; // Fall back to default
          } else if (dbUser) {
            // Increment usage counter
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                paidModelUsageToday: { increment: 1 },
                paidModelUsageResetAt: dbUser.paidModelUsageResetAt || tomorrow,
              },
            });
          }
        }
      } else {
        console.warn(`Model ${selectedModelId} not found or inactive`);
        selectedModelId = null;
      }
    } catch (error) {
      console.error('Error validating model access:', error);
      selectedModelId = null;
    }

    // Get the dynamic model if validated
    if (selectedModelId) {
      selectedModel = await getDynamicModel(selectedModelId, context as 'widget' | 'full-page');
    }
  }

  const systemPrompt = await PromptManager.getSystemPrompt({
    role: targetRole,
    context: context as ChatContext,
    user: dbUser,
  });

  // 🌐 Stream response from selected provider
  const result = await streamText({
    model: selectedModel,
    messages: modelMessages,
    system: systemPrompt,
    stopWhen: stepCountIs(5), // Allow AI to continue after tool execution for up to 5 steps
    maxRetries: 2, // Slight increase to handle transient network blips
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
    headers: {
      'Connection': 'keep-alive', // Ensure connection stays open during pauses
      'Cache-Control': 'no-cache, no-transform', // Prevent buffering
    },
  });
}
