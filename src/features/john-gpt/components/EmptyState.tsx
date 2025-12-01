'use client';

import { Terminal, Flame, Zap, Book } from 'lucide-react';
import { BrainIcon } from '@/components/ui/BrainIcon';
import type { User as WorkOSUser } from '@workos-inc/node';

type EmptyStateProps = {
    suggestions: string[];
    onSuggestionClick: (text: string) => void;
    user?: WorkOSUser | null;
};

/**
 * Empty State Component
 * 
 * Displays when no messages exist in the conversation
 * Shows dynamic greeting and slash command cheat sheet
 */
export function EmptyState({ suggestions, onSuggestionClick, user }: EmptyStateProps) {
    const userName = user?.firstName || 'John';

    const commands = [
        {
            cmd: '/code',
            label: 'Engineering',
            desc: 'Clean, functional code. No fluff.',
            icon: Terminal,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'group-hover:border-green-500/50',
            glow: 'group-hover:shadow-glow-green'
        },
        {
            cmd: '/roast',
            label: 'Roast',
            desc: 'Ruthless critique of your ideas.',
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            border: 'group-hover:border-orange-500/50',
            glow: 'group-hover:shadow-glow-orange'
        },
        {
            cmd: '/simplify',
            label: 'Simplify',
            desc: 'Explain it like I\'m 5.',
            icon: Zap,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'group-hover:border-yellow-500/50',
            glow: 'group-hover:shadow-glow-yellow'
        },
        {
            cmd: '/bible',
            label: 'Biblical',
            desc: 'Wisdom from scripture.',
            icon: Book,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'group-hover:border-blue-500/50',
            glow: 'group-hover:shadow-glow-blue'
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
            <div className="space-y-4 max-w-md px-6">
                <div className="flex justify-center mb-6">
                    <BrainIcon size={64} className="text-foreground/80" />
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                    Good to see you, {userName}.
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                    Select a mode to get started, or just start chatting and I'll figure out what you need.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {commands.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => onSuggestionClick(item.cmd + ' ')}
                        className={`group relative flex items-start gap-4 p-4 text-left bg-background/40 backdrop-blur-md border border-border/50 ${item.border} ${item.glow} rounded-2xl transition-all duration-300 hover:-translate-y-0.5`}
                    >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color} transition-transform group-hover:scale-110`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-medium opacity-70 bg-background/50 px-1.5 py-0.5 rounded">{item.cmd}</span>
                                <span className="font-medium text-foreground">{item.label}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
