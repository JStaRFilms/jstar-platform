import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';
import { UserTier } from '@prisma/client';

/**
 * Admin API: AI Models Management
 *
 * GET - List all models with provider info
 * POST - Add a new model
 */

async function requireAdmin() {
    const { user } = await withAuth();
    if (!user) {
        return { error: 'Unauthorized', status: 401 };
    }

    const dbUser = await prisma.user.findUnique({
        where: { workosId: user.id },
        select: { tier: true },
    });

    if (!dbUser || dbUser.tier !== 'ADMIN') {
        return { error: 'Forbidden - Admin access required', status: 403 };
    }

    return { user: dbUser };
}

/**
 * GET /api/admin/ai-models
 * List all AI models with provider info
 */
export async function GET() {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const models = await prisma.aIModel.findMany({
            orderBy: [{ provider: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        isEnabled: true,
                    },
                },
            },
        });

        return NextResponse.json({ models });
    } catch (error) {
        console.error('Error fetching AI models:', error);
        return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
    }
}

/**
 * POST /api/admin/ai-models
 * Create a new AI model
 */
export async function POST(req: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const body = await req.json();
        const {
            providerId,
            modelId,
            displayName,
            description,
            minTier = 'GUEST',
            contextWindow,
            hasVision = false,
            hasImageGen = false,
            isPremium = false,
            tags = [],
            iconUrl,
            isDefault = false,
            isActive = true,
            sortOrder = 0,
        } = body;

        if (!providerId || !modelId || !displayName) {
            return NextResponse.json(
                { error: 'providerId, modelId, and displayName are required' },
                { status: 400 }
            );
        }

        // Validate minTier is a valid UserTier
        if (!Object.values(UserTier).includes(minTier)) {
            return NextResponse.json(
                { error: `Invalid minTier: ${minTier}` },
                { status: 400 }
            );
        }

        // If setting as default, unset any existing default
        if (isDefault) {
            await prisma.aIModel.updateMany({
                where: { isDefault: true },
                data: { isDefault: false },
            });
        }

        const model = await prisma.aIModel.create({
            data: {
                providerId,
                modelId,
                displayName,
                description: description || null,
                minTier: minTier as UserTier,
                contextWindow: contextWindow || null,
                hasVision,
                hasImageGen,
                isPremium,
                tags,
                iconUrl: iconUrl || null,
                isDefault,
                isActive,
                sortOrder,
            },
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

        return NextResponse.json({ model }, { status: 201 });
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2002') {
            return NextResponse.json(
                { error: 'A model with this provider and modelId already exists' },
                { status: 409 }
            );
        }
        console.error('Error creating AI model:', error);
        return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
    }
}
