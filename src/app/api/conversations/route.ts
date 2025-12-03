import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { Prisma } from '@prisma/client';

/**
 * POST /api/conversations
 * 
 * Save conversation metadata to Neon DB
 * (Full conversation content stored in Google Drive via client)
 */
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { conversationId, title, driveFileId, driveVersion } = body;

        if (!conversationId) {
            return NextResponse.json(
                { error: 'conversationId is required' },
                { status: 400 }
            );
        }

        // Upsert conversation metadata (use dbUser.id, not user.id)
        const conversation = await prisma.conversation.upsert({
            where: {
                id: conversationId,
            },
            create: {
                id: conversationId,
                userId: dbUser.id, // Use internal database user ID
                title: title || 'New Chat',
                driveFileId: driveFileId || null,
                driveVersion: driveVersion || 1,
                messages: Prisma.DbNull, // Full content in Drive, not DB
            },
            update: {
                title: title,
                driveFileId: driveFileId,
                driveVersion: driveVersion,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            conversation: {
                id: conversation.id,
                title: conversation.title,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                driveFileId: conversation.driveFileId,
            },
        });
    } catch (error) {
        console.error('[POST /api/conversations] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/conversations
 * 
 * List all conversations for current user (metadata only)
 * Used for sidebar conversation list
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

        // Get all conversations for user, ordered by most recent
        const conversations = await prisma.conversation.findMany({
            where: {
                userId: dbUser.id, // Use internal database user ID
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                driveFileId: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return NextResponse.json({
            conversations,
            count: conversations.length,
        });
    } catch (error) {
        console.error('[GET /api/conversations] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
