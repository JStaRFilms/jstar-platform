'use client';

import React from 'react';
import { BrainIcon } from '@/components/ui/BrainIcon';
import Link from 'next/link';
import type { User as WorkOSUser } from '@workos-inc/node';
import { ConversationSidebar } from './ConversationSidebar';
import { ChatView } from './ChatView';
import { MobileSidebar } from './MobileSidebar';

type JohnGPTPageProps = {
    user: WorkOSUser | null;
    isDriveConnected: boolean;
    signInUrl: string;
    signUpUrl: string;
    conversationId?: string; // NEW: Optional conversation ID from URL
};

/**
 * JohnGPT Main Page Component
 * 
 * Handles tier-based access control and renders appropriate view:
 * - GUEST: Signup prompt with clear messaging
 * - TIER1+: Full JohnGPT interface
 */
export function JohnGPTPage({ user, isDriveConnected, signInUrl, signUpUrl, conversationId }: JohnGPTPageProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // If no user, show signup prompt (not a generic error!)
    if (!user) {
        return (
            <div className="flex h-full items-center justify-center p-6 bg-background relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent-purple/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-md text-center space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue to-accent-purple blur-xl opacity-30 animate-pulse" />
                            <BrainIcon size={80} className="text-foreground relative z-10" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">JohnGPT</span>
                        </h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Experience the full power of AI. Sign up to save your conversations, access advanced modes, and sync with Google Drive.
                        </p>
                    </div>

                    <div className="space-y-4 pt-2">
                        <Link
                            href={signUpUrl}
                            className="group relative block w-full overflow-hidden rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple p-[1px] transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                        >
                            <div className="relative flex items-center justify-center rounded-xl bg-background/10 backdrop-blur-sm px-6 py-3.5 transition-all group-hover:bg-transparent">
                                <span className="font-semibold text-white">Sign Up for Free</span>
                            </div>
                        </Link>

                        <Link
                            href={signInUrl}
                            className="block w-full px-6 py-3.5 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/50 text-foreground font-medium transition-colors backdrop-blur-sm"
                        >
                            Already have an account? Sign In
                        </Link>
                    </div>

                    <p className="text-sm text-muted-foreground/60 pt-4">
                        Just want to chat?{' '}
                        <span className="text-foreground/80 font-medium">
                            Use the floating button on any page
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    // Authenticated user - show full interface
    return (
        <div className="flex h-full bg-background relative overflow-hidden">
            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                isDriveConnected={isDriveConnected}
                activeConversationId={conversationId}
            />

            {/* Sidebar - Desktop only */}
            <aside className="hidden md:flex w-72 flex-col border-r border-border shrink-0">
                <ConversationSidebar
                    user={user}
                    isDriveConnected={isDriveConnected}
                    activeConversationId={conversationId}
                    className="w-full"
                />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col bg-background min-w-0 h-full relative">
                <div className="flex-1 relative h-full overflow-hidden">
                    <ChatView
                        user={user}
                        conversationId={conversationId}
                        className="w-full h-full absolute inset-0"
                        onMobileMenuClick={() => setIsSidebarOpen(true)}
                    />
                </div>
            </main>
        </div>
    );
}
