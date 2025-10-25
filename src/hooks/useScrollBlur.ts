import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseScrollBlurOptions {
  blurDuration?: number;
  blurIntensity?: number;
}

export const useScrollBlur = ({ blurDuration = 800, blurIntensity = 1 }: UseScrollBlurOptions = {}) => {
  const [isScrolling, setIsScrolling] = useState(false);

  // Performance guardrails for motion blur
  const shouldApplyBlur = useMemo(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if device has sufficient hardware concurrency (cores)
    const hasGoodPerformance = typeof navigator !== 'undefined' &&
      (navigator.hardwareConcurrency || 0) >= 4;

    // Only apply blur if user doesn't prefer reduced motion AND device has good performance
    return !prefersReducedMotion && hasGoodPerformance;
  }, []);

  const startScrollBlur = useCallback(() => {
    // Don't apply blur if performance guardrails prevent it
    if (!shouldApplyBlur) return;

    setIsScrolling(true);

    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      setIsScrolling(false);
    }, blurDuration);

    return () => clearTimeout(timeoutId);
  }, [blurDuration, shouldApplyBlur]);

  // Listen for manual scroll to disable blur (we only want blur during programmatic navigation)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrolling) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 150); // Debounce manual scroll
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling]);

  return {
    isScrolling,
    startScrollBlur,
    blurClass: isScrolling ? `blur-[${blurIntensity}px]` : '',
  };
};
