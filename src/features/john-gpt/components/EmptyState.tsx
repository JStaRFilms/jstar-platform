'use client';

import { Sparkles } from 'lucide-react';
import type { Persona } from '../hooks/usePersonas';

type EmptyStateProps = {
    activePersona: Persona | null;
    suggestions: string[];
    onSuggestionClick: (text: string) => void;
};

/**
 * Empty State Component
 * 
 * Displays when no messages exist in the conversation
 * Shows persona info and suggestion prompts
 */
export function EmptyState({ activePersona, suggestions, onSuggestionClick }: EmptyStateProps) {
    return (
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
                        onClick={() => onSuggestionClick(suggestion)}
                        className="p-4 text-sm text-left bg-card/50 hover:bg-accent/50 border border-border/50 hover:border-primary/30 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md group backdrop-blur-sm"
                    >
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                            "{suggestion}"
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
