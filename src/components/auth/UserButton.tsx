import { signOut } from '@workos-inc/authkit-nextjs';
// Link can be added back when needed for navigation

interface UserButtonProps {
    user: {
        firstName: string | null;
        lastName: string | null;
        profilePictureUrl: string | null;
    };
}

export async function UserButton({ user }: UserButtonProps) {
    return (
        <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 group hover:border-white/20">
            <div className="flex items-center gap-2">
                {user.profilePictureUrl ? (
                    <img
                        src={user.profilePictureUrl}
                        alt="Profile"
                        className="h-8 w-8 rounded-full border border-white/10 object-cover"
                    />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-jstar-blue to-faith-purple flex items-center justify-center text-xs font-bold text-white border border-white/10">
                        {user.firstName?.charAt(0) || 'U'}
                    </div>
                )}
                {user.firstName && (
                    <span className="text-sm font-medium hidden sm:block text-foreground group-hover:text-jstar-blue transition-colors">
                        {user.firstName}
                    </span>
                )}
            </div>

            <div className="h-4 w-[1px] bg-white/10 mx-1"></div>

            <form
                action={async () => {
                    'use server';
                    // Build absolute URL for sign out redirect
                    const baseUrl = process.env.WORKOS_REDIRECT_URI?.replace('/auth/callback', '') || 'http://localhost:5782';
                    await signOut({ returnTo: baseUrl });
                }}
            >
                <button
                    type="submit"
                    className="p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-red-500 transition-colors flex items-center justify-center"
                    title="Sign Out"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                </button>
            </form>
        </div>
    );
}
