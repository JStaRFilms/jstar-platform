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
        <div className="flex flex-col items-center justify-center h-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-700 pb-20">
            <div className="space-y-4 max-w-md px-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-foreground/80" />
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                    Good to see you, John.
                </h1>
                <p className="text-muted-foreground text-lg">
                    {activePersona?.role ? `Chatting with ${activePersona.role}` : 'How can I help you today?'}
                </p>
            </div>

            {/* Suggestions hidden on mobile to keep it super clean, or minimal? 
                The screenshot doesn't show suggestions, just the greeting. 
                I'll keep them but make them very subtle or hide them if the user wants EXACTLY the screenshot.
                The screenshot has NO suggestions. I will hide them for now or make them very subtle pills at the bottom.
            */}
            {suggestions.length > 0 && (
                <div className="grid grid-cols-2 gap-3 w-full max-w-2xl px-4 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-forwards">
                    {suggestions.map((suggestion, i) => (
                        <button
                            key={i}
                            onClick={() => onSuggestionClick(suggestion)}
                            className="p-3 text-sm text-center bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-border/50 rounded-2xl transition-all duration-300 text-muted-foreground hover:text-foreground"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
