import { z } from 'zod';

// AI SDK Message format validation
export const MessagePartSchema = z.object({
    type: z.enum(['text', 'image', 'tool-invocation']),
    text: z.string().optional(),
    image: z.string().optional(),
    toolInvocation: z.any().optional(),
});

export const MessageSchema = z.object({
    id: z.string(),
    role: z.enum(['system', 'user', 'assistant', 'data', 'tool']),
    content: z.string().optional(), // Simple string content
    parts: z.array(MessagePartSchema).optional(), // Structured content
    createdAt: z.union([z.string(), z.date()]).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});

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
