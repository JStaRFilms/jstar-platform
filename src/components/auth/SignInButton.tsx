import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import Link from 'next/link';

export async function SignInButton() {
    const signInUrl = await getSignInUrl();

    return (
        <Link
            href={signInUrl}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
            Sign In
        </Link>
    );
}
