/**
 * AI Providers Abstraction Layer
 *
 * Provides a unified interface for multiple AI providers in the JohnGPT feature.
 * Supports both static (env-based) and dynamic (database-based) model selection.
 *
 * Supported Providers:
 * - Google Gemini (primary)
 * - OpenAI (fallback/high-quality)
 * - Groq (speed-focused)
 * - Anthropic (Claude models)
 * - OpenRouter (aggregator for many models)
 */
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';
import { createAnthropic } from '@ai-sdk/anthropic';
import { type LanguageModel } from 'ai';
import { prisma } from './prisma';

// Static provider instances using env vars (fallback/default)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const anthropic = process.env.ANTHROPIC_API_KEY
  ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Provider map for static model selection
const providerMap = {
  gemini: google,
  openai,
  groq,
  anthropic: anthropic as ReturnType<typeof createAnthropic>,
} as const;

type ProviderName = keyof typeof providerMap;

/**
 * Get AI setup from environment variables (static configuration)
 */
export function getAISetup(context?: 'widget' | 'full-page'): { provider: ProviderName; model: string } {
  if (context === 'widget') {
    return {
      provider: (process.env.WIDGET_AI_PROVIDER as ProviderName) || (process.env.AI_PROVIDER as ProviderName) || 'gemini',
      model: process.env.WIDGET_AI_MODEL || process.env.AI_MODEL || 'gemini-2.5-flash',
    };
  }

  return {
    provider: (process.env.AI_PROVIDER as ProviderName) || 'gemini',
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
  };
}

/**
 * Synchronous fallback for when database lookup fails
 * ONLY use when async function cannot be awaited
 */
function getAIModelSync(context?: 'widget' | 'full-page'): LanguageModel {
  const { provider, model } = getAISetup(context);
  const providerInstance = providerMap[provider];
  if (!providerInstance) {
    console.warn(`Provider "${provider}" not available, falling back to gemini`);
    return google('gemini-2.5-flash');
  }
  return providerInstance(model);
}

/**
 * Get AI model - searches database FIRST, then falls back to environment variables
 * This is the primary function for getting an AI model
 */
export async function getAIModel(context?: 'widget' | 'full-page'): Promise<LanguageModel> {
  try {
    // 1. Try to get default model from database first
    const defaultModel = await prisma.aIModel.findFirst({
      where: {
        isDefault: true,
        isActive: true,
        provider: { isEnabled: true },
      },
      include: { provider: true },
    });

    if (defaultModel && defaultModel.provider.apiKey) {
      console.log(`[getAIModel] Using default model from database: ${defaultModel.displayName}`);
      const providerInstance = createProviderInstance(
        defaultModel.provider.name,
        defaultModel.provider.apiKey,
        defaultModel.provider.baseUrl
      );
      if (providerInstance) {
        return providerInstance(defaultModel.modelId);
      }
    }

    // 2. Try to get any enabled provider from database with the configured provider type
    const { provider: providerName, model: modelName } = getAISetup(context);

    const dbProvider = await prisma.aIProvider.findFirst({
      where: {
        name: providerName === 'gemini' ? { in: ['google', 'gemini'] } : providerName,
        isEnabled: true,
        apiKey: { not: null },
      },
    });

    if (dbProvider && dbProvider.apiKey) {
      console.log(`[getAIModel] Using provider from database: ${dbProvider.name}`);
      const providerInstance = createProviderInstance(
        dbProvider.name,
        dbProvider.apiKey,
        dbProvider.baseUrl
      );
      if (providerInstance) {
        return providerInstance(modelName);
      }
    }

    // 3. Fall back to env-based configuration
    console.log('[getAIModel] Falling back to env-based configuration');
    return getAIModelSync(context);
  } catch (error) {
    console.error('[getAIModel] Database lookup failed, using env fallback:', error);
    return getAIModelSync(context);
  }
}

/**
 * Get a fast model for quick tasks like title generation
 * Uses database-configured API keys (admin panel), falls back to env vars
 */
export async function getFastModel(): Promise<LanguageModel> {
  try {
    // Try Groq from database first (fastest)
    const groqProvider = await prisma.aIProvider.findFirst({
      where: {
        name: 'groq',
        isEnabled: true,
        apiKey: { not: null },
      },
    });

    if (groqProvider && groqProvider.apiKey) {
      console.log('[getFastModel] Using Groq from database');
      const groqInstance = createGroq({
        apiKey: groqProvider.apiKey,
        ...(groqProvider.baseUrl && { baseURL: groqProvider.baseUrl }),
      });
      return groqInstance('meta-llama/llama-4-maverick-17b-128e-instruct');
    }

    // Try Google from database
    const googleProvider = await prisma.aIProvider.findFirst({
      where: {
        name: { in: ['google', 'gemini'] },
        isEnabled: true,
        apiKey: { not: null },
      },
    });

    if (googleProvider && googleProvider.apiKey) {
      console.log('[getFastModel] Using Google from database');
      const googleInstance = createGoogleGenerativeAI({
        apiKey: googleProvider.apiKey,
        baseURL: googleProvider.baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      });
      return googleInstance('gemini-2.5-flash-lite');
    }

    // Fall back to env-based
    if (process.env.GROQ_API_KEY) {
      console.log('[getFastModel] Using Groq from env');
      return groq('meta-llama/llama-4-maverick-17b-128e-instruct');
    }

    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log('[getFastModel] Using Google from env');
      return google('gemini-2.5-flash-lite');
    }

    // Ultimate fallback to default model
    console.warn('[getFastModel] No fast model available, using default');
    const { model } = await getDefaultModel();
    return model;
  } catch (error) {
    console.error('[getFastModel] Error:', error);
    // Fall back to env-based
    if (process.env.GROQ_API_KEY) {
      return groq('meta-llama/llama-4-maverick-17b-128e-instruct');
    }
    return google('gemini-2.5-flash-lite');
  }
}

/**
 * Get model for intent classification
 * Uses database-configured API keys (admin panel), falls back to env vars
 */
export async function getClassifierModel(): Promise<LanguageModel> {
  try {
    // Try to get Groq provider from database first (fastest for classification)
    const groqProvider = await prisma.aIProvider.findFirst({
      where: {
        name: 'groq',
        isEnabled: true,
        apiKey: { not: null },
      },
    });

    if (groqProvider && groqProvider.apiKey) {
      console.log('[getClassifierModel] Using Groq from database');
      const groqInstance = createGroq({
        apiKey: groqProvider.apiKey,
        ...(groqProvider.baseUrl && { baseURL: groqProvider.baseUrl }),
      });
      return groqInstance('meta-llama/llama-4-maverick-17b-128e-instruct'); // Fast Llama model
    }

    // Try Google from database
    const googleProvider = await prisma.aIProvider.findFirst({
      where: {
        name: { in: ['google', 'gemini'] },
        isEnabled: true,
        apiKey: { not: null },
      },
    });

    if (googleProvider && googleProvider.apiKey) {
      console.log('[getClassifierModel] Using Google from database');
      const googleInstance = createGoogleGenerativeAI({
        apiKey: googleProvider.apiKey,
        baseURL: googleProvider.baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      });
      return googleInstance('gemini-2.5-flash-lite'); // Fast Gemini model
    }

    // Fall back to env-based Groq if available
    if (process.env.GROQ_API_KEY) {
      console.log('[getClassifierModel] Using Groq from env');
      return groq('meta-llama/llama-4-maverick-17b-128e-instruct');
    }

    // Fall back to env-based Google
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log('[getClassifierModel] Using Google from env');
      return google('gemini-2.5-flash-lite');
    }

    // Ultimate fallback
    console.warn('[getClassifierModel] No classifier model available, using default');
    return getFastModel();
  } catch (error) {
    console.error('[getClassifierModel] Error:', error);
    // Fall back to env-based
    if (process.env.GROQ_API_KEY) {
      return groq('meta-llama/llama-4-maverick-17b-128e-instruct');
    }
    return google('gemini-2.5-flash-lite');
  }
}

/**
 * Create a provider instance with custom API key
 * Used for dynamic model selection from database
 */
function createProviderInstance(
  providerName: string,
  apiKey: string | null,
  baseUrl: string | null
): ReturnType<typeof createOpenAI> | ReturnType<typeof createGoogleGenerativeAI> | ReturnType<typeof createGroq> | ReturnType<typeof createAnthropic> | null {
  // Use provided API key or fall back to env var
  switch (providerName) {
    case 'openai':
      return createOpenAI({
        apiKey: apiKey || process.env.OPENAI_API_KEY,
        ...(baseUrl && { baseURL: baseUrl }),
      });

    case 'google':
    case 'gemini':
      return createGoogleGenerativeAI({
        apiKey: apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        baseURL: baseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      });

    case 'groq':
      return createGroq({
        apiKey: apiKey || process.env.GROQ_API_KEY,
        ...(baseUrl && { baseURL: baseUrl }),
      });

    case 'anthropic':
      const anthropicKey = apiKey || process.env.ANTHROPIC_API_KEY;
      if (!anthropicKey) return null;
      return createAnthropic({
        apiKey: anthropicKey,
        ...(baseUrl && { baseURL: baseUrl }),
      });

    case 'openrouter':
      // OpenRouter uses OpenAI-compatible API
      return createOpenAI({
        apiKey: apiKey || process.env.OPENROUTER_API_KEY,
        baseURL: baseUrl || 'https://openrouter.ai/api/v1',
      });

    default:
      console.warn(`Unknown provider: ${providerName}`);
      return null;
  }
}

/**
 * Get a model by its database ID (dynamic selection)
 * Falls back to env-based model if not found
 */
export async function getDynamicModel(
  modelDbId: string | null | undefined,
  context?: 'widget' | 'full-page'
): Promise<LanguageModel> {
  // If no model ID, use database-first configuration
  if (!modelDbId) {
    return await getAIModel(context);
  }

  try {
    // Fetch the model with its provider from database
    const aiModel = await prisma.aIModel.findUnique({
      where: { id: modelDbId },
      include: {
        provider: true,
      },
    });

    if (!aiModel || !aiModel.isActive) {
      console.warn(`Model ${modelDbId} not found or inactive, using fallback`);
      return await getAIModel(context);
    }

    if (!aiModel.provider.isEnabled) {
      console.warn(`Provider ${aiModel.provider.name} is disabled, using fallback`);
      return await getAIModel(context);
    }

    // Create provider instance with database configuration
    const providerInstance = createProviderInstance(
      aiModel.provider.name,
      aiModel.provider.apiKey,
      aiModel.provider.baseUrl
    );

    if (!providerInstance) {
      console.warn(`Could not create provider instance for ${aiModel.provider.name}, using fallback`);
      return await getAIModel(context);
    }

    // Return the model from the provider
    console.log(`✅ [getDynamicModel] Using model: ${aiModel.displayName} (${aiModel.modelId}) from ${aiModel.provider.name}`);
    return providerInstance(aiModel.modelId);
  } catch (error) {
    console.error('Error fetching dynamic model:', error);
    return await getAIModel(context);
  }
}

/**
 * Get the default model from database, or fall back to env-based model
 */
export async function getDefaultModel(): Promise<{ modelId: string | null; model: LanguageModel }> {
  try {
    const defaultModel = await prisma.aIModel.findFirst({
      where: {
        isDefault: true,
        isActive: true,
        provider: { isEnabled: true },
      },
      include: { provider: true },
    });

    if (defaultModel) {
      const model = await getDynamicModel(defaultModel.id);
      return { modelId: defaultModel.id, model };
    }
  } catch (error) {
    console.error('Error fetching default model:', error);
  }

  // Fall back to env-based model (database-first, then env)
  return { modelId: null, model: await getAIModel() };
}
