import { useState, useEffect, useCallback } from 'react';

interface UseScrollBlurOptions {
  blurDuration?: number;
  blurIntensity?: number;
}

export const useScrollBlur = ({ blurDuration = 800, blurIntensity = 1 }: UseScrollBlurOptions = {}) => {
  const [isScrolling, setIsScrolling] = useState(false);

  const startScrollBlur = useCallback(() => {
    setIsScrolling(true);

    // Clear any existing timeout
    const timeoutId = setTimeout(() => {
      setIsScrolling(false);
    }, blurDuration);

    return () => clearTimeout(timeoutId);
  }, [blurDuration]);

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
