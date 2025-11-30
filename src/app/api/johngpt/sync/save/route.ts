import { NextRequest, NextResponse } from 'next/server';
import { googleDriveService } from '@/lib/google-drive';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const conversation = await req.json();

        // Get internal user ID
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const fileId = await googleDriveService.saveConversation(dbUser.id, conversation);
        return NextResponse.json({ fileId });
    } catch (error) {
        console.error('Error saving to Drive:', error);
        return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
}
