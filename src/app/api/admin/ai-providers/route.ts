import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

/**
 * Admin API: AI Providers Management
 *
 * GET - List all providers with model counts
 * POST - Create a new provider
 */

// Ensure only admins can access
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
 * GET /api/admin/ai-providers
 * List all AI providers with model counts
 */
export async function GET() {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const providers = await prisma.aIProvider.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: {
                    select: { models: true },
                },
            },
        });

        // Mask API keys for security - only show if set or not
        const maskedProviders = providers.map((provider) => ({
            id: provider.id,
            name: provider.name,
            displayName: provider.displayName,
            hasApiKey: !!provider.apiKey, // Only indicate if API key is set
            baseUrl: provider.baseUrl,
            isEnabled: provider.isEnabled,
            sortOrder: provider.sortOrder,
            modelCount: provider._count.models,
            createdAt: provider.createdAt,
            updatedAt: provider.updatedAt,
        }));

        return NextResponse.json({ providers: maskedProviders });
    } catch (error) {
        console.error('Error fetching AI providers:', error);
        return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
    }
}

/**
 * POST /api/admin/ai-providers
 * Create a new AI provider
 */
export async function POST(req: NextRequest) {
    const auth = await requireAdmin();
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const body = await req.json();
        const { name, displayName, apiKey, baseUrl, isEnabled = true, sortOrder = 0 } = body;

        if (!name || !displayName) {
            return NextResponse.json(
                { error: 'name and displayName are required' },
                { status: 400 }
            );
        }

        // Check if provider name already exists
        const existing = await prisma.aIProvider.findUnique({
            where: { name },
        });

        if (existing) {
            return NextResponse.json(
                { error: `Provider "${name}" already exists` },
                { status: 409 }
            );
        }

        const provider = await prisma.aIProvider.create({
            data: {
                name,
                displayName,
                apiKey: apiKey || null,
                baseUrl: baseUrl || null,
                isEnabled,
                sortOrder,
            },
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
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating AI provider:', error);
        return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
    }
}
