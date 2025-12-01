'use client';

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { PersonaSelector } from './PersonaSelector';
import { EmptyState } from './EmptyState';
import { Loader2 } from 'lucide-react';
import type { User as WorkOSUser } from '@workos-inc/node';
import { cn } from '@/lib/utils';
import { chatStorage } from '@/lib/chat-storage';
import { usePersonas } from '../hooks/usePersonas';
import { useConversationManagement } from '../hooks/useConversationManagement';
import { useRouter } from 'next/navigation';

type ChatViewProps = {
    user: WorkOSUser;
    className?: string;
    conversationId?: string;
};

/**
 * ChatView Component
 * 
 * Main container for the JohnGPT chat interface
 * Manages conversation flow, persona selection, and message display
 */
export function ChatView({ user, className, conversationId }: ChatViewProps) {
    const router = useRouter();

    // Hooks
    const { personas, activePersona, setActivePersona, isLoadingPersonas } = usePersonas();
    const {
        conversationIdRef,
        deduplicateMessages,
    } = useConversationManagement(conversationId);

    // Local state
    const [isPersonaSelectorOpen, setIsPersonaSelectorOpen] = React.useState(false);
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

            const updatedMessages = deduplicateMessages(finalMessages);

            // Generate title
            let title = 'New Conversation';
            const currentConv = await chatStorage.getConversation(convId);

            if (currentConv && currentConv.title !== 'New Conversation') {
                title = currentConv.title;
            } else if (updatedMessages[0]) {
                const firstMessage = updatedMessages[0];
                const textPart = firstMessage.parts.find((p: any) => p.type === 'text');
                if (textPart && textPart.type === 'text') {
                    title = textPart.text.slice(0, 50);
                }
            }

            // Intelligent title generation (1st and 3rd exchange)
            const msgCount = updatedMessages.length;
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
                personaId: activePersona?.id || 'default',
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
        }, {
            body: {
                personaId: activePersona?.id,
            },
        });
    };

    const suggestions = [
        "Brainstorm video ideas",
        "Refine my brand voice",
        "Create a content calendar",
        "Biblical perspective on creativity",
    ];

    if (isLoadingPersonas) {
        return (
            <div className="flex h-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm animate-pulse">Initializing JohnGPT...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col h-full bg-background/50 relative", className)}>
            {/* Persona Selector Header */}
            <PersonaSelector
                personas={personas}
                activePersona={activePersona}
                isOpen={isPersonaSelectorOpen}
                onToggle={() => setIsPersonaSelectorOpen(!isPersonaSelectorOpen)}
                onSelect={setActivePersona}
            />

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto pt-20 pb-4 px-4 scroll-smooth min-h-0"
                onClick={() => setIsPersonaSelectorOpen(false)}
            >
                <div className="max-w-5xl mx-auto space-y-6 h-full">
                    {messages.length === 0 ? (
                        <EmptyState
                            activePersona={activePersona}
                            suggestions={suggestions}
                            onSuggestionClick={(text) => setInput(text)}
                        />
                    ) : (
                        <ChatMessages
                            messages={messages}
                            isLoading={isLoading}
                            user={user}
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
