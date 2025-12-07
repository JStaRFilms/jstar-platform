import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

/**
 * Admin API: Single AI Provider Management
 *
 * PATCH - Update a provider (API key, enabled status, etc.)
 * DELETE - Delete a provider and all its models
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
 * PATCH /api/admin/ai-providers/[id]
 * Update provider settings
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const params = await context.params;
    const providerId = params.id;

    try {
        const body = await req.json();
        const { displayName, apiKey, baseUrl, isEnabled, sortOrder } = body;

        // Build update object with only provided fields
        const updateData: Record<string, unknown> = {};
        if (displayName !== undefined) updateData.displayName = displayName;
        if (apiKey !== undefined) updateData.apiKey = apiKey || null;
        if (baseUrl !== undefined) updateData.baseUrl = baseUrl || null;
        if (isEnabled !== undefined) updateData.isEnabled = isEnabled;
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

        const provider = await prisma.aIProvider.update({
            where: { id: providerId },
            data: updateData,
        });

        return NextResponse.json({
            provider: {
                id: provider.id,
                name: provider.name,
                displayName: provider.displayName,
                hasApiKey: !!provider.apiKey,
                baseUrl: provider.baseUrl,
                isEnabled: provider.isEnabled,
                sortOrder: provider.sortOrder,
            },
        });
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }
        console.error('Error updating AI provider:', error);
        return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/ai-providers/[id]
 * Delete a provider and all its models (cascade)
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const params = await context.params;
    const providerId = params.id;

    try {
        await prisma.aIProvider.delete({
            where: { id: providerId },
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if ((error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }
        console.error('Error deleting AI provider:', error);
        return NextResponse.json({ error: 'Failed to delete provider' }, { status: 500 });
    }
}
