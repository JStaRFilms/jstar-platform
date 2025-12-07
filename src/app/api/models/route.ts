import { NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';
import {
    canAccessModel,
    canUsePremiumModel,
    PAID_MODEL_DAILY_LIMITS,
    type ModelSelectorItem,
    type ModelsApiResponse,
} from '@/lib/ai/types';
import { UserTier } from '@prisma/client';

/**
 * User API: Available AI Models
 *
 * GET - Get all available models filtered by user's tier
 * Returns accessibility info and daily limit status for Tier 1 users
 */
export async function GET() {
    // Get user (optional - anonymous users get GUEST tier)
    const { user } = await withAuth();

    let userTier: UserTier = 'GUEST';
    let paidModelUsageToday = 0;
    let paidModelUsageResetAt: Date | null = null;

    if (user) {
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
            select: {
                tier: true,
                paidModelUsageToday: true,
                paidModelUsageResetAt: true,
            },
        });

        if (dbUser) {
            userTier = dbUser.tier;
            paidModelUsageToday = dbUser.paidModelUsageToday;
            paidModelUsageResetAt = dbUser.paidModelUsageResetAt;
        }
    }

    try {
        // Fetch all active models from enabled providers
        const models = await prisma.aIModel.findMany({
            where: {
                isActive: true,
                provider: { isEnabled: true },
            },
            orderBy: [{ provider: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                    },
                },
            },
        });

        // Transform models to include accessibility info
        const selectorItems: ModelSelectorItem[] = models.map((model) => {
            const isAccessible = canAccessModel(userTier, model.minTier);
            const canUsePremium = model.isPremium
                ? canUsePremiumModel(userTier, paidModelUsageToday, paidModelUsageResetAt)
                : true;

            return {
                id: model.id,
                modelId: model.modelId,
                displayName: model.displayName,
                description: model.description,
                provider: model.provider,
                contextWindow: model.contextWindow,
                hasVision: model.hasVision,
                hasImageGen: model.hasImageGen,
                isPremium: model.isPremium,
                tags: model.tags,
                iconUrl: model.iconUrl,
                sortOrder: model.sortOrder,
                isAccessible,
                requiredTier: isAccessible ? null : model.minTier,
                canUsePremium,
            };
        });

        // Build response
        const response: ModelsApiResponse = {
            models: selectorItems,
            userTier,
        };

        // Add daily limit info for Tier 1 users
        if (userTier === 'TIER1') {
            response.dailyLimit = {
                used: paidModelUsageToday,
                max: PAID_MODEL_DAILY_LIMITS.TIER1,
                resetsAt: paidModelUsageResetAt?.toISOString() || null,
            };
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
    }
}
