import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

// Get the redirect URI at module load time
const redirectUri = process.env.WORKOS_REDIRECT_URI;

// Create the WorkOS middleware if properly configured
const workOsMiddleware = redirectUri
    ? authkitMiddleware({ redirectUri })
    : null;

export default function middleware(request: NextRequest, event: NextFetchEvent) {
    // If WorkOS is not configured, log warning and allow the request through
    if (!workOsMiddleware) {
        console.warn(
            '[WorkOS Middleware] WORKOS_REDIRECT_URI is not set. Auth is disabled.'
        );
        return NextResponse.next();
    }

    return workOsMiddleware(request, event);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * 
         * Note: This covers ALL routes because RootLayout uses withAuth()
         * to display UserButton/SignInButton on every page. The auth check
         * is read-only and does NOT force users to log in.
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
