/**
 * AI Providers Abstraction Layer
 *
 * Provides a unified interface for multiple AI providers in the JohnGPT feature.
 * Supports dynamic switching via environment variables for cost optimization,
 * performance tuning, and fallback capabilities.
 *
 * Supported Providers:
 * - Google Gemini (primary)
 * - OpenAI (fallback/high-quality)
 * - Groq (speed-focused)
 */
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { type LanguageModel } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  // Gemini 2.0+ models work with v1beta endpoint
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const providerMap = {
  gemini: google,
  openai,
  groq,
} as const;

export function getAISetup(): { provider: keyof typeof providerMap; model: string } {
  return {
    provider: (process.env.AI_PROVIDER as keyof typeof providerMap) || 'gemini',
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
  };
}

export function getAIModel(): LanguageModel {
  const { provider, model } = getAISetup();
  return providerMap[provider](model);
}

export function getFastModel(): LanguageModel {
  // Always use Gemini for fast tasks like title generation if available
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google('gemini-2.5-flash-lite');
  }
  return getAIModel();
}

export function getClassifierModel(): LanguageModel {
  // Use Groq with Llama model for intent classification as requested
  if (process.env.GROQ_API_KEY) {
    return groq('meta-llama/llama-4-scout-17b-16e-instruct');
  }
  // Fallback to fast model if Groq is not configured
  return getFastModel();
}
