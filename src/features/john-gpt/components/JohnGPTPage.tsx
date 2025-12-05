'use client';

import React from 'react';
import { BrainIcon } from '@/components/ui/BrainIcon';
import Link from 'next/link';
import type { User as WorkOSUser } from '@workos-inc/node';
import { ConversationSidebar } from './ConversationSidebar';
import { ChatView } from './ChatView';
import { MobileSidebar } from './MobileSidebar';
import { useSearchParams } from 'next/navigation';
import { ChatActionProvider } from '../context/ChatActionContext';

type JohnGPTPageProps = {
    user: WorkOSUser | null;
    isDriveConnected: boolean;
    signInUrl: string;
    signUpUrl: string;
    conversationId?: string;
};

export function JohnGPTPage({ user, isDriveConnected, signInUrl, signUpUrl, conversationId }: JohnGPTPageProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const searchParams = useSearchParams();
    const importSessionId = searchParams.get('import');

    // If no user, show signup prompt
    if (!user) {
        return (
            <div className="flex h-full items-center justify-center p-6 bg-gray-900">
                <div className="max-w-lg w-full space-y-8 px-6 py-12 rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
                    {/* Simple Brain Icon */}
                    <div className="flex justify-center">
                        <div className="p-4 rounded-full bg-blue-600">
                            <BrainIcon size={48} className="text-white" />
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-3xl font-bold tracking-tight leading-tight text-white">
                            Unlock JohnGPT
                        </h1>
                        <p className="text-gray-300 text-base leading-relaxed">
                            Experience the full power of AI. Save conversations, access advanced modes, and sync with Google Drive.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-3 gap-3 py-4">
                        {['Auto-Save', 'Smart AI', 'Cloud Sync'].map((feature, i) => (
                            <div key={i} className="text-center p-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-200">
                                {feature}
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        <Link
                            href={signUpUrl}
                            className="block w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition-colors"
                        >
                            Sign Up for Free
                        </Link>

                        <Link
                            href={signInUrl}
                            className="block w-full px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-white font-medium text-center hover:bg-white/10 transition-colors"
                        >
                            Already have an account? Sign In
                        </Link>
                    </div>

                    {/* Footer Note */}
                    <p className="text-sm text-gray-400 text-center pt-2">
                        Just want to chat?{' '}
                        <span className="text-blue-400 font-medium">
                            Use the floating button on any page
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    // Authenticated user - show full interface
    return (
        <ChatActionProvider>
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
                            importSessionId={importSessionId}
                            className="w-full h-full absolute inset-0"
                            onMobileMenuClick={() => setIsSidebarOpen(true)}
                        />
                    </div>
                </main>
            </div>
        </ChatActionProvider>
    );
}
