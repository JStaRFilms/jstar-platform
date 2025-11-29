/**
 * Scroll Animation Utilities
 * 
 * Helper functions for scroll-triggered animations that optimize performance
 * and accessibility across mobile and desktop devices.
 */

/**
 * Determines if animations should be enabled based on user preferences
 * Respects the prefers-reduced-motion accessibility setting
 * 
 * @returns {boolean} True if animations should be enabled
 */
export const shouldEnableAnimations = (): boolean => {
    // Server-side rendering check
    if (typeof window === 'undefined') return false;

    // Check for user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return !prefersReducedMotion;
};

/**
 * Gets the optimal IntersectionObserver threshold based on device type
 * Mobile devices use lower thresholds (trigger earlier) due to smaller viewports
 * 
 * @param {boolean} isMobile - Whether the device is mobile
 * @returns {number} Optimal threshold value (0.0 to 1.0)
 */
export const getOptimalThreshold = (isMobile: boolean): number => {
    // Mobile: Trigger when 10% of element is visible (earlier trigger)
    // Desktop: Trigger when 20% of element is visible (more deliberate)
    return isMobile ? 0.1 : 0.2;
};

/**
 * Calculates stagger delay for multi-element animations
 * Creates a cascading effect for lists and grids
 * 
 * @param {number} index - Index of the element in the list
 * @param {number} baseDelay - Base delay in milliseconds (default: 100ms)
 * @returns {number} Calculated delay in milliseconds
 */
export const getStaggerDelay = (index: number, baseDelay: number = 100): number => {
    return index * baseDelay;
};

/**
 * Gets the appropriate root margin for IntersectionObserver based on device
 * Provides earlier detection on mobile for smoother experience
 * 
 * @param {boolean} isMobile - Whether the device is mobile
 * @returns {string} Root margin value for IntersectionObserver
 */
export const getRootMargin = (isMobile: boolean): string => {
    // Mobile: Start observing 50px before element enters viewport
    // Desktop: Start observing 100px before element enters viewport
    return isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px';
};

/**
 * Detects if the current device is mobile based on screen width
 * Uses a common breakpoint (768px) consistent with Tailwind's md breakpoint
 * 
 * @returns {boolean} True if device is mobile
 */
export const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
};
