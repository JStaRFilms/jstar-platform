# Bug Fix: AI SDK Chat Stream Protocol Mismatch

## Date
2025-11-30

## Issue Summary

### Problem
The JohnGPT chat interface was experiencing a critical bug where AI responses were not rendering in the UI. The root cause was using an incorrect stream response method from the Vercel AI SDK v5.0.104.

### Symptoms
- User messages appeared briefly but AI responses never rendered
- Server error: `TypeError: result.toDataStreamResponse is not a function`
- TypeScript errors when attempting workarounds with `TextStreamChatTransport`
- Runtime mismatch between server (Text Stream) and client (Data Stream) protocols

### Root Cause
The previous implementation attempted to use `toDataStreamResponse()`, which doesn't exist in AI SDK v5.0.104. A workaround using `toTextStreamResponse()` was attempted, but this created a protocol mismatch with the `useChat` hook's default configuration.

## Solution

### Correct API Usage
AI SDK v5.0.104 uses **`toUIMessageStreamResponse()`** as the proper method for streaming chat responses that work with the `@ai-sdk/react` library's `useChat` hook.

## Changes Made

### 1. Server API Route (`src/app/api/chat/route.ts`)

**Before:**
```typescript
return (result as any).toTextStreamResponse();
```

**After:**
```typescript
return result.toUIMessageStreamResponse();
```

**Rationale:** The `toUIMessageStreamResponse()` method is specifically designed to work with `useChat` and streams responses in the new UI Message format with proper part-based message structure.

---

### 2. Client Chat View (`src/features/john-gpt/components/ChatView.tsx`)

#### Change 1: Removed Unnecessary Transport

**Before:**
```tsx
import { TextStreamChatTransport } from 'ai';

const chatHelpers = useChat({
    transport: new TextStreamChatTransport(),
}) as any;
```

**After:**
```tsx
const chatHelpers = useChat();
```

**Rationale:** The default `useChat` configuration works seamlessly with `toUIMessageStreamResponse()`. The `TextStreamChatTransport` workaround was unnecessary and caused type issues.

#### Change 2: Fixed Property Destructuring

**Before:**
```tsx
const { messages, sendMessage, isLoading, stop, error } = chatHelpers;
```

**After:**
```tsx
const { messages, sendMessage, status, stop, error } = chatHelpers;
const isLoading = status === 'submitted' || status === 'streaming';
```

**Rationale:** In AI SDK v5.0.104, `useChat` returns a `status` property instead of `isLoading`. The status can be:
- `'submitted'` - Message sent, waiting for response
- `'streaming'` - Receiving response tokens
- `'ready'` - Idle/Finished
- `'error'` - Error occurred

#### Change 3: Fixed sendMessage API

**Before:**
```tsx
await sendMessage({
    role: 'user',
    content: userMessage,
}, {
    body: {
        personaId: activePersona?.id,
    }
});
```

**After:**
```tsx
await sendMessage({
    text: userMessage,
}, {
    body: {
        personaId: activePersona?.id,
    }
});
```

**Rationale:** The `sendMessage` function from `useChat` expects `{ text: string }` as the first parameter, not `{ role, content }`. The role is automatically set to 'user'.

---

### 3. Message Conversion Fix (`src/app/api/chat/route.ts`)

**Before:**
```typescript
const modelMessages = messages.map((m: any) => ({
  role: m.role,
  content: m.content,
}));
```

**After:**
```typescript
const modelMessages = messages.map((m: any) => {
  const textContent = m.parts
    ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
    : '';
  return { role: m.role, content: textContent };
});
```

**Rationale:** `UIMessage` objects from `useChat` have a `parts` array structure, not a simple `content` string. We must extract the text content manually to pass it to the AI model.

---

### 4. Message Rendering (`src/features/john-gpt/components/ChatMessages.tsx`)

**Changes:**
- Removed debug `console.log` statements
- Kept existing message rendering logic (already compatible with `UIMessage` format)

**No structural changes needed** - The message rendering was already correctly handling the `message.parts` structure used by `UIMessage`.

---

## Technical Details

### About UIMessage Format

AI SDK v5.0.104 uses a new message format called `UIMessage` which structures messages as:

```typescript
interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
}

type MessagePart = 
  | { type: 'text'; text: string }
  | { type: 'tool-call'; ... }
  | { type: 'tool-result'; ... }
```

This format allows for rich message content including text, tool calls, and tool results.

### Stream Response Methods

| Method | Use Case | Compatible With |
|--------|----------|----------------|
| `toUIMessageStreamResponse()` | Streaming chat with `useChat` hook | `@ai-sdk/react` v2.x |
| `toTextStreamResponse()` | Legacy text-only streaming | Older implementations |
| `toDataStreamResponse()` | **Does not exist** in v5.0.104 | N/A |

## Testing

### Manual Testing Steps
1. ✅ Navigate to JohnGPT interface
2. ✅ Send a user message
3. ✅ Verify user message appears immediately
4. ✅ Verify AI response streams in character by character
5. ✅ Verify no TypeScript errors
6. ✅ Verify no runtime console errors
7. ✅ Verify message history is maintained

### Expected Behavior
- User messages should appear instantly
- AI responses should stream smoothly with proper formatting
- No errors in browser console
- Persona switching should work correctly
- All existing features (suggestions, persona selector) should remain functional

## References

- **AI SDK Documentation:** Vercel AI SDK v5.0.104
- **Package Versions:**
  - `ai`: ^5.0.104
  - `@ai-sdk/react`: ^2.0.104
  - `@ai-sdk/openai`: ^2.0.74

## Lessons Learned

1. **Always check the actual package version** - Documentation online may be for different versions
2. **Use TypeScript definitions** - The type definitions in `node_modules` are the source of truth
3. **Avoid unsafe type casts** - `as any` workarounds hide the real issues
4. **Trust the framework** - The default `useChat` configuration is designed to work out of the box

## Related Files

- [`src/app/api/chat/route.ts`](file:///c:/CreativeOS/01_Projects/Code/jstar-platform/src/app/api/chat/route.ts) - Server API route
- [`src/features/john-gpt/components/ChatView.tsx`](file:///c:/CreativeOS/01_Projects/Code/jstar-platform/src/features/john-gpt/components/ChatView.tsx) - Client chat view
- [`src/features/john-gpt/components/ChatMessages.tsx`](file:///c:/CreativeOS/01_Projects/Code/jstar-platform/src/features/john-gpt/components/ChatMessages.tsx) - Message rendering component

## Status

**RESOLVED** - All changes implemented and tested successfully.
