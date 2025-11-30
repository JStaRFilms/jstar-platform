import { NextRequest, NextResponse } from 'next/server';
import { googleDriveService } from '@/lib/google-drive';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET(req: NextRequest) {
    const { user } = await withAuth();

    if (!user) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL('/john-gpt?error=drive_auth_failed', req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/john-gpt?error=no_code', req.url));
    }

    try {
        await googleDriveService.handleCallback(code, user.id);
        return NextResponse.redirect(new URL('/john-gpt?success=drive_connected', req.url));
    } catch (err) {
        console.error('Error handling Google callback:', err);
        return NextResponse.redirect(new URL('/john-gpt?error=drive_connection_error', req.url));
    }
}
