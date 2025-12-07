/**
 * AI Model Types
 *
 * Types for multi-model AI support in JohnGPT.
 * Supports dynamic model selection, tier-based access, and usage limits.
 */

import type { AIModel, AIProvider, UserTier } from '@prisma/client';

// Re-export Prisma types for convenience
export type { AIModel, AIProvider };

/**
 * AI Model with provider information included
 */
export interface AIModelWithProvider extends AIModel {
    provider: Pick<AIProvider, 'id' | 'name' | 'displayName'>;
}

/**
 * Model for the user-facing model selector
 * Includes access status and lock information
 */
export interface ModelSelectorItem {
    id: string;
    modelId: string;
    displayName: string;
    description: string | null;
    provider: {
        id: string;
        name: string;
        displayName: string;
    };
    contextWindow: number | null;
    hasVision: boolean;
    hasImageGen: boolean;
    isPremium: boolean;
    tags: string[];
    iconUrl: string | null;
    sortOrder: number;
    /** Whether the user can access this model */
    isAccessible: boolean;
    /** If not accessible, the minimum tier required */
    requiredTier: UserTier | null;
    /** For Tier 1 users: if premium and they have remaining daily quota */
    canUsePremium: boolean;
}

/**
 * API response for /api/models endpoint
 */
export interface ModelsApiResponse {
    models: ModelSelectorItem[];
    userTier: UserTier;
    /** For Tier 1 users: daily limit info */
    dailyLimit?: {
        used: number;
        max: number;
        resetsAt: string | null;
    };
}

/**
 * Request body for chat API with model selection
 */
export interface ChatRequestWithModel {
    messages: unknown[];
    modelId?: string;
    currentPath?: string;
}

/**
 * Provider configuration for dynamic model instantiation
 */
export interface ProviderConfig {
    name: string;
    apiKey: string | null;
    baseUrl: string | null;
    isEnabled: boolean;
}

/**
 * Tier-based daily limits for paid models
 */
export const PAID_MODEL_DAILY_LIMITS: Record<UserTier, number> = {
    GUEST: 0,      // No access to paid models
    TIER1: 10,     // 10 requests/day
    TIER2: 999999, // Unlimited (effectively)
    TIER3: 999999, // Unlimited
    ADMIN: 999999, // Unlimited
};

/**
 * Tier access levels for comparison
 */
export const TIER_LEVELS: Record<UserTier, number> = {
    GUEST: 0,
    TIER1: 1,
    TIER2: 2,
    TIER3: 3,
    ADMIN: 4,
};

/**
 * Check if a user tier can access a model's minimum tier
 */
export function canAccessModel(userTier: UserTier, modelMinTier: UserTier): boolean {
    return TIER_LEVELS[userTier] >= TIER_LEVELS[modelMinTier];
}

/**
 * Check if a Tier 1 user can use a premium model based on daily limits
 */
export function canUsePremiumModel(
    userTier: UserTier,
    usageToday: number,
    usageResetAt: Date | null
): boolean {
    // Tier 2+ have unlimited access
    if (TIER_LEVELS[userTier] >= TIER_LEVELS.TIER2) return true;

    // GUEST cannot use premium
    if (userTier === 'GUEST') return false;

    // TIER1 checks daily limit
    const limit = PAID_MODEL_DAILY_LIMITS[userTier];

    // Check if we need to reset the counter (new day)
    if (usageResetAt) {
        const now = new Date();
        if (now > usageResetAt) {
            // Counter should have been reset - treat as 0 usage
            return true;
        }
    }

    return usageToday < limit;
}
