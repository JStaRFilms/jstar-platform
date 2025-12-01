'use client';

import React from 'react';
import { Lock } from 'lucide-react';
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
            <div className="flex h-full items-center justify-center p-6 bg-background">
                <div className="max-w-md text-center space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                        <Lock className="w-10 h-10 text-white" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            Sign Up to Save Your Chats
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Create a free account to access the full JohnGPT interface, save your conversations to Google Drive, and unlock advanced AI features.
                        </p>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Link
                            href={signUpUrl}
                            className="block w-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Sign Up for Free
                        </Link>
                        <Link
                            href={signInUrl}
                            className="block w-full bg-muted border border-border text-foreground font-medium px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                        >
                            Already have an account? Sign In
                        </Link>
                    </div>

                    <p className="text-sm text-muted-foreground pt-4">
                        Want to try the quick chat?{' '}
                        <span className="text-accent-purple">
                            Use the floating JohnGPT button on any page
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
