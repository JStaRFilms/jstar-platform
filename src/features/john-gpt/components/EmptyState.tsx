'use client';

import { Terminal, Flame, Zap, Book } from 'lucide-react';
import { BrainIcon } from '@/components/ui/BrainIcon';
import type { User as WorkOSUser } from '@workos-inc/node';

type EmptyStateProps = {
    suggestions: string[];
    onSuggestionClick: (text: string) => void;
    user?: WorkOSUser | null;
    isLocked?: boolean;
};

/**
 * Empty State Component
 * 
 * Displays when no messages exist in the conversation
 * Shows dynamic greeting and slash command cheat sheet
 */
export function EmptyState({ suggestions, onSuggestionClick, user, isLocked = false }: EmptyStateProps) {
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
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-10">
            <div className={`space-y-4 max-w-md px-6 ${isLocked ? 'mt-4' : ''}`}>
                <div className="flex justify-center mb-4">
                    <BrainIcon size={isLocked ? 48 : 64} className="text-foreground/80" />
                </div>

                <h1 className={`${isLocked ? 'text-2xl' : 'text-3xl md:text-4xl'} font-semibold text-foreground tracking-tight`}>
                    {isLocked ? 'How can I help?' : `Good to see you${userName !== 'John' ? `, ${userName}` : ''}.`}
                </h1>

                {!isLocked && (
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Select a mode to get started, or just start chatting and I'll figure out what you need.
                    </p>
                )}

                {isLocked && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/5 border border-yellow-500/10 text-yellow-600/80 dark:text-yellow-400/80 text-[10px] font-medium">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                        </span>
                        Guest Mode • History not saved
                    </div>
                )}
            </div>

            {isLocked ? (
                // Locked View: Simple Suggestions Chips (Demure)
                <div className="flex flex-wrap justify-center gap-2 max-w-sm px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    {suggestions.map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => onSuggestionClick(suggestion)}
                            className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all duration-200"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            ) : (
                // Unlocked View: Full Slash Command Cards
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
            )}
        </div>
    );
}
