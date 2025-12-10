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
 * - Respects user intent - if they scroll up manually, STOPS immediately
 * - Only re-engages when user scrolls all the way to bottom
 * - 500ms cooldown after user scroll to prevent boomerang
 */
export function useSmartAutoScroll({
    threshold = 100,
    enabled = true,
    debounceMs = 100,
}: UseSmartAutoScrollOptions = {}): UseSmartAutoScrollReturn {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);

    // Track whether user is "following" (at/near bottom)
    const [isFollowing, setIsFollowing] = useState(true);

    // Track user scroll state with cooldown
    const userScrollCooldownRef = useRef(false);
    const lastScrollTopRef = useRef(0);

    // Separate timers to prevent conflicts
    const userScrollTimerRef = useRef<number | null>(null);
    const autoScrollTimerRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    /**
     * Check if user is at absolute bottom (stricter check for re-enabling)
     */
    const isAtBottom = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return true;

        const { scrollTop, scrollHeight, clientHeight } = container;
        // Must be within 20px of absolute bottom to re-enable
        return scrollHeight - scrollTop - clientHeight <= 20;
    }, []);

    /**
     * Scroll to absolute bottom
     */
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior,
        });
    }, []);

    /**
     * Handle user manual scroll events (wheel/touch)
     * Immediately disables auto-scroll if user scrolls UP
     */
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !enabled) return;

        const handleUserScroll = () => {
            const currentScrollTop = container.scrollTop;
            const scrolledUp = currentScrollTop < lastScrollTopRef.current - 5; // 5px tolerance
            lastScrollTopRef.current = currentScrollTop;

            // User scrolled UP - immediately disable following
            if (scrolledUp && !isAtBottom()) {
                setIsFollowing(false);
                userScrollCooldownRef.current = true;

                // Clear any pending auto-scroll
                if (autoScrollTimerRef.current) {
                    window.clearTimeout(autoScrollTimerRef.current);
                    autoScrollTimerRef.current = null;
                }
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }
            }

            // Reset cooldown timer
            if (userScrollTimerRef.current) {
                window.clearTimeout(userScrollTimerRef.current);
            }

            // Long cooldown (500ms) before allowing auto-scroll to re-engage
            userScrollTimerRef.current = window.setTimeout(() => {
                userScrollCooldownRef.current = false;

                // Only re-enable if user scrolled ALL the way to bottom
                if (isAtBottom()) {
                    setIsFollowing(true);
                }
            }, 500);
        };

        container.addEventListener('wheel', handleUserScroll, { passive: true });
        container.addEventListener('touchmove', handleUserScroll, { passive: true });
        container.addEventListener('scroll', handleUserScroll, { passive: true });

        return () => {
            container.removeEventListener('wheel', handleUserScroll);
            container.removeEventListener('touchmove', handleUserScroll);
            container.removeEventListener('scroll', handleUserScroll);
            if (userScrollTimerRef.current) {
                window.clearTimeout(userScrollTimerRef.current);
            }
        };
    }, [enabled, isAtBottom]);

    /**
     * Auto-scroll effect - runs when content changes
     * Uses MutationObserver to detect DOM changes with THROTTLING
     */
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !enabled) return;

        // Throttle: Track last scroll time to prevent excessive scrolling
        let lastScrollTime = 0;
        const THROTTLE_MS = 150; // Max once every 150ms

        const performAutoScroll = () => {
            // STRICT CHECK: Don't scroll if cooldown is active
            if (userScrollCooldownRef.current) return;

            // Only scroll if we're in "following" mode
            if (!isFollowing) return;

            // Throttle check
            const now = Date.now();
            if (now - lastScrollTime < THROTTLE_MS) return;
            lastScrollTime = now;

            // Use RAF for smooth performance
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                // One more check before scrolling
                if (userScrollCooldownRef.current || !isFollowing) return;

                // Direct scrollTop manipulation
                container.scrollTop = container.scrollHeight - container.clientHeight;
                lastScrollTopRef.current = container.scrollTop;
            });
        };

        // Observe DOM mutations - with DEBOUNCE to prevent overwhelming
        let mutationTimeout: number | null = null;

        const observer = new MutationObserver(() => {
            // Don't process if cooldown is active
            if (userScrollCooldownRef.current) return;

            // Debounce mutations - only process once per debounceMs
            if (mutationTimeout) {
                window.clearTimeout(mutationTimeout);
            }

            mutationTimeout = window.setTimeout(performAutoScroll, debounceMs);
        });

        // OPTIMIZED: Only observe childList (new elements), not characterData
        // This reduces mutation events during streaming significantly
        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: false, // Changed: Don't observe text node changes
        });

        // Initial scroll to bottom on mount
        scrollToBottom('auto');
        lastScrollTopRef.current = container.scrollTop;

        return () => {
            observer.disconnect();
            if (mutationTimeout) {
                window.clearTimeout(mutationTimeout);
            }
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [enabled, isFollowing, debounceMs, scrollToBottom]);

    return {
        scrollContainerRef,
        scrollAnchorRef,
        isFollowing,
        scrollToBottom,
    };
}
