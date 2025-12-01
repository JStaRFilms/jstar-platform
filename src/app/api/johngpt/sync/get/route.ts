import { NextRequest, NextResponse } from 'next/server';
import { googleDriveService } from '@/lib/google-drive';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');

    if (!fileId) {
        return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    try {
        // Get internal user ID
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const content = await googleDriveService.getConversationContent(dbUser.id, fileId);
        return NextResponse.json(content);
    } catch (error) {
        console.error('Error getting Drive file:', error);
        return NextResponse.json({ error: 'Failed to get file' }, { status: 500 });
    }
}
