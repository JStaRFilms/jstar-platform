import { z } from 'zod';

// AI SDK Message format validation
// NOTE: Parts are kept permissive because the AI SDK uses many part types
// (text, image, tool-call, tool-result, reasoning, file, etc.)
// Strict validation would break sync for legitimate messages.
export const MessagePartSchema = z.object({
    type: z.string(), // Permissive - AI SDK has many part types
}).passthrough(); // Allow any additional properties

export const MessageSchema = z.object({
    id: z.string(),
    role: z.enum(['system', 'user', 'assistant', 'data', 'tool']),
    content: z.string().optional().nullable(), // Simple string content (can be null)
    parts: z.array(MessagePartSchema).optional(), // Structured content
    createdAt: z.union([z.string(), z.date()]).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    // Branching Logic
    parentId: z.string().nullable().optional(),
    childrenIds: z.array(z.string()).optional(),
}).passthrough(); // Allow additional AI SDK fields we don't explicitly define

// Conversation CRUD schemas
export const CreateConversationSchema = z.object({
    title: z.string().optional(),
    messages: z.array(MessageSchema).default([]),
    personaId: z.string().optional(),
    selectedModelId: z.string().optional(),
    localVersion: z.number().optional(),
});

export const UpdateConversationSchema = z.object({
    title: z.string().optional(),
    messages: z.array(MessageSchema),
    messageCount: z.number().optional(),
    personaId: z.string().optional(),
    selectedModelId: z.string().optional(),
    localVersion: z.number(), // Required for conflict detection
});
