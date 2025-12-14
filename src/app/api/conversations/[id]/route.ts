import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '@/features/john-gpt/services/conversation.service';
import { UpdateConversationSchema } from '@/features/john-gpt/schema';
import { z } from 'zod';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const { params } = props;
    const { user } = await withAuth();
    const { id } = await params;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({ where: { workosId: user.id } });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const conversation = await ConversationService.getConversation(id, dbUser.id);

        if (!conversation) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Failed to get conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const { params } = props;
    const { user } = await withAuth();
    const { id } = await params;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const data = UpdateConversationSchema.parse(body);
        const dbUser = await prisma.user.findUnique({ where: { workosId: user.id } });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const conversation = await ConversationService.updateConversation(id, dbUser.id, data);
        return NextResponse.json(conversation);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation Error', details: (error as any).errors || (error as any).issues }, { status: 400 });
        }
        // Map Prisma not-found to 404 so client can create on fallback
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
        if (error instanceof Error && error.message === 'Not Found') {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
        console.error('Failed to update conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const { params } = props;
    const { user } = await withAuth();
    const { id } = await params;

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({ where: { workosId: user.id } });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await ConversationService.deleteConversation(id, dbUser.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === 'Not Found') {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }
        console.error('Failed to delete conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
