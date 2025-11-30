# AI Provider Setup Guide

## Problem

The JohnGPT chat is showing this error:
```
Error: model output must contain either output text or tool calls, these cannot both be empty
```

## Root Cause

**No AI provider API keys are configured in the `.env` file.**

The application needs at least one valid API key to call an AI model and generate responses.

## Solution: Add an AI Provider API Key

Choose ONE of these providers and add the corresponding API key to your `.env` file:

### Option 1: Google Gemini (Recommended)

**Why?** Fast, generous free tier, good quality responses

1. Get API key from: https://aistudio.google.com/app/apikey
2. Add to `.env`:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash-exp
```

### Option 2: OpenAI

**Why?** Highest quality responses, well-documented

1. Get API key from: https://platform.openai.com/api-keys
2. Add to `.env`:
```bash
OPENAI_API_KEY=your_api_key_here
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
```

### Option 3: Groq

**Why?** Fastest inference speed, free tier

1. Get API key from: https://console.groq.com/keys
2. Add to `.env`:
```bash
GROQ_API_KEY=your_api_key_here
AI_PROVIDER=groq
AI_MODEL=llama-3.1-70b-versatile
```

## After Adding API Key

1. Restart your dev server (Ctrl+C then `npm run dev`)
2. The chat should now work properly!

## Current Environment Status

```
❌ GOOGLE_GENERATIVE_AI_API_KEY: NOT SET
❌ OPENAI_API_KEY: NOT SET
❌ GROQ_API_KEY: NOT SET
⚠️  AI_PROVIDER: not set (defaults to 'gemini')
⚠️  AI_MODEL: not set (defaults to 'gemini-2.5-flash')
```

**Action Required**: Add at least one API key to proceed.
