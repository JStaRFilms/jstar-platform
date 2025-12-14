import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

const redirectUri = process.env.WORKOS_REDIRECT_URI;
if (!redirectUri) {
    throw new Error('WORKOS_REDIRECT_URI environment variable is required');
}

export default authkitMiddleware({ redirectUri });

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
