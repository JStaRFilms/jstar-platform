import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';
import { UserTier } from '@prisma/client';

/**
 * Admin API: Single AI Model Management
 *
 * PATCH - Update a model
 * DELETE - Delete a model
 */

type RouteContext = { params: Promise<{ id: string }> };

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
 * PATCH /api/admin/ai-models/[id]
 * Update a model's settings
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const params = await context.params;
    const modelDbId = params.id;

    try {
        const body = await req.json();
        const {
            displayName,
            description,
            minTier,
            contextWindow,
            hasVision,
            hasImageGen,
            isPremium,
            tags,
            iconUrl,
            isDefault,
            isActive,
            sortOrder,
        } = body;

        // Validate minTier if provided
        if (minTier !== undefined && !Object.values(UserTier).includes(minTier)) {
            return NextResponse.json(
                { error: `Invalid minTier: ${minTier}` },
                { status: 400 }
            );
        }

        // If setting as default, unset any existing default
        if (isDefault) {
            await prisma.aIModel.updateMany({
                where: { isDefault: true, id: { not: modelDbId } },
                data: { isDefault: false },
            });
        }

        // Build update object
        const updateData: Record<string, unknown> = {};
        if (displayName !== undefined) updateData.displayName = displayName;
        if (description !== undefined) updateData.description = description || null;
        if (minTier !== undefined) updateData.minTier = minTier;
        if (contextWindow !== undefined) updateData.contextWindow = contextWindow || null;
        if (hasVision !== undefined) updateData.hasVision = hasVision;
        if (hasImageGen !== undefined) updateData.hasImageGen = hasImageGen;
        if (isPremium !== undefined) updateData.isPremium = isPremium;
        if (tags !== undefined) updateData.tags = tags;
        if (iconUrl !== undefined) updateData.iconUrl = iconUrl || null;
        if (isDefault !== undefined) updateData.isDefault = isDefault;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

        const model = await prisma.aIModel.update({
            where: { id: modelDbId },
            data: updateData,
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

        return NextResponse.json({ model });
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Model not found' }, { status: 404 });
        }
        console.error('Error updating AI model:', error);
        return NextResponse.json({ error: 'Failed to update model' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/ai-models/[id]
 * Delete a model
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const params = await context.params;
    const modelDbId = params.id;

    try {
        await prisma.aIModel.delete({
            where: { id: modelDbId },
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Model not found' }, { status: 404 });
        }
        console.error('Error deleting AI model:', error);
        return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
    }
}
