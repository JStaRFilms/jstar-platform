import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/user/drive-config
 * 
 * Get user's Google Drive OAuth configuration
 */
export async function GET(request: NextRequest) {
    try {
        const { user } = await withAuth();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get userId from query params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId parameter required' },
                { status: 400 }
            );
        }

        // Look up database user
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
            select: {
                googleDriveConfig: true,
            },
        });

        if (!dbUser?.googleDriveConfig) {
            return NextResponse.json(
                { error: 'Google Drive not connected' },
                { status: 404 }
            );
        }

        const config = dbUser.googleDriveConfig as any;

        return NextResponse.json({
            accessToken: config.accessToken,
            refreshToken: config.refreshToken,
            expiresAt: config.expiresAt,
        });
    } catch (error) {
        console.error('[GET /api/user/drive-config] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
