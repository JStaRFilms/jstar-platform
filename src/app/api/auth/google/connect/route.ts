import { NextRequest, NextResponse } from 'next/server';
import { googleDriveService } from '@/lib/google-drive';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = googleDriveService.generateAuthUrl();
    return NextResponse.redirect(url);
}
