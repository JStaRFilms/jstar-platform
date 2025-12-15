'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    MessageSquare,
    Search,
    Plus,
    MoreHorizontal,
    Trash2,
    Edit2,
    LogOut,
    Home,
    Sun,
    Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { User as WorkOSUser } from '@workos-inc/node';
import { dbSyncManager } from '@/lib/storage/db-sync-manager';

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
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize theme
    React.useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            // Default to dark if no preference
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Initialize DB & Fetch conversations
    useEffect(() => {
        dbSyncManager.initialize(user.id);

        const fetchConversations = async () => {
            try {
                // Use DB Sync Manager (Fast + Offline)
                const cachedDocs = await dbSyncManager.listConversations(user.id);

                // Transform response
                const transformed = cachedDocs.map((conv) => ({
                    id: conv.conversationId,
                    title: conv.title || 'New Chat',
                    date: conv.updatedAt,
                    preview: conv.title || 'No preview',
                }));

                // Sort by date desc (if not already)
                transformed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setConversations(transformed);
            } catch (error) {
                console.error('[ConversationSidebar] Failed to load conversations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Initial fetch
        fetchConversations();

        // Subscribe to ANY list changes (Created, Saved, Deleted)
        const unsubscribe = dbSyncManager.onListChange(() => {
            console.log('[ConversationSidebar] List changed, refreshing...');
            fetchConversations();
        });

        return () => {
            unsubscribe();
        };
    }, [user.id]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
    };


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

    // Handle new chat
    const handleNewChat = () => {
        router.push('/john-gpt');
    };

    // Handle conversation click
    const handleConversationClick = (convId: string) => {
        router.push(`/john-gpt/${convId}`);
    };

    // Handle edit
    const handleStartEdit = (e: React.MouseEvent, conv: Conversation) => {
        e.stopPropagation();
        setEditingId(conv.id);
        setEditTitle(conv.title);
    };

    // Handle delete
    const handleDeleteClick = (e: React.MouseEvent, convId: string) => {
        e.stopPropagation();
        setDeletingId(convId);
    };

    const handleSaveEdit = async (e: React.FormEvent, convId: string) => {
        e.preventDefault();
        if (!editTitle.trim()) return;

        // Storage logic removed - placeholder for new implementation
        // TODO: Implement rename via DB Sync Manager if supported
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    const handleConfirmDelete = async () => {
        if (!deletingId) return;

        try {
            // Use DB Sync Manager to delete (Handles Local + API + Drive)
            await dbSyncManager.deleteConversation(deletingId);

            console.log('[ConversationSidebar] Deleted conversation:', deletingId);
        } catch (error) {
            console.error('[ConversationSidebar] Delete failed:', error);
        } finally {
            setDeletingId(null);

            // If deleting active conversation, navigate home
            if (deletingId === activeConversationId) {
                router.push('/john-gpt');
            }
        }
    };

    const handleCancelDelete = () => {
        setDeletingId(null);
    };

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
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">New Chat</span>
                </button>
            </div>

            {/* Google Drive sync disabled - not currently used */}
            {/* {!isDriveConnected ? (
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
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    Google Drive Connected
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('Disconnect from Google Drive? You can reconnect anytime.')) {
                                    window.location.href = '/api/auth/google/disconnect';
                                }
                            }}
                            className="w-full py-1.5 bg-background hover:bg-red-500/10 text-muted-foreground hover:text-red-600 border border-border hover:border-red-500/50 text-xs font-medium rounded-lg transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                </div>
            )} */}

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
                {isLoading ? (
                    <div className="text-center py-12 px-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Loading conversations...</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">No conversations yet</p>
                        <p className="text-xs text-muted-foreground">Start a new chat to get going!</p>
                    </div>
                ) : Object.entries(filteredGroups).map(([groupName, groupConversations]) => (
                    groupConversations.length > 0 && (
                        <div key={groupName}>
                            <div className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-70">
                                {groupName}
                            </div>
                            <div className="space-y-0.5">
                                {groupConversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        onClick={() => handleConversationClick(conv.id)}
                                        className={cn(
                                            "group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/50 cursor-pointer transition-all border",
                                            activeConversationId === conv.id
                                                ? "bg-accent/70 border-primary/50"
                                                : "border-transparent hover:border-border/50"
                                        )}
                                    >
                                        <MessageSquare className={cn(
                                            "w-4 h-4 shrink-0 transition-colors",
                                            activeConversationId === conv.id
                                                ? "text-primary"
                                                : "text-muted-foreground group-hover:text-primary"
                                        )} />
                                        <div className="flex-1 min-w-0">
                                            {editingId === conv.id ? (
                                                <form onSubmit={(e) => handleSaveEdit(e, conv.id)} onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        onBlur={(e) => handleSaveEdit(e as any, conv.id)}
                                                        onKeyDown={(e) => e.key === 'Escape' && handleCancelEdit()}
                                                        className="w-full text-sm font-medium bg-background border border-primary rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                        autoFocus
                                                    />
                                                </form>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground">
                                                        {conv.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80">
                                                        {conv.preview}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {/* Hover Actions */}
                                        {editingId !== conv.id && (
                                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                                                <button
                                                    onClick={(e) => handleStartEdit(e, conv)}
                                                    className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                                    title="Rename"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, conv.id)}
                                                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
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

            {/* User Profile & Theme Toggle */}
            <div className="p-4 border-t border-border bg-background/30">
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 cursor-pointer transition-colors border border-transparent hover:border-border/50">
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
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border/50"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <Moon className="w-5 h-5" />
                        ) : (
                            <Sun className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Delete Conversation?</h3>
                                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6">
                            This will permanently delete the conversation and all its messages from both local storage and Google Drive.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
