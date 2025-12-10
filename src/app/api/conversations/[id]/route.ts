import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '@/features/john-gpt/services/conversation.service';
import { UpdateConversationSchema } from '@/features/john-gpt/schema';
import { z } from 'zod';
import { withAuth } from '@workos-inc/authkit-nextjs';

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
        const conversation = await ConversationService.getConversation(id, user.id);

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

        const conversation = await ConversationService.updateConversation(id, user.id, data);
        return NextResponse.json(conversation);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation Error', details: (error as any).errors || (error as any).issues }, { status: 400 });
        }
        // Handle specific Prisma errors like "Record not found" if needed
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
        await ConversationService.deleteConversation(id, user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
