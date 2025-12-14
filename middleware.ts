import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

const redirectUri = process.env.WORKOS_REDIRECT_URI;
const workOsMiddleware = redirectUri ? authkitMiddleware({ redirectUri }) : null;

export default function middleware(request: NextRequest, event: NextFetchEvent) {
    if (!workOsMiddleware) {
        console.warn('[WorkOS Middleware] WORKOS_REDIRECT_URI is not set. Auth is disabled.');
        return NextResponse.next();
    }

    return workOsMiddleware(request, event);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
