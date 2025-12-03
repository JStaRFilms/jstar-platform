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
    conversationId?: string;
};

export function JohnGPTPage({ user, isDriveConnected, signInUrl, signUpUrl, conversationId }: JohnGPTPageProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // If no user, show signup prompt
    if (!user) {
        return (
            <div className="flex h-full items-center justify-center p-6 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
                }}>
                {/* Animated Background Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: '6s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="max-w-lg w-full space-y-8 relative z-10 px-6 py-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
                    style={{
                        animation: 'fadeIn 0.8s ease-out, scaleIn 0.8s ease-out'
                    }}>
                    {/* Brain Icon with Glow */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
                            <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl">
                                <BrainIcon size={64} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-5xl font-bold tracking-tight leading-tight">
                            Unlock{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                                JohnGPT
                            </span>
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                            Experience the full power of AI. Save conversations, access advanced modes, and sync with Google Drive.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-3 gap-4 py-4">
                        {['💾 Auto-Save', '🧠 Smart AI', '☁️ Cloud Sync'].map((feature, i) => (
                            <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <div className="text-sm font-medium text-gray-200">{feature}</div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        <Link
                            href={signUpUrl}
                            className="group relative block w-full overflow-hidden rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                            <div className="relative flex items-center justify-center px-8 py-4">
                                <span className="font-bold text-white text-lg tracking-wide">Sign Up for Free →</span>
                            </div>
                        </Link>

                        <Link
                            href={signInUrl}
                            className="block w-full px-8 py-4 rounded-xl border-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white font-semibold transition-all text-center backdrop-blur-sm"
                        >
                            Already have an account? Sign In
                        </Link>
                    </div>

                    {/* Footer Note */}
                    <p className="text-sm text-gray-400 text-center pt-2">
                        Just want to chat?{' '}
                        <span className="text-blue-400 font-semibold">
                            Use the floating button on any page
                        </span>
                    </p>
                </div>

                {/* Inline Keyframes */}
                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes scaleIn {
                        from { transform: scale(0.95); }
                        to { transform: scale(1); }
                    }
                    @keyframes gradient {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    .animate-gradient {
                        background-size: 200% 200%;
                        animation: gradient 3s ease infinite;
                    }
                `}</style>
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
