import { getSignInUrl, signOut } from '@workos-inc/authkit-nextjs';
import Link from 'next/link';

interface UserButtonProps {
    user: {
        firstName: string | null;
        lastName: string | null;
        profilePictureUrl: string | null;
    };
}

export async function UserButton({ user }: UserButtonProps) {
    const signOutUrl = await getSignInUrl(); // WorkOS doesn't have a direct signOutUrl helper in all versions, but we can use a server action or just a link to a logout route if we make one. 
    // Actually, authkit-nextjs provides a signOut function but it's for server actions.
    // Let's create a simple form for sign out.

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {user.profilePictureUrl && (
                    <img
                        src={user.profilePictureUrl}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                    />
                )}
                <span className="text-sm font-medium">
                    {user.firstName}
                </span>
            </div>
            <form
                action={async () => {
                    'use server';
                    await signOut();
                }}
            >
                <button
                    type="submit"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    Sign Out
                </button>
            </form>
        </div>
    );
}
