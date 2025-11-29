import { useEffect, useRef, useState } from 'react';
import {
    shouldEnableAnimations,
    getOptimalThreshold,
    getRootMargin,
    isMobileDevice,
    getStaggerDelay
} from '@/lib/scrollAnimationUtils';

/**
 * Options for configuring multi-element scroll animation behavior
 */
interface UseScrollAnimationMultiOptions {
    /** Number of elements to animate */
    count: number;
    /** Threshold at which animation triggers (0.0 to 1.0). If not provided, uses device-optimized default */
    threshold?: number;
    /** Root margin for IntersectionObserver. If not provided, uses device-optimized default */
    rootMargin?: string;
    /** Whether animations should only trigger once (default: true) */
    triggerOnce?: boolean;
    /** Base delay for stagger effect in milliseconds (default: 100ms) */
    staggerDelay?: number;
}

/**
 * Return type for useScrollAnimationMulti hook
 */
interface UseScrollAnimationMultiReturn<T extends HTMLElement = HTMLElement> {
    /** Array of refs to attach to elements you want to animate */
    refs: React.MutableRefObject<T | null>[];
    /** Array of visibility states for each element */
    visibilityStates: boolean[];
    /** Whether all elements have been animated */
    allAnimated: boolean;
}

/**
 * Custom hook for animating multiple elements with a stagger effect
 * 
 * Perfect for lists, grids, and any collection of elements that should animate
 * in sequence. Each element gets its own ref and visibility state, with automatic
 * stagger delay calculation.
 * 
 * @param options - Configuration options
 * @returns Array of refs, visibility states, and completion status
 * 
 * @example
 * ```tsx
 * const { refs, visibilityStates } = useScrollAnimationMulti({ count: 3, staggerDelay: 150 });
 * 
 * const items = ['Item 1', 'Item 2', 'Item 3'];
 * 
 * return (
 *   <div>
 *     {items.map((item, index) => (
 *       <div
 *         key={index}
 *         ref={refs[index]}
 *         className={`scroll-animate-hidden ${visibilityStates[index] ? 'scroll-animate-fade-in-up' : ''}`}
 *       >
 *         {item}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useScrollAnimationMulti = <T extends HTMLElement = HTMLElement>({
    count,
    threshold,
    rootMargin,
    triggerOnce = true,
    staggerDelay = 100,
    onlyOneActive = false,
}: UseScrollAnimationMultiOptions & { onlyOneActive?: boolean }): UseScrollAnimationMultiReturn<T> => {
    // Create array of refs for each element - handle dynamic count
    const refs = useRef<React.MutableRefObject<T | null>[]>([]);

    // Update refs array if count changes
    if (refs.current.length !== count) {
        refs.current = Array.from({ length: count }, (_, i) =>
            refs.current[i] || { current: null }
        );
    }

    // Track visibility state for each element
    const [visibilityStates, setVisibilityStates] = useState<boolean[]>(
        Array(count).fill(false)
    );

    // Update visibility states when count changes
    useEffect(() => {
        setVisibilityStates((prev) => {
            if (prev.length === count) return prev;
            return Array(count).fill(false);
        });
        setAllAnimated(false);
    }, [count]);

    // Track if all elements have been animated
    const [allAnimated, setAllAnimated] = useState(false);

    useEffect(() => {
        // Don't set up observer if animations are disabled (prefers-reduced-motion)
        if (!shouldEnableAnimations()) {
            // Make all elements visible immediately without animation
            setVisibilityStates(Array(count).fill(true));
            setAllAnimated(true);
            return;
        }

        // Determine device type for optimal settings
        const isMobile = isMobileDevice();

        // Use provided options or fall back to device-optimized defaults
        const observerThreshold = threshold ?? getOptimalThreshold(isMobile);
        const observerRootMargin = rootMargin ?? getRootMargin(isMobile);

        // Create a single IntersectionObserver for all elements (performance optimization)
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Find which element triggered the observer
                        const elementIndex = refs.current.findIndex(
                            (ref) => ref.current === entry.target
                        );

                        if (elementIndex !== -1) {
                            if (onlyOneActive) {
                                // If onlyOneActive is true, set this element to true and all others to false
                                setVisibilityStates((prev) => {
                                    // If this element is already active and we are the only one, do nothing
                                    // But checking that is complex, simpler to just set state
                                    const newStates = Array(count).fill(false);
                                    newStates[elementIndex] = true;
                                    return newStates;
                                });
                            } else {
                                // Calculate stagger delay for this specific element
                                const delay = getStaggerDelay(elementIndex, staggerDelay);

                                // Apply stagger delay
                                setTimeout(() => {
                                    setVisibilityStates((prev) => {
                                        const newStates = [...prev];
                                        newStates[elementIndex] = true;

                                        // Check if all elements are now visible
                                        if (newStates.every((state) => state)) {
                                            setAllAnimated(true);
                                        }

                                        return newStates;
                                    });
                                }, delay);

                                // If triggerOnce is true, stop observing this element
                                if (triggerOnce) {
                                    observer.unobserve(entry.target);
                                }
                            }
                        }
                    } else if (!triggerOnce && !onlyOneActive) {
                        // If triggerOnce is false and NOT in exclusive mode, allow re-triggering
                        const elementIndex = refs.current.findIndex(
                            (ref) => ref.current === entry.target
                        );

                        if (elementIndex !== -1) {
                            setVisibilityStates((prev) => {
                                const newStates = [...prev];
                                newStates[elementIndex] = false;
                                return newStates;
                            });
                            setAllAnimated(false);
                        }
                    }
                });
            },
            {
                threshold: observerThreshold,
                rootMargin: observerRootMargin,
            }
        );

        // Observe all elements
        refs.current.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        // Cleanup: disconnect observer on unmount
        return () => {
            observer.disconnect();
        };
    }, [count, threshold, rootMargin, triggerOnce, staggerDelay, onlyOneActive]);

    return {
        refs: refs.current,
        visibilityStates,
        allAnimated,
    };
};
