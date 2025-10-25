// src/app/api/chat/route.ts
/**
 * JohnGPT Chat API Route
 *
 * Edge API endpoint for handling AI-powered chat conversations.
 * Streams responses from configurable AI providers with admin-only access control.
 *
 * Route: POST /api/chat
 * Runtime: Edge Runtime (for optimal streaming performance)
 */
import { streamText, convertToModelMessages } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { requireAdmin } from '../../../lib/admin-auth';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // 🔒 Phase 1: Admin-only access
  if (!requireAdmin(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  // Convert UIMessage[] to ModelMessage[]
  const modelMessages = convertToModelMessages(messages);

  // 🌐 Stream response from selected provider (Gemini by default)
  const result = await streamText({
    model: getAIModel(),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
