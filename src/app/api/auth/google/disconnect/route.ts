import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/google/disconnect
 * 
 * Disconnect Google Drive by clearing the user's Google OAuth tokens
 */
export async function GET(request: NextRequest) {
    try {
        const { user } = await withAuth();

        if (!user) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        // Look up database user
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
        });

        if (!dbUser) {
            console.error('[Google Disconnect] User not found in database');
            return NextResponse.redirect(new URL('/john-gpt', request.url));
        }

        // Clear Google Drive tokens
        await prisma.user.update({
            where: { id: dbUser.id },
            data: {
                googleDriveConfig: {
                    delete: true,
                },
            },
        });

        console.log('[Google Disconnect] Successfully disconnected Google Drive for user:', user.email);

        // Redirect back to JohnGPT
        return NextResponse.redirect(new URL('/john-gpt', request.url));
    } catch (error) {
        console.error('[Google Disconnect] Error:', error);

        // Redirect to JohnGPT even on error
        return NextResponse.redirect(new URL('/john-gpt', request.url));
    }
}
