'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Options for the useSmartAutoScroll hook
 */
interface UseSmartAutoScrollOptions {
    /** Threshold in pixels - if user is within this distance of bottom, auto-scroll follows */
    threshold?: number;
    /** Whether auto-scroll is enabled */
    enabled?: boolean;
    /** Debounce time in ms for scroll checks during streaming */
    debounceMs?: number;
}

/**
 * Return type for the useSmartAutoScroll hook
 */
interface UseSmartAutoScrollReturn {
    /** Ref to attach to the scroll container */
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    /** Ref to attach to the element at the end of messages */
    scrollAnchorRef: React.RefObject<HTMLDivElement | null>;
    /** Whether user is currently "following" (at/near bottom) */
    isFollowing: boolean;
    /** Manually scroll to bottom */
    scrollToBottom: (behavior?: ScrollBehavior) => void;
}

/**
 * Smart auto-scroll hook for streaming chat messages.
 * 
 * Features:
 * - Auto-scrolls when user is at/near bottom during streaming
 * - Respects user intent - if they scroll up manually, doesn't yank them back
 * - Re-engages auto-scroll when user scrolls back to bottom
 * - Debounced with requestAnimationFrame for performance
 * - No "boomerang" effect during fast streaming
 * 
 * @example
 * ```tsx
 * const { scrollContainerRef, scrollAnchorRef, isFollowing } = useSmartAutoScroll();
 * 
 * return (
 *   <div ref={scrollContainerRef} className="overflow-y-auto">
 *     {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *     <div ref={scrollAnchorRef} />
 *   </div>
 * );
 * ```
 */
export function useSmartAutoScroll({
    threshold = 100,
    enabled = true,
    debounceMs = 50,
}: UseSmartAutoScrollOptions = {}): UseSmartAutoScrollReturn {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);

    // Track whether user is "following" (at/near bottom)
    const [isFollowing, setIsFollowing] = useState(true);

    // Track if user manually scrolled (wheel/touch)
    const userScrolledRef = useRef(false);

    // Debounce timer ref
    const debounceTimerRef = useRef<number | null>(null);
    // RAF ref for cancellation
    const rafRef = useRef<number | null>(null);

    /**
     * Check if scroll position is at/near the bottom
     */
    const isNearBottom = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return true;

        const { scrollTop, scrollHeight, clientHeight } = container;
        return scrollHeight - scrollTop - clientHeight <= threshold;
    }, [threshold]);

    /**
     * Scroll to absolute bottom using direct scrollTop manipulation
     * This is more reliable than scrollIntoView during streaming
     */
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Use scrollTo for better control
        container.scrollTo({
            top: container.scrollHeight,
            behavior,
        });
    }, []);

    /**
     * Handle user manual scroll events (wheel/touch)
     * This temporarily disables auto-scroll to respect user intent
     */
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !enabled) return;

        const handleUserScroll = () => {
            userScrolledRef.current = true;

            // Check position after a small delay to let scroll settle
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = window.setTimeout(() => {
                const nearBottom = isNearBottom();
                setIsFollowing(nearBottom);
                userScrolledRef.current = false;
            }, 150);
        };

        // Listen for user-initiated scroll events
        container.addEventListener('wheel', handleUserScroll, { passive: true });
        container.addEventListener('touchmove', handleUserScroll, { passive: true });

        return () => {
            container.removeEventListener('wheel', handleUserScroll);
            container.removeEventListener('touchmove', handleUserScroll);
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }
        };
    }, [enabled, isNearBottom]);

    /**
     * Auto-scroll effect - runs when content changes
     * Uses MutationObserver to detect DOM changes (new messages/tokens)
     */
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !enabled) return;

        const performAutoScroll = () => {
            // Don't auto-scroll if user is manually scrolling
            if (userScrolledRef.current) return;

            // Only scroll if we're in "following" mode
            if (!isFollowing) return;

            // Use RAF for smooth performance
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                // Double-check we're still near bottom before scrolling
                if (isNearBottom()) {
                    // Direct scrollTop manipulation - most reliable during streaming
                    container.scrollTop = container.scrollHeight - container.clientHeight;
                }
            });
        };

        // Observe DOM mutations (new content being added)
        const observer = new MutationObserver(() => {
            // Debounce the scroll check
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = window.setTimeout(performAutoScroll, debounceMs);
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        // Initial scroll to bottom on mount
        scrollToBottom('auto');

        return () => {
            observer.disconnect();
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [enabled, isFollowing, isNearBottom, debounceMs, scrollToBottom]);

    return {
        scrollContainerRef,
        scrollAnchorRef,
        isFollowing,
        scrollToBottom,
    };
}
