import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '@/features/john-gpt/services/conversation.service';
import { UpdateConversationSchema } from '@/features/john-gpt/schema';
import { z } from 'zod';
import {
    getAuthenticatedUser,
    unauthorizedResponse,
    notFoundResponse,
    forbiddenResponse
} from '@/lib/user-auth';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const authResult = await getAuthenticatedUser();
    const { id } = await props.params;

    if (!authResult) {
        return unauthorizedResponse();
    }

    const { internalUser } = authResult;

    try {
        const conversation = await ConversationService.getConversation(id, internalUser.id);

        if (!conversation) {
            return notFoundResponse('Conversation');
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
    const authResult = await getAuthenticatedUser();
    const { id } = await props.params;

    if (!authResult) {
        return unauthorizedResponse();
    }

    const { internalUser } = authResult;

    try {
        const body = await req.json();
        const data = UpdateConversationSchema.parse(body);

        const conversation = await ConversationService.updateConversation(id, internalUser.id, data);
        return NextResponse.json(conversation);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('[API] Zod validation error:', JSON.stringify(error.issues, null, 2));
            return NextResponse.json({ error: 'Validation Error', details: error.issues }, { status: 400 });
        }
        // Handle Prisma "Record not found" error - could be 404 (not exists) or 403 (wrong owner)
        // Since our WHERE clause includes userId, P2025 means either the conversation doesn't exist
        // or it belongs to a different user. We return 403 to be safe (assumes ID is valid format).
        if ((error as any)?.code === 'P2025') {
            return forbiddenResponse('Conversation not found or access denied');
        }
        console.error('Failed to update conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const authResult = await getAuthenticatedUser();
    const { id } = await props.params;

    if (!authResult) {
        return unauthorizedResponse();
    }

    const { internalUser } = authResult;

    try {
        await ConversationService.deleteConversation(id, internalUser.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        // Handle Prisma "Record not found" error - could be 404 or 403
        // Since our WHERE clause includes userId, P2025 means either the conversation doesn't exist
        // or it belongs to a different user. We return 403 to be safe.
        if ((error as any)?.code === 'P2025') {
            return forbiddenResponse('Conversation not found or access denied');
        }
        console.error('Failed to delete conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
