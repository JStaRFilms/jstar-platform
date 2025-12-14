import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '@/features/john-gpt/services/conversation.service';
import { CreateConversationSchema } from '@/features/john-gpt/schema';
import { z } from 'zod';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({ where: { workosId: user.id } });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const conversations = await ConversationService.listConversations(dbUser.id);
        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Failed to list conversations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        // Allow ID to be passed in body for client-side generation
        const data = CreateConversationSchema.extend({ id: z.string().optional() }).parse(body);

        const dbUser = await prisma.user.findUnique({ where: { workosId: user.id } });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const conversation = await ConversationService.createConversation(dbUser.id, data);
        return NextResponse.json(conversation);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation Error', details: (error as any).errors || (error as any).issues }, { status: 400 });
        }
        console.error('Failed to create conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
