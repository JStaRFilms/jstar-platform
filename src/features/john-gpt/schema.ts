import { z } from 'zod';

// ============================================================================
// AI SDK Message Part Schemas
// ============================================================================
// These schemas define the known safe part types from the AI SDK.
// We use a discriminated union to validate structure while remaining
// type-safe against arbitrary/malicious payloads.
// Reference: https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-message-types

/** Text content part */
const TextPartSchema = z.object({
    type: z.literal('text'),
    text: z.string(),
});

/** Image content part (base64 or URL) */
const ImagePartSchema = z.object({
    type: z.literal('image'),
    image: z.string(), // Base64 data or URL
    mimeType: z.string().optional(),
});

/** File reference part */
const FilePartSchema = z.object({
    type: z.literal('file'),
    data: z.string(),
    mimeType: z.string(),
});

/** Tool invocation part (when assistant calls a tool) */
const ToolCallPartSchema = z.object({
    type: z.literal('tool-call'),
    toolCallId: z.string(),
    toolName: z.string(),
    args: z.record(z.string(), z.any()),
});

/** Tool result part (response from tool execution) */
const ToolResultPartSchema = z.object({
    type: z.literal('tool-result'),
    toolCallId: z.string(),
    toolName: z.string(),
    result: z.any(),
    isError: z.boolean().optional(),
});

/** Reasoning/thinking part (for models that expose reasoning) */
const ReasoningPartSchema = z.object({
    type: z.literal('reasoning'),
    reasoning: z.string(),
});

/** Source reference part (for RAG/citations) */
const SourcePartSchema = z.object({
    type: z.literal('source'),
    source: z.object({
        sourceType: z.string(),
        id: z.string(),
        url: z.string().optional(),
        title: z.string().optional(),
    }),
});

/** Step start/finish markers */
const StepPartSchema = z.object({
    type: z.union([z.literal('step-start'), z.literal('step-finish')]),
});

/**
 * Discriminated union of all known AI SDK message part types.
 * Unknown part types will fail validation, protecting against malformed
 * or malicious data being stored in the database.
 */
export const MessagePartSchema = z.discriminatedUnion('type', [
    TextPartSchema,
    ImagePartSchema,
    FilePartSchema,
    ToolCallPartSchema,
    ToolResultPartSchema,
    ReasoningPartSchema,
    SourcePartSchema,
    StepPartSchema,
]);

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
