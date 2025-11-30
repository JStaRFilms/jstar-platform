'use client';

import React, { useState } from 'react';
import {
    MessageSquare,
    Search,
    Plus,
    MoreHorizontal,
    Trash2,
    Edit2,
    LogOut,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { User as WorkOSUser } from '@workos-inc/node';

import { chatStorage, Conversation as StoredConversation } from '@/lib/chat-storage';

type Conversation = {
    id: string;
    title: string;
    date: string; // ISO date string
    preview: string;
};

type ConversationSidebarProps = {
    user: WorkOSUser;
    isDriveConnected: boolean;
    className?: string;
    activeConversationId?: string; // Highlight active conversation
};

export function ConversationSidebar({ user, isDriveConnected, className, activeConversationId }: ConversationSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);

    // Fetch conversations on mount
    React.useEffect(() => {
        async function loadConversations() {
            const stored = await chatStorage.getAllConversations();
            const formatted = stored.map(c => {
                // Find last text message for preview
                const lastMsg = [...c.messages].reverse().find(m =>
                    m.parts?.some(p => p.type === 'text')
                );
                let preview = 'No messages';
                if (lastMsg) {
                    const textPart = lastMsg.parts.find(p => p.type === 'text');
                    if (textPart && textPart.type === 'text') {
                        preview = textPart.text.slice(0, 60) + '...';
                    }
                }

                return {
                    id: c.id,
                    title: c.title,
                    date: new Date(c.updatedAt).toISOString(),
                    preview
                };
            });
            // Sort by date desc
            setConversations(formatted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
        loadConversations();

        // Refresh every 5 seconds to catch updates (simple polling)
        const interval = setInterval(loadConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    // Group conversations by date (Today, Yesterday, Previous 7 Days, Older)
    const groupedConversations = React.useMemo(() => {
        const groups: Record<string, Conversation[]> = {
            'Today': [],
            'Yesterday': [],
            'Previous 7 Days': [],
            'Older': []
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterday = today - 86400000;
        const lastWeek = today - 604800000;

        conversations.forEach(conv => {
            const convDate = new Date(conv.date).getTime();

            if (convDate >= today) {
                groups['Today'].push(conv);
            } else if (convDate >= yesterday) {
                groups['Yesterday'].push(conv);
            } else if (convDate >= lastWeek) {
                groups['Previous 7 Days'].push(conv);
            } else {
                groups['Older'].push(conv);
            }
        });

        return groups;
    }, [conversations]);

    const filteredGroups = React.useMemo(() => {
        if (!searchQuery) return groupedConversations;

        const filtered: Record<string, Conversation[]> = {};
        Object.entries(groupedConversations).forEach(([key, group]) => {
            const matches = group.filter(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.preview.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matches.length > 0) {
                filtered[key] = matches;
            }
        });
        return filtered;
    }, [groupedConversations, searchQuery]);

    return (
        <div className={cn("flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border", className)}>
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="font-bold text-white text-xs">JG</span>
                        </div>
                        <span className="font-semibold text-lg text-foreground tracking-tight">JOHNGPT</span>
                    </div>

                    {/* Home Button */}
                    {/* Home Button */}
                    <Link
                        href="/"
                        className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors"
                        title="Back to Website"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">New Chat</span>
                </button>
            </div>

            {/* Drive Connection Status */}
            {!isDriveConnected ? (
                <div className="px-4 pt-4">
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2 font-medium">
                            Sync with Google Drive
                        </p>
                        <button
                            onClick={() => window.location.href = '/api/auth/google/connect'}
                            className="w-full py-1.5 bg-background hover:bg-accent text-foreground border border-border text-xs font-medium rounded-lg transition-colors"
                        >
                            Connect Drive
                        </button>
                    </div>
                </div>
            ) : (
                <div className="px-4 pt-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Google Drive Connected
                        </p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="px-4 pt-4 pb-2">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary/50 hover:bg-secondary/70 focus:bg-background border border-transparent focus:border-primary/50 rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6 custom-scrollbar">
                {Object.entries(filteredGroups).map(([groupName, groupConversations]) => (
                    groupConversations.length > 0 && (
                        <div key={groupName}>
                            <div className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-70">
                                {groupName}
                            </div>
                            <div className="space-y-0.5">
                                {groupConversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/50 cursor-pointer transition-all border border-transparent hover:border-border/50"
                                    >
                                        <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground">
                                                {conv.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80">
                                                {conv.preview}
                                            </div>
                                        </div>
                                        {/* Hover Actions */}
                                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                            <button className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Rename">
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}

                {Object.values(filteredGroups).every(g => g.length === 0) && (
                    <div className="text-center py-12 px-4">
                        <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                            <Search className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No conversations found</p>
                    </div>
                )}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-border bg-background/30">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 cursor-pointer transition-colors border border-transparent hover:border-border/50">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center font-bold text-sm text-foreground overflow-hidden ring-2 ring-background shadow-sm">
                        {user.profilePictureUrl ? (
                            <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user.firstName?.[0] || user.email[0].toUpperCase()}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
}
