import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '@/features/john-gpt/services/conversation.service';
import { CreateConversationSchema } from '@/features/john-gpt/schema';
import { z } from 'zod';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

async function getOrCreateDbUser(workosId: string, opts?: { email?: string | null; name?: string | null }) {
    const existing = await prisma.user.findUnique({ where: { workosId } });
    if (existing) return existing;
    // Create with best-available metadata; email must be unique, fall back to placeholder if missing
    const email = opts?.email ?? `${workosId}@placeholder.local`;
    return prisma.user.create({
        data: {
            workosId,
            email,
            name: opts?.name ?? undefined,
        },
    });
}

export async function GET(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dbUser = await getOrCreateDbUser(user.id, { email: (user as any).email ?? null, name: (user as any).firstName ?? null });

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
        const dbUser = await getOrCreateDbUser(user.id, { email: (user as any).email ?? null, name: (user as any).firstName ?? null });

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
