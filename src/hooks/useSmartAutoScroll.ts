'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

interface UseSmartAutoScrollOptions {
    threshold?: number;
    enabled?: boolean;
    debounceMs?: number;
}

interface UseSmartAutoScrollReturn {
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    scrollAnchorRef: React.RefObject<HTMLDivElement | null>;
    isFollowing: boolean;
    scrollToBottom: (behavior?: ScrollBehavior) => void;
}

/**
 * Enhanced Smart Auto-Scroll Hook
 * 
 * Simplified and robust implementation for sticky scrolling during streaming.
 * Checks scroll position and only auto-scrolls if the user was already at the bottom.
 */
export function useSmartAutoScroll({
    threshold = 150, // Increased threshold for better "sticky" feel
    enabled = true,
}: UseSmartAutoScrollOptions = {}): UseSmartAutoScrollReturn {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);

    // Track if we should auto-scroll (sticky mode)
    const [isFollowing, setIsFollowing] = useState(true);

    /**
     * Check if user is near bottom
     */
    const checkIsNearBottom = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return true;

        // Distance from bottom
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

        // Use Math.abs because sometimes overscroll (elastic scrolling) can make it negative
        return Math.abs(distanceFromBottom) <= threshold;
    }, [threshold]);

    /**
     * Scroll to bottom helper
     */
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Prefer scrollIntoView on the anchor for reliability across layouts
        if (scrollAnchorRef.current) {
            scrollAnchorRef.current.scrollIntoView({ behavior, block: 'end' });
        } else {
            // Fallback to scrollTop
            container.scrollTo({ top: container.scrollHeight, behavior });
        }
    }, []);

    // 1. Handle Scroll Events to toggle "sticky" mode
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !enabled) return;

        const handleScroll = () => {
            // If the user scrolls, check if they broke "stickiness"
            const nearBottom = checkIsNearBottom();
            setIsFollowing(nearBottom);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [enabled, checkIsNearBottom]);

    // 2. Observe mutations (new content) to trigger auto-scroll
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !enabled) return;

        const observer = new MutationObserver(() => {
            // If we are following, scroll to bottom when content changes
            if (isFollowing) {
                // Use 'instant' or 'smooth'? 'smooth' is nicer but can lag behind fast tokens.
                // 'auto' (instant) is better for high-speed streaming.
                scrollToBottom('auto');
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => observer.disconnect();
    }, [enabled, isFollowing, scrollToBottom]);

    // 3. Initial scroll on mount
    useEffect(() => {
        if (enabled) {
            // Wait for layout to stabilize
            setTimeout(() => {
                scrollToBottom('auto');
            }, 100);
        }
    }, [enabled, scrollToBottom]);

    return {
        scrollContainerRef,
        scrollAnchorRef,
        isFollowing,
        scrollToBottom,
    };
}
