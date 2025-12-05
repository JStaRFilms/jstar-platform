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