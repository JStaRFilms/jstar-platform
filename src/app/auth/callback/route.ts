import { handleAuth } from '@workos-inc/authkit-nextjs';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    // Extract the state parameter (contains the original URL)
    const state = request.nextUrl.searchParams.get('state');
    const returnPath = state ? decodeURIComponent(state) : '/';

    return handleAuth({
        onSuccess: async (auth) => {
            if (!auth.user) {
                console.log('Auth success but no user returned');
                return;
            }

            try {
                const { id, email, firstName, lastName, profilePictureUrl } = auth.user;
                const name = [firstName, lastName].filter(Boolean).join(' ');

                console.log('Syncing user to database:', email);

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
                console.log('User synced successfully');
            } catch (error) {
                console.error('Error syncing user to database:', error);
                // We don't throw here to allow the auth flow to complete, 
                // but the user might not be in our DB.
                // Depending on requirements, we might want to throw or redirect to an error page.
            }
        },
        // Redirect user back to where they started
        returnPathname: returnPath,
    })(request);
}
