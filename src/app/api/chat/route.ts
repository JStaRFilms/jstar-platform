// src/app/api/chat/route.ts
/**
 * JohnGPT Chat API Route
 *
 * API endpoint for handling AI-powered chat conversations.
 * Streams responses from configurable AI providers with access control.
 *
 * Route: POST /api/chat
 * Runtime: Node.js (required for Prisma/SQLite)
 */
import { streamText, convertToModelMessages } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // 🔒 Authentication & Authorization
  const { user } = await withAuth();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Check user tier in database
  const dbUser = await prisma.user.findUnique({
    where: { workosId: user.id },
  });

  if (!dbUser) {
    return new NextResponse('User not found', { status: 403 });
  }

  // Allow ADMIN, TIER1, TIER2, TIER3. Block GUEST.
  // TODO: Refine this logic based on exact business rules.
  // For now, we'll allow anyone who is NOT a guest, or if they are a guest but we want to allow free trials?
  // The requirement said "Tier 1+ only".
  const allowedTiers = ['ADMIN', 'TIER3', 'TIER2', 'TIER1'];

  if (!allowedTiers.includes(dbUser.tier)) {
    // Optional: Allow limited access for guests? For now, strict block.
    return new NextResponse('Upgrade required to access JohnGPT', { status: 403 });
  }

  const { messages } = await req.json();

  // Convert UIMessage[] to ModelMessage[]
  const modelMessages = convertToModelMessages(messages);

  // 🌐 Stream response from selected provider
  const result = await streamText({
    model: getAIModel(),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
