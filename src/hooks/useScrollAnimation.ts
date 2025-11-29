import { useEffect, useRef, useState } from 'react';
import {
    shouldEnableAnimations,
    getOptimalThreshold,
    getRootMargin,
    isMobileDevice
} from '@/lib/scrollAnimationUtils';

/**
 * Options for configuring scroll animation behavior
 */
interface UseScrollAnimationOptions {
    /** Threshold at which animation triggers (0.0 to 1.0). If not provided, uses device-optimized default */
    threshold?: number;
    /** Root margin for IntersectionObserver. If not provided, uses device-optimized default */
    rootMargin?: string;
    /** Whether animation should only trigger once (default: true) */
    triggerOnce?: boolean;
    /** Custom delay before animation starts (in milliseconds) */
    delay?: number;
}

/**
 * Return type for useScrollAnimation hook
 */
interface UseScrollAnimationReturn<T extends HTMLElement = HTMLElement> {
    /** Ref to attach to the element you want to animate */
    ref: React.MutableRefObject<T | null>;
    /** Whether the element is currently visible in viewport */
    isVisible: boolean;
    /** Whether the element has been animated (useful for triggerOnce) */
    hasAnimated: boolean;
}

/**
 * Custom hook for scroll-triggered animations
 * 
 * Leverages IntersectionObserver to efficiently detect when elements enter the viewport
 * and trigger animations. Automatically respects user accessibility preferences and
 * optimizes thresholds for mobile vs desktop devices.
 * 
 * @param options - Configuration options
 * @returns Ref to attach to element, visibility state, and animation state
 * 
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollAnimation({ triggerOnce: true });
 * 
 * return (
 *   <div 
 *     ref={ref}
 *     className={`scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up' : ''}`}
 *   >
 *     Content that animates on scroll
 *   </div>
 * );
 * ```
 */
export const useScrollAnimation = <T extends HTMLElement = HTMLElement>({
    threshold,
    rootMargin,
    triggerOnce = true,
    delay = 0,
}: UseScrollAnimationOptions = {}): UseScrollAnimationReturn<T> => {
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        // Don't set up observer if animations are disabled (prefers-reduced-motion)
        if (!shouldEnableAnimations()) {
            // Make element visible immediately without animation  
            setIsVisible(true);
            setHasAnimated(true);
            return;
        }

        const currentElement = ref.current;
        if (!currentElement) return;

        // Determine device type for optimal settings
        const isMobile = isMobileDevice();

        // Use provided options or fall back to device-optimized defaults
        const observerThreshold = threshold ?? getOptimalThreshold(isMobile);
        const observerRootMargin = rootMargin ?? getRootMargin(isMobile);

        // Create IntersectionObserver with optimized settings
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Apply delay if specified
                        if (delay > 0) {
                            setTimeout(() => {
                                setIsVisible(true);
                                setHasAnimated(true);
                            }, delay);
                        } else {
                            setIsVisible(true);
                            setHasAnimated(true);
                        }

                        // If triggerOnce is true, stop observing after first trigger
                        if (triggerOnce) {
                            observer.unobserve(entry.target);
                        }
                    } else if (!triggerOnce) {
                        // If triggerOnce is false, allow re-triggering when element leaves viewport
                        setIsVisible(false);
                    }
                });
            },
            {
                threshold: observerThreshold,
                rootMargin: observerRootMargin,
            }
        );

        // Start observing the element
        observer.observe(currentElement);

        // Cleanup: disconnect observer on unmount
        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, delay]);

    return {
        ref,
        isVisible,
        hasAnimated,
    };
};
