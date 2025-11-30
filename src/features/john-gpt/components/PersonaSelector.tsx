'use client';

import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Persona } from '../hooks/usePersonas';

type PersonaSelectorProps = {
    personas: Persona[];
    activePersona: Persona | null;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (persona: Persona) => void;
};

/**
 * Persona Selector Component
 * 
 * Displays the current active persona and allows switching between personas
 * Desktop: Shows all personas as pills
 * Mobile: Shows dropdown overlay
 */
export function PersonaSelector({
    personas,
    activePersona,
    isOpen,
    onToggle,
    onSelect,
}: PersonaSelectorProps) {
    const handleSelect = (persona: Persona) => {
        onSelect(persona);
        onToggle(); // Close mobile selector after selection
    };

    return (
        <>
            {/* Main Header Button */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-background/60 backdrop-blur-xl border-b border-border/40 flex items-center justify-between transition-all duration-300">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-3 group hover:bg-secondary/40 p-2 -ml-2 rounded-xl transition-all duration-300"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <div className="text-left">
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                            {activePersona?.name || 'JohnGPT'}
                            <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-transform duration-300", isOpen ? "rotate-180" : "")} />
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">{activePersona?.role || 'AI Assistant'}</p>
                    </div>
                </button>

                {/* Desktop Persona Selector */}
                <div className="hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-xl border border-border/40 backdrop-blur-sm">
                    {personas.map(p => (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p)}
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
            {isOpen && (
                <div className="absolute top-[73px] left-0 right-0 z-20 bg-background/95 backdrop-blur-2xl border-b border-border/50 shadow-xl animate-in slide-in-from-top-2 duration-300">
                    <div className="p-2 space-y-1">
                        {personas.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleSelect(p)}
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
        </>
    );
}
