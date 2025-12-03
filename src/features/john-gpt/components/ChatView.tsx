'use client';

import React, { useEffect } from 'react';
import { useBranchingChat } from '../hooks/useBranchingChat';
import { useConversationPersistence } from '../hooks/useConversationPersistence';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { EmptyState } from './EmptyState';
import { Loader2 } from 'lucide-react';
import type { User as WorkOSUser } from '@workos-inc/node';
import { cn } from '@/lib/utils';
import { useConversationManagement } from '../hooks/useConversationManagement';
import { useRouter } from 'next/navigation';
import { useToolNavigation } from '../hooks/useToolNavigation';
import { ChatHeader } from './ChatHeader';

type ChatViewProps = {
    user: WorkOSUser;
    className?: string;
    conversationId?: string;
    onMobileMenuClick?: () => void;
};

/**
 * ChatView Component
 * 
 * Main container for the JohnGPT chat interface
 * Manages conversation flow and message display
 */
export function ChatView({ user, className, conversationId, onMobileMenuClick }: ChatViewProps) {
    const router = useRouter();

    // Hooks
    const {
        conversationIdRef,
        deduplicateMessages,
    } = useConversationManagement(conversationId);

    const {
        loadConversation,
        isLoading: isLoadingConversation,
        syncStatus,
    } = useConversationPersistence(conversationId);

    // Local state
    const [input, setInput] = React.useState('');
    const messagesRef = React.useRef<any[]>([]);

    // Initialize useChat with persistence
    const { messages, sendMessage, status, stop, setMessages, addToolResult, editMessage, navigateBranch, currentMode } = useBranchingChat({
        api: '/api/chat',
        conversationId: conversationId, // Enable persistence
        userId: user.id, // User ID for storage
        // Context is now auto-detected server-side from the Referer header
    });

    // Load conversation on mount if conversationId exists
    useEffect(() => {
        if (!conversationId || messages.length > 0) return;

        const loadExistingConversation = async () => {
            try {
                const conversation = await loadConversation(conversationId);

                if (conversation && conversation.messages.length > 0) {
                    // Hydrate messages into chat
                    setMessages(conversation.messages as any);
                    console.log('[ChatView] Loaded conversation:', conversationId, conversation.messages.length, 'messages');
                }
            } catch (error) {
                console.error('[ChatView] Failed to load conversation:', error);
            }
        };

        loadExistingConversation();
    }, [conversationId, loadConversation, setMessages, messages.length]);

    const isLoading = status === 'submitted' || status === 'streaming';

    // Handle tool calls (Navigation)
    useToolNavigation(messages, addToolResult);

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');

        await sendMessage({
            role: 'user',
            parts: [{ type: 'text', text: userMessage }],
        });
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
            />

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
