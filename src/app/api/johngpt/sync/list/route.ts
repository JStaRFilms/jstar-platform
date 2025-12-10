import { NextRequest, NextResponse } from 'next/server';
import { googleDriveService } from '@/lib/google-drive';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get internal user ID
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const files = await googleDriveService.listConversations(dbUser.id);
        return NextResponse.json(files);
    } catch (error) {
        console.error('Error listing Drive files:', error);
        return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
    }
}
