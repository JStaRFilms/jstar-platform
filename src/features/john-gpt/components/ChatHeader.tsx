'use client';

import React from 'react';
import { Menu, Terminal, Flame, Zap, Book, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatHeaderProps = {
    onMobileMenuClick?: () => void;
    messages: any[];
    currentMode?: string | null;
};

export function ChatHeader({ onMobileMenuClick, messages, currentMode }: ChatHeaderProps) {
    // Determine the current mode based on the last user message
    const getMode = () => {
        // 1. Backend Detected Mode (Highest Priority)
        if (currentMode) {
            switch (currentMode) {
                case 'code': return {
                    label: 'Engineering Mode',
                    icon: Terminal,
                    color: 'text-green-500',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20'
                };
                case 'roast': return {
                    label: 'Roast Mode',
                    icon: Flame,
                    color: 'text-orange-500',
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/20'
                };
                case 'simplify': return {
                    label: 'Simplify Mode',
                    icon: Zap,
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20'
                };
                case 'bible': return {
                    label: 'Biblical Mode',
                    icon: Book,
                    color: 'text-blue-500',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20'
                };
                case 'Universal': return null; // Default
            }
        }

        // 2. Fallback: Client-side Heuristics (for optimistic updates or legacy)
        // Find the last user message
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');

        if (!lastUserMessage) return null;

        // Safely get content, handling potential missing 'content' property
        let content = lastUserMessage.content || '';

        // If content is empty but parts exist, try to extract text from parts
        if (!content && (lastUserMessage as any).parts) {
            const textParts = (lastUserMessage as any).parts.filter((p: any) => p.type === 'text');
            if (textParts.length > 0) {
                content = textParts.map((p: any) => p.text).join('');
            }
        }

        content = content.trim();
        const lowerContent = content.toLowerCase();

        // Explicit Slash Commands (Overrides everything)
        if (content.startsWith('/code')) return {
            label: 'Engineering Mode',
            icon: Terminal,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        };
        if (content.startsWith('/roast')) return {
            label: 'Roast Mode',
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        };
        if (content.startsWith('/simplify')) return {
            label: 'Simplify Mode',
            icon: Zap,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        };
        if (content.startsWith('/bible')) return {
            label: 'Biblical Mode',
            icon: Book,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        };

        // Implicit Context Detection (Smart Switching)
        // Only show if the user hasn't explicitly set a mode, to show "we figured it out"
        if (lowerContent.includes('function') || lowerContent.includes('const ') || lowerContent.includes('react') || lowerContent.includes('bug') || lowerContent.includes('error')) {
            return {
                label: 'Engineering Context',
                icon: Terminal,
                color: 'text-green-500/80',
                bg: 'bg-green-500/5',
                border: 'border-green-500/10'
            };
        }
        if (lowerContent.includes('bible') || lowerContent.includes('scripture') || lowerContent.includes('god') || lowerContent.includes('jesus') || lowerContent.includes('verse')) {
            return {
                label: 'Biblical Context',
                icon: Book,
                color: 'text-blue-500/80',
                bg: 'bg-blue-500/5',
                border: 'border-blue-500/10'
            };
        }

        return null;
    };

    const mode = getMode();
    const ModeIcon = mode?.icon || Sparkles;

    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
                {/* Mobile Menu Trigger */}
                <button
                    onClick={onMobileMenuClick}
                    className="md:hidden p-2 -ml-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Title & Mode Badge */}
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground tracking-tight">JohnGPT</span>

                    {mode ? (
                        <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all animate-in fade-in slide-in-from-left-2",
                            mode.bg,
                            mode.color,
                            mode.border
                        )}>
                            <ModeIcon className="w-3.5 h-3.5" />
                            <span>{mode.label}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/50 text-muted-foreground border border-transparent">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>J StaR Prime</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
