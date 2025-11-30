import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { GoogleDriveService } from '@/lib/google-drive';

export async function POST(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { fileId } = await req.json();

        if (!fileId) {
            return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
        }

        const driveService = new GoogleDriveService();
        await driveService.deleteFile(user.id, fileId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting file from Drive:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}
