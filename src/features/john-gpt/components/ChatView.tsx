'use client';

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { EmptyState } from './EmptyState';
import { Loader2 } from 'lucide-react';
import type { User as WorkOSUser } from '@workos-inc/node';
import { cn } from '@/lib/utils';
import { chatStorage } from '@/lib/chat-storage';
import { useConversationManagement } from '../hooks/useConversationManagement';
import { useRouter } from 'next/navigation';
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

    // Local state
    const [input, setInput] = React.useState('');

    // Initialize useChat with persistence
    const { messages, sendMessage, status, stop, setMessages } = useChat({
        onFinish: async ({ message, messages: finalMessages }) => {
            // Create the ID only if it doesn't exist
            let convId = conversationIdRef.current;
            if (!convId) {
                convId = crypto.randomUUID();
                conversationIdRef.current = convId;
            }

            // Ensure all messages have timestamps and correct structure
            const timestampedMessages = finalMessages.map(msg => ({
                ...msg,
                timestamp: (msg as any).timestamp || Date.now(),
                parts: (msg as any).parts || [{ type: 'text', text: (msg as any).content }]
            }));

            const updatedMessages = deduplicateMessages(timestampedMessages);

            // Generate title
            let title = 'New Conversation';
            const currentConv = await chatStorage.getConversation(convId);
            const msgCount = updatedMessages.length;

            // Keep existing title unless it's "New Conversation" OR we're at the 3rd exchange (re-generate)
            if (currentConv && currentConv.title !== 'New Conversation' && msgCount !== 6) {
                title = currentConv.title;
            } else if (updatedMessages[0]) {
                const firstMessage = updatedMessages[0];
                const textPart = firstMessage.parts?.find((p: any) => p.type === 'text');
                if (textPart && textPart.type === 'text') {
                    title = textPart.text.slice(0, 50);
                }
            }

            // Intelligent title generation (1st and 3rd exchange)
            if (msgCount === 2 || msgCount === 6) {
                try {
                    const res = await fetch('/api/johngpt/generate-title', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: updatedMessages }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.title) title = data.title;
                    }
                } catch (err) {
                    console.error('Failed to generate title:', err);
                }
            }

            // Save conversation FIRST
            await chatStorage.saveConversation({
                id: convId,
                title,
                messages: updatedMessages as any,
                createdAt: currentConv?.createdAt || Date.now(),
                updatedAt: Date.now(),
                personaId: 'default', // Always default now
                syncedToDrive: false,
            });

            // THEN navigate ONLY if we don't have a conversationId in the URL
            if (!conversationId) {
                router.push(`/john-gpt/${convId}`);
            }

            // Background sync
            if (user) {
                chatStorage.syncConversations(user.id);
            }
        },
    });

    const isLoading = status === 'submitted' || status === 'streaming';

    // Load conversation on mount or when conversationId changes
    React.useEffect(() => {
        async function loadConversation() {
            if (conversationId) {
                const conv = await chatStorage.getConversation(conversationId);
                if (conv) {
                    conversationIdRef.current = conv.id;
                    setMessages(deduplicateMessages(conv.messages) as any);
                    return;
                }
            } else {
                // New Chat: Reset to empty state
                conversationIdRef.current = null;
                setMessages([]);
            }

            // Sync on load
            if (user) {
                chatStorage.syncConversations(user.id);
            }
        }
        loadConversation();
    }, [conversationId, user, setMessages, conversationIdRef, deduplicateMessages]);

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
            text: userMessage,
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
                            onEdit={(content) => setInput(content)}
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
