import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SpotlightBadgeProps {
    message: string;
    targetElementId?: string; // Optional: if we want to position it near a specific element
    onDismiss: () => void;
    duration?: number;
}

export function SpotlightBadge({ message, targetElementId, onDismiss, duration = 5000 }: SpotlightBadgeProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        // Trigger enter animation
        setIsVisible(true);

        // Auto-dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onDismiss]);

    useEffect(() => {
        if (targetElementId) {
            const element = document.getElementById(targetElementId);
            if (element) {
                const rect = element.getBoundingClientRect();
                setPosition({
                    top: rect.top + window.scrollY - 50, // Position above
                    left: rect.left + (rect.width / 2) - 100, // Center horizontally (approx)
                });
            }
        }
    }, [targetElementId]);

    // If no target element, position fixed at bottom center (above nav/chat)
    const style = position
        ? { top: position.top, left: position.left, position: 'absolute' as const }
        : { bottom: '100px', left: '50%', transform: 'translateX(-50%)', position: 'fixed' as const };

    const content = (
        <div
            style={style}
            className={cn(
                "z-[100] flex items-center gap-3 px-4 py-2.5 bg-background/80 backdrop-blur-md border border-primary/20 rounded-full shadow-lg shadow-primary/10 transition-all duration-300 ease-out",
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            )}
        >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium text-foreground">{message}</span>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onDismiss, 300);
                }}
                className="ml-1 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );

    // Render to body/portal to ensure it's above everything
    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
}
