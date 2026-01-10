import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

const redirectUri = process.env.WORKOS_REDIRECT_URI;
if (!redirectUri) {
    const msg = '[WorkOS Middleware] WORKOS_REDIRECT_URI is not set. Authentication cannot be initialized.';
    if (process.env.NODE_ENV === 'production') {
        // Fail fast in production to avoid exposing protected routes without auth
        throw new Error(msg);
    } else {
        // In development, warn loudly but allow local iteration
        console.warn(msg);
    }
}

const workOsMiddleware = redirectUri ? authkitMiddleware({ redirectUri }) : null;

export default function middleware(request: NextRequest, event: NextFetchEvent) {
    if (!workOsMiddleware) {
        console.warn('[WorkOS Middleware] Auth middleware not active. Skipping.');
        return NextResponse.next();
    }

    return workOsMiddleware(request, event);
}

export const config = {
    matcher: [
        // Exclude static assets and WorkOS auth routes to prevent interference with callbacks
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth(?:/.*)?).*)',
    ],
};
