import { withAuth, getSignInUrl, getSignUpUrl } from '@workos-inc/authkit-nextjs';
import { JohnGPTPage } from '@/features/john-gpt/components/JohnGPTPage';
import { prisma } from '@/lib/prisma';

export default async function ConversationPage({
    params,
}: {
    params: Promise<{ conversationId: string }>;
}) {
    const { user } = await withAuth();
    const { conversationId } = await params;

    let isDriveConnected = false;

    if (user) {
        const dbUser = await prisma.user.findUnique({
            where: { workosId: user.id },
            include: { googleDriveConfig: true },
        });
        isDriveConnected = !!dbUser?.googleDriveConfig?.accessToken;
    }

    const signInUrl = await getSignInUrl();
    const signUpUrl = await getSignUpUrl();

    return <JohnGPTPage user={user} isDriveConnected={isDriveConnected} signInUrl={signInUrl} signUpUrl={signUpUrl} conversationId={conversationId} />;
}
