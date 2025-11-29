import { handleAuth } from '@workos-inc/authkit-nextjs';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    // Extract the state parameter (contains the original URL)
    const state = request.nextUrl.searchParams.get('state');
    const returnPath = state ? decodeURIComponent(state) : '/';

    return handleAuth({
        onSuccess: async (auth) => {
            if (!auth.user) return;

            const { id, email, firstName, lastName, profilePictureUrl } = auth.user;
            const name = [firstName, lastName].filter(Boolean).join(' ');

            // Sync user to database
            await prisma.user.upsert({
                where: { email },
                update: {
                    workosId: id,
                    picture: profilePictureUrl,
                    name: name || undefined,
                    // Keep existing tier
                },
                create: {
                    email,
                    workosId: id,
                    picture: profilePictureUrl,
                    name: name || undefined,
                    tier: 'TIER1', // Default tier for new signups (free tier)
                },
            });
        },
        // Redirect user back to where they started
        returnPathname: returnPath,
    })(request);
}
