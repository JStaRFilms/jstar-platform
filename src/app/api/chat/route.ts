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
import { streamText, convertToModelMessages } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // 🔓 Optional Authentication - Allow anonymous users
  const { user } = await withAuth();

  // If user is authenticated, we can save chat history (future feature)
  // For now, just allow everyone to chat
  if (user) {
    // Optional: Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { workosId: user.id },
    });

    if (dbUser) {
      // TODO: Save chat history to database for authenticated users
      // This will be implemented when you add chat history feature
      console.log(`Authenticated user: ${dbUser.email} (${dbUser.tier})`);
    }
  } else {
    // Anonymous user (GUEST)
    console.log('Anonymous user accessing JohnGPT');
  }

  // Convert UIMessage[] to ModelMessage[]
  const modelMessages = convertToModelMessages(messages);

  // 🌐 Stream response from selected provider (available to all users)
  const result = await streamText({
    model: getAIModel(),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
