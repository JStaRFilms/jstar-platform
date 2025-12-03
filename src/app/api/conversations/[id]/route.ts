import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@workos-inc/authkit-nextjs';

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
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
    let conversationId = 'unknown';
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

        // Await params (Next.js 15 requirement)
        const params = await context.params;
        conversationId = params.id;

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
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
        console.error(`[GET /api/conversations/${conversationId}] Error:`, error);
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
    let conversationId = 'unknown';
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

        // Await params (Next.js 15 requirement)
        const params = await context.params;
        conversationId = params.id;

        // Delete conversation (only if user owns it)
        const deleted = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
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
        console.error(`[DELETE /api/conversations/${conversationId}] Error:`, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
