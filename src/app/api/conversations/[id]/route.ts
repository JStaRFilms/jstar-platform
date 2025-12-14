import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '@/features/john-gpt/services/conversation.service';
import { UpdateConversationSchema } from '@/features/john-gpt/schema';
import { z } from 'zod';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

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

    // Look up internal user ID (matching POST route pattern)
    const internalUser = await prisma.user.findUnique({
        where: { workosId: user.id },
        select: { id: true },
    });

    if (!internalUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        const conversation = await ConversationService.getConversation(id, internalUser.id);

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

    // Look up internal user ID (matching POST route pattern)
    const internalUser = await prisma.user.findUnique({
        where: { workosId: user.id },
        select: { id: true },
    });

    if (!internalUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        const body = await req.json();
        const data = UpdateConversationSchema.parse(body);

        const conversation = await ConversationService.updateConversation(id, internalUser.id, data);
        return NextResponse.json(conversation);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation Error', details: (error as any).errors || (error as any).issues }, { status: 400 });
        }
        // Handle Prisma "Record not found" error - return 404 to trigger POST fallback
        if ((error as any)?.code === 'P2025') {
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

    // Look up internal user ID (matching POST route pattern)
    const internalUser = await prisma.user.findUnique({
        where: { workosId: user.id },
        select: { id: true },
    });

    if (!internalUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        await ConversationService.deleteConversation(id, internalUser.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
