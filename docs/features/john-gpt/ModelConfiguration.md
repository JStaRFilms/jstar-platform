# JohnGPT Model Configuration

This document explains how to configure different AI models for the JohnGPT widget vs the main JohnGPT page.

## Environment Variables

### Main Configuration (Applies to both widget and main page by default)

```env
# Default AI provider for all JohnGPT instances
AI_PROVIDER=gemini

# Default AI model for all JohnGPT instances
AI_MODEL=gemini-2.5-flash
```

### Widget-Specific Configuration (Overrides defaults for widget only)

```env
# AI provider specifically for the JohnGPT widget
WIDGET_AI_PROVIDER=gemini

# AI model specifically for the JohnGPT widget
WIDGET_AI_MODEL=gemini-2.5-flash-lite
```

## How It Works

1. **Main JohnGPT Page**: Uses `AI_PROVIDER` and `AI_MODEL` environment variables
2. **JohnGPT Widget**: Uses `WIDGET_AI_PROVIDER` and `WIDGET_AI_MODEL` if set, otherwise falls back to the main configuration

## Configuration Examples

### Example 1: Different models for widget vs main page

```env
# Main page uses the full Gemini model
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash

# Widget uses a lighter, faster model
WIDGET_AI_PROVIDER=gemini
WIDGET_AI_MODEL=gemini-2.5-flash-lite
```

### Example 2: Different providers for widget vs main page

```env
# Main page uses OpenAI for higher quality
AI_PROVIDER=openai
AI_MODEL=gpt-4o

# Widget uses Groq for faster response times
WIDGET_AI_PROVIDER=groq
WIDGET_AI_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
```

### Example 3: Same configuration for both (fallback behavior)

```env
# Both widget and main page use the same configuration
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash

# WIDGET_AI_* variables not set, so widget falls back to main config
```

## Implementation Details

The system automatically detects the context (widget vs full-page) from the HTTP referer header in the API route. The context is then passed to the model selection function which chooses the appropriate model based on the environment variables.

## Supported Providers

- **Google Gemini**: Primary provider with various model options
- **OpenAI**: Fallback/high-quality provider
- **Groq**: Speed-focused provider

## Model Options

### Gemini Models
- `gemini-2.5-flash` - Full featured model (default)
- `gemini-2.5-flash-lite` - Lighter, faster model
- `gemini-2.0-pro` - Professional grade model

### OpenAI Models
- `gpt-4o` - Latest GPT-4 model
- `gpt-4-turbo` - Turbo version
- `gpt-3.5-turbo` - Cost-effective option

### Groq Models
- `meta-llama/llama-4-scout-17b-16e-instruct` - Fast Llama model
- `meta-llama/llama-4-scout-8b-16e-instruct` - Smaller, faster variant

## Best Practices

1. **Performance vs Quality**: Use lighter models for widgets (faster response) and full models for the main page (better quality)
2. **Cost Optimization**: Widgets typically handle more frequent, shorter interactions - use cost-effective models
3. **Consistency**: Keep the same provider for both unless you have specific performance requirements
4. **Fallback**: The widget will always fall back to main configuration if widget-specific variables are not set

---

## Dynamic Model Selection (UI-based)

Beyond environment variables, users can select AI models dynamically through the Model Selector UI on the full JohnGPT page.

### How It Works

1. **Model Selector Component** (`ModelSelector.tsx`): Displays available models from the database
2. **ChatView State**: Manages `selectedModelId` state
3. **Per-Request Body**: The `modelId` is passed on each message via `sendMessageWithModel()`
4. **Server Validation**: The API validates tier access and premium model limits

### Key Implementation Details

The Vercel AI SDK's `useChat` hook **memoizes** the `body` option at initialization. This means passing `modelId` in the static body configuration doesn't work when the user changes models after the hook initializes.

**Solution**: Pass `modelId` per-request via the `sendMessage()` options:

```typescript
// useBranchingChat.ts
const sendMessageWithModel = useCallback(
    async (message: any, modelId?: string | null) => {
        return sendMessage(message, {
            body: { modelId },  // Per-request body overrides static body
        });
    },
    [sendMessage]
);
```

### Files Involved

| File | Purpose |
|------|---------|
| `useBranchingChat.ts` | Custom hook wrapping `useChat` with `sendMessageWithModel` wrapper |
| `ChatView.tsx` | Manages `selectedModelId` state and calls `sendMessageWithModel` |
| `ModelSelector.tsx` | UI component for selecting models |
| `route.ts` (API) | Receives `modelId` and passes to `getDynamicModel()` |
| `ai-providers.ts` | `getDynamicModel()` fetches model config from database |

---

## Tier-Based Model Access

Models can be restricted by user tier:

| Tier | Access Level |
|------|--------------|
| `GUEST` | Free models only |
| `TIER1` | Free + limited premium (daily cap) |
| `TIER2` | All models, no limits |
| `TIER3` | All models, no limits |
| `ADMIN` | All models, no limits |

Premium model usage is tracked in `User.paidModelUsageToday` with daily reset via `paidModelUsageResetAt`.

---

## Change Log

### 2025-12-07: Fixed Dynamic Model Selection Bug

**Problem**: The `modelId` selected in the Model Selector UI was not being passed to the `/api/chat` endpoint. Server logs showed `modelId: undefined` regardless of user selection.

**Root Cause**: The `useChat` hook from `@ai-sdk/react` memoizes the `body` option at hook initialization. When `selectedModelId` was `null` at mount, that value was captured forever—even after the user selected a model.

**Solution**: 
1. Removed `modelId` from the static `body` configuration in `useChat`
2. Created `sendMessageWithModel()` wrapper that passes `modelId` per-request via `sendMessage()` options
3. Updated `ChatView.tsx` to call `sendMessageWithModel(message, selectedModelId)`

**Additional Fix**: Changed `append` → `sendMessage` for AI SDK v5 compatibility (the SDK renamed this function).

**Files Modified**:
- `src/features/john-gpt/hooks/useBranchingChat.ts` - Added `sendMessageWithModel` wrapper
- `src/features/john-gpt/components/ChatView.tsx` - Uses `sendMessageWithModel` with `selectedModelId`
- `src/app/api/chat/route.ts` - Added `modelId` to console logging

**Verification**: Server logs now show `modelId: 'cmiuo8eqo0009g67sh6asqbg4'` when a model is selected, and the correct model (e.g., "Gemini 2.5 Pro") is used.