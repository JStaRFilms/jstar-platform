import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { headers } from 'next/headers';
import Link from 'next/link';

export async function SignInButton() {
    // Get current page URL to return user here after sign in
    const headersList = await headers();
    const currentUrl = headersList.get('referer') || '/';

    // Encode current URL in state parameter
    const state = encodeURIComponent(currentUrl);
    const signInUrl = await getSignInUrl({ state });

    return (
        <Link
            href={signInUrl}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jstar-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground backdrop-blur-sm h-9 px-4 hover:border-white/20 dark:hover:border-white/20 hover:shadow-sm"
        >
            Sign In
        </Link>
    );
}
