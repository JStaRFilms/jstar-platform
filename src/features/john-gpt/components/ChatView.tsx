'use client';

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { Bot, User, Sparkles, Loader2, AlertCircle, ChevronDown, Check } from 'lucide-react';
import type { User as WorkOSUser } from '@workos-inc/node';
import { cn } from '@/lib/utils';
import { chatStorage } from '@/lib/chat-storage';

type ChatViewProps = {
    user: WorkOSUser;
    className?: string;
};

type Persona = {
    id: string;
    name: string;
    role: string;
    description: string;
    systemPrompt: string;
};

export function ChatView({ user, className }: ChatViewProps) {
    const [personas, setPersonas] = React.useState<Persona[]>([]);
    const [isLoadingPersonas, setIsLoadingPersonas] = React.useState(true);
    const [activePersona, setActivePersona] = React.useState<Persona | null>(null);
    const [isPersonaSelectorOpen, setIsPersonaSelectorOpen] = React.useState(false);

    // Fetch personas on mount
    React.useEffect(() => {
        async function fetchPersonas() {
            try {
                const res = await fetch('/api/johngpt/personas');
                if (!res.ok) throw new Error('Failed to fetch personas');
                const data = await res.json();
                setPersonas(data);
                if (data.length > 0) setActivePersona(data[0]);
            } catch (error) {
                console.error('Error fetching personas:', error);
            } finally {
                setIsLoadingPersonas(false);
            }
        }
        fetchPersonas();
    }, []);

    // Initialize useChat with persistence
    const { messages, sendMessage, status, stop, error, setMessages } = useChat({
        onFinish: async (message) => {
            // Save conversation on completion
            const conversationId = activeConversationId || crypto.randomUUID();
            if (!activeConversationId) setActiveConversationId(conversationId);

            const updatedMessages = [...messages, message];

            // Extract title from first message or generate one
            const firstMessage = messages[0];
            let title = 'New Conversation';

            // Check if we already have a title that isn't the default
            const currentConv = await chatStorage.getConversation(conversationId);
            if (currentConv && currentConv.title !== 'New Conversation') {
                title = currentConv.title;
            } else if (firstMessage) {
                const textPart = firstMessage.parts.find(p => p.type === 'text');
                if (textPart && textPart.type === 'text') {
                    title = textPart.text.slice(0, 50);
                }
            }

            // Intelligent Title Generation (1st and 3rd prompt)
            // We check updatedMessages length. 
            // 1st prompt pair = 2 messages (User + AI)
            // 3rd prompt pair = 6 messages (User + AI + User + AI + User + AI)
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
                        if (data.title) {
                            title = data.title;
                        }
                    }
                } catch (err) {
                    console.error('Failed to generate title:', err);
                }
            }

            await chatStorage.saveConversation({
                id: conversationId,
                title,
                messages: updatedMessages as any, // Cast to avoid type issues with UIMessage
                createdAt: Date.now(),
                updatedAt: Date.now(),
                personaId: activePersona?.id || 'default',
                syncedToDrive: false
            });

            // Trigger background sync
            if (user) {
                chatStorage.syncConversations(user.id);
            }
        }
    });

    const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
    const isLoading = status === 'submitted' || status === 'streaming';

    // Load latest conversation on mount
    React.useEffect(() => {
        async function loadLastConversation() {
            const conversations = await chatStorage.getAllConversations();
            if (conversations.length > 0) {
                // Sort by updatedAt desc
                const lastConv = conversations.sort((a, b) => b.updatedAt - a.updatedAt)[0];
                setActiveConversationId(lastConv.id);
                setMessages(lastConv.messages as any);
            }

            // Sync on load
            if (user) {
                chatStorage.syncConversations(user.id);
            }
        }
        loadLastConversation();
    }, [user, setMessages]);

    const [input, setInput] = React.useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput(''); // Clear input immediately

        await sendMessage({
            text: userMessage,
        }, {
            body: {
                personaId: activePersona?.id,
            }
        });
    };

    const suggestions = [
        "Brainstorm video ideas",
        "Refine my brand voice",
        "Create a content calendar",
        "Biblical perspective on creativity"
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
            {/* Header - Minimalist & Interactive on Mobile */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-background/60 backdrop-blur-xl border-b border-border/40 flex items-center justify-between transition-all duration-300">
                <button
                    onClick={() => setIsPersonaSelectorOpen(!isPersonaSelectorOpen)}
                    className="flex items-center gap-3 group hover:bg-secondary/40 p-2 -ml-2 rounded-xl transition-all duration-300"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <div className="text-left">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                            {activePersona?.name || 'JohnGPT'}
                            <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform duration-300", isPersonaSelectorOpen ? "rotate-180" : "")} />
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">{activePersona?.role || 'AI Assistant'}</p>
                    </div>
                </button>

                {/* Persona Selector (Desktop - Quick Switch) */}
                <div className="hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-xl border border-border/40 backdrop-blur-sm">
                    {personas.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActivePersona(p)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300",
                                activePersona?.id === p.id
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                            )}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Persona Selector Overlay */}
            {isPersonaSelectorOpen && (
                <div className="absolute top-[73px] left-0 right-0 z-20 bg-background/95 backdrop-blur-2xl border-b border-border/50 shadow-xl animate-in slide-in-from-top-2 duration-300">
                    <div className="p-2 space-y-1">
                        {personas.map(p => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setActivePersona(p);
                                    setIsPersonaSelectorOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200",
                                    activePersona?.id === p.id
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-secondary/50 text-foreground"
                                )}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-medium text-sm">{p.name}</span>
                                    <span className="text-xs text-muted-foreground">{p.role}</span>
                                </div>
                                {activePersona?.id === p.id && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto pt-20 pb-4 px-4 scroll-smooth min-h-0"
                onClick={() => setIsPersonaSelectorOpen(false)} // Close selector when clicking outside
            >
                <div className="max-w-5xl mx-auto space-y-6 h-full">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600/90 to-purple-600/90 flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6 mx-auto transform group-hover:scale-105 transition-transform duration-500 ring-1 ring-white/20 backdrop-blur-xl">
                                    <Sparkles className="w-12 h-12 text-white drop-shadow-md" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1.5 border border-border shadow-sm">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-3 max-w-md">
                                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                                    {activePersona?.role || 'Creative Partner'} Mode
                                </h1>
                                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                    {activePersona?.description || 'Ready to help you brainstorm, strategize, or reflect. How can I support you today?'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                                {suggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleInputChange({ target: { value: suggestion } } as any)}
                                        className="p-4 text-sm text-left bg-card/50 hover:bg-accent/50 border border-border/50 hover:border-primary/30 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group backdrop-blur-sm"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                            "{suggestion}"
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
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
