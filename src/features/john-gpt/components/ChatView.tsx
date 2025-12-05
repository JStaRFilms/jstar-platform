'use client';

import React, { useEffect } from 'react';
import { useBranchingChat } from '../hooks/useBranchingChat';
import { syncManager } from '@/lib/storage/sync-manager';
import { useConversationPersistence } from '../hooks/useConversationPersistence';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { EmptyState } from './EmptyState';
import { Loader2, Sparkles } from 'lucide-react';
import type { User as WorkOSUser } from '@workos-inc/node';
import { cn } from '@/lib/utils';
import { useConversationManagement } from '../hooks/useConversationManagement';
import { useRouter } from 'next/navigation';
import { ChatHeader } from './ChatHeader';
import { useActiveChat } from '../context/ActiveChatContext';
import { useChatActions } from '../context/ChatActionContext';

type ChatViewProps = {
    user: WorkOSUser;
    className?: string;
    conversationId?: string;
    importSessionId?: string | null;
    onMobileMenuClick?: () => void;
};

/**
 * ChatView Component
 * 
 * Main container for the JohnGPT chat interface
 * Manages conversation flow and message display
 */
export function ChatView({ user, className, conversationId: conversationIdProp, importSessionId, onMobileMenuClick }: ChatViewProps) {
    const router = useRouter();
    const { deactivateFollowMe, isFollowMeActive } = useActiveChat();

    // Track if this is the initial mount (arriving at page, not button click from same page)
    const hasCheckedFollowMeRef = React.useRef(false);

    // Clear follow-me state ONLY on initial mount when arriving at the page
    // This prevents the race condition where minimize button sets follow-me,
    // but then this effect immediately clears it before navigation completes
    useEffect(() => {
        // Only check once on mount - if we're arriving at the full JohnGPT page
        // and follow-me WAS active from a previous session (localStorage), clear it
        if (!hasCheckedFollowMeRef.current) {
            hasCheckedFollowMeRef.current = true;

            // Small delay to allow navigation to complete first
            const timeoutId = setTimeout(() => {
                if (isFollowMeActive) {
                    console.log('[ChatView] Clearing follow-me state - arrived at full JohnGPT page');
                    deactivateFollowMe();
                }
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, []); // Empty deps - only run on mount

    // Internal conversation ID state - generate on first message if not provided
    const [internalConversationId, setInternalConversationId] = React.useState<string | undefined>(conversationIdProp);

    // Update internal ID when prop changes (e.g., navigating to existing conversation)
    React.useEffect(() => {
        if (conversationIdProp) {
            setInternalConversationId(conversationIdProp);
        }
    }, [conversationIdProp]);

    // Hooks
    const {
        conversationIdRef,
        deduplicateMessages,
    } = useConversationManagement(conversationIdProp);

    const {
        loadConversation,
        isLoading: isLoadingConversation,
        syncStatus,
    } = useConversationPersistence(user.id, internalConversationId);

    // Local state
    const [input, setInput] = React.useState('');
    const messagesRef = React.useRef<any[]>([]);

    // Get scrollToSection from ChatActionContext
    const { scrollToSection } = useChatActions();

    // Initialize useChat with persistence
    const { messages, sendMessage, status, stop, setMessages, addToolResult, editMessage, navigateBranch, currentMode } = useBranchingChat({
        api: '/api/chat',
        conversationId: internalConversationId, // Use internal state
        userId: user.id, // User ID for storage
        scrollToSection, // Pass scrollToSection for spotlight feature
        // Context is now auto-detected server-side from the Referer header
    });

    // Load conversation on mount if conversationId exists
    useEffect(() => {
        if (!internalConversationId || messages.length > 0 || importSessionId) return;

        const loadExistingConversation = async () => {
            try {
                const conversation = await loadConversation(internalConversationId);

                if (conversation && conversation.messages.length > 0) {
                    // Hydrate messages into chat
                    setMessages(conversation.messages as any);
                    console.log('[ChatView] Loaded conversation:', internalConversationId, conversation.messages.length, 'messages');
                }
            } catch (error) {
                console.error('[ChatView] Failed to load conversation:', error);
            }
        };

        loadExistingConversation();
    }, [internalConversationId, loadConversation, setMessages, messages.length, importSessionId]);

    // Handle Import Session Logic
    const [isImportBannerVisible, setIsImportBannerVisible] = React.useState(false);

    useEffect(() => {
        if (!importSessionId || messages.length > 0) return;

        const loadImportSession = async () => {
            try {
                console.log('[ChatView] Importing session:', importSessionId);
                const session = await syncManager.loadConversation(importSessionId, { isWidget: true });

                if (session && session.messages.length > 0) {
                    setMessages(session.messages as any);
                    setIsImportBannerVisible(true);
                    console.log('[ChatView] Imported widget session with', session.messages.length, 'messages');
                }
            } catch (error) {
                console.error('[ChatView] Failed to import session:', error);
            }
        };

        loadImportSession();
    }, [importSessionId, setMessages, messages.length]);

    const handlePromoteSession = async () => {
        if (!importSessionId || messages.length === 0) return;

        try {
            // 1. Generate new ID
            const newId = crypto.randomUUID();

            // 2. Use a default title (AI title generation happens on next save)
            const title = "Imported Widget Chat";

            // 3. Save to Neon DB (so it shows in sidebar immediately)
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: newId,
                    title,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to save conversation to database');
            }

            // 4. Save to IndexedDB for offline access
            await syncManager.saveConversation(newId, user.id, title, messages as any);

            // 5. Navigate to new conversation
            router.replace(`/john-gpt/${newId}`);
            setIsImportBannerVisible(false);

        } catch (error) {
            console.error('Promotion failed:', error);
            alert('Failed to save conversation. Please try again.');
        }
    };

    const isLoading = status === 'submitted' || status === 'streaming';


    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');

        // Generate conversation ID on first message (but don't navigate yet)
        let currentConversationId = internalConversationId;
        if (!internalConversationId) {
            const newId = crypto.randomUUID();
            setInternalConversationId(newId);
            currentConversationId = newId;
            console.log('[ChatView] Generated new conversation ID:', newId);
        }

        // Send message first (don't block on navigation)
        await sendMessage({
            role: 'user',
            parts: [{ type: 'text', text: userMessage }],
        });

        // Update URL after message is sent (if we just created a new conversation)
        if (!conversationIdProp && currentConversationId) {
            router.replace(`/john-gpt/${currentConversationId}`);
        }
    };

    const suggestions = [
        "Brainstorm video ideas",
        "Refine my brand voice",
        "Create a content calendar",
        "Biblical perspective on creativity",
    ];

    return (
        <div className={cn("flex flex-col h-full bg-background/50 relative", className)}>
            {/* Header with Mobile Menu & Mode Display */}
            <ChatHeader
                onMobileMenuClick={onMobileMenuClick}
                messages={messages as any}
                currentMode={currentMode}
                conversationId={internalConversationId}
                userId={user.id}
            />
            {/* Import Banner */}
            {isImportBannerVisible && (
                <div className="bg-blue-600/10 border-b border-blue-600/20 p-4 backdrop-blur-md">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-blue-100">Widget Session Detected</h3>
                                <p className="text-xs text-blue-200/80">Save this chat to your history to keep it forever.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push('/john-gpt')}
                                className="px-3 py-1.5 text-xs font-medium text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handlePromoteSession}
                                className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
                            >
                                Save to History
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto pt-4 pb-4 px-0 scroll-smooth min-h-0"
            >
                <div className="max-w-5xl mx-auto space-y-6 h-full">
                    {messages.length === 0 ? (
                        <EmptyState
                            suggestions={suggestions}
                            onSuggestionClick={(text: string) => setInput(text)}
                            user={user}
                        />
                    ) : (
                        <ChatMessages
                            messages={messages}
                            isLoading={isLoading}
                            user={user}
                            onEdit={editMessage}
                            onNavigateBranch={navigateBranch}
                        />
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-background/60 backdrop-blur-xl border-t border-border/40 transition-all duration-300">
                <div className="max-w-5xl mx-auto">
                    <ChatInput
                        input={input}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        stop={stop}
                    />
                    <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-60 hover:opacity-100 transition-opacity">
                        JohnGPT can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
