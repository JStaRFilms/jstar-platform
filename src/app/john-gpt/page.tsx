import { withAuth, getSignInUrl, getSignUpUrl } from '@workos-inc/authkit-nextjs';
// redirect can be added back when needed for tier restrictions
import { JohnGPTPage } from '@/features/john-gpt/components/JohnGPTPage';
import { prisma } from '@/lib/prisma';

/**
 * JohnGPT Full Interface Page
 * 
 * Main route for comprehensive AI assistant features including:
 * - Conversation history
 * - Persona switching
 * - Prompt library
 * - Advanced features (A/B testing, Obsidian export, etc.)
 * 
 * Access: TIER1+ only (guests see signup prompt)
 */
export default async function JohnGPTRoute() {
    const { user } = await withAuth();

    let isDriveConnected = false;

    if (user) {
        try {
            // Find internal user by WorkOS ID
            const dbUser = await prisma.user.findUnique({
                where: { workosId: user.id },
                include: { googleDriveConfig: true },
            });

            isDriveConnected = !!dbUser?.googleDriveConfig?.accessToken;
        } catch (error) {
            // Gracefully handle database connection errors
            // App continues to function with Drive features disabled
            console.error('[JohnGPT] Database connection error:', error);
            // isDriveConnected remains false
        }
    }

    const signInUrl = await getSignInUrl();
    const signUpUrl = await getSignUpUrl();

    // TIER1+ only - guests will see signup prompt in component
    return <JohnGPTPage user={user} isDriveConnected={isDriveConnected} signInUrl={signInUrl} signUpUrl={signUpUrl} />;
}
