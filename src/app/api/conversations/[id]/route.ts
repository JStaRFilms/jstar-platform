import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@workos-inc/authkit-nextjs';

type RouteContext = {
    params: {
        id: string;
    };
};

/**
 * GET /api/conversations/[id]
 * 
 * Get conversation metadata by ID
 */
export async function GET(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { user } = await withAuth();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Look up the database user by WorkOS ID
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found in database' },
                { status: 404 }
            );
        }

        const { id } = context.params;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id,
                userId: dbUser.id, // Ensure user owns this conversation
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                driveFileId: true,
                driveVersion: true,
            },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ conversation });
    } catch (error) {
        console.error(`[GET /api/conversations/${context.params.id}] Error:`, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/conversations/[id]
 * 
 * Delete conversation metadata from DB
 * (Client is responsible for deleting from Google Drive)
 */
export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const { user } = await withAuth();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Look up the database user by WorkOS ID
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found in database' },
                { status: 404 }
            );
        }

        const { id } = context.params;

        // Delete conversation (only if user owns it)
        const deleted = await prisma.conversation.deleteMany({
            where: {
                id,
                userId: dbUser.id, // Use internal database user ID
            },
        });

        if (deleted.count === 0) {
            return NextResponse.json(
                { error: 'Conversation not found or unauthorized' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Conversation deleted',
        });
    } catch (error) {
        console.error(`[DELETE /api/conversations/${context.params.id}] Error:`, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
