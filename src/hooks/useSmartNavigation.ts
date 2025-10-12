// src/hooks/useSmartNavigation.ts
import { useState, useRef, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

// Props the hook will accept
type UseSmartNavigationProps = {
  href: string; // The target URL, e.g., '/about'
};

// Values and handlers the hook will return
type UseSmartNavigationReturn = {
  /** Event handlers to be spread onto the link/button component */
  eventHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onClick: (e: React.MouseEvent) => void; // To handle navigation on non-homepage contexts
  };
  /** State for controlling the tooltip visibility and content */
  tooltip: {
    isVisible: boolean;
    text: string;
  };
};

export const useSmartNavigation = ({ href }: UseSmartNavigationProps): UseSmartNavigationReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [tooltip, setTooltip] = useState({ isVisible: false, text: '' });

  const isHomepage = pathname === '/';
  const targetSectionId = href.startsWith('/') ? href.substring(1) : href;

  const handlePressStart = useCallback(() => {
    if (!isHomepage) return;

    setTooltip({ isVisible: true, text: `Hold to navigate to ${targetSectionId}` });

    pressTimerRef.current = setTimeout(() => {
      setTooltip({ isVisible: false, text: '' });
      router.push(href);
    }, 1000); // 1-second long press
  }, [isHomepage, href, router, targetSectionId]);

  const handlePressEnd = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (isHomepage) {
      // This was a short press on the homepage, so scroll to section
      const element = document.getElementById(targetSectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    setTooltip({ isVisible: false, text: '' });
  }, [isHomepage, targetSectionId]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isHomepage) {
      // Prevent the <Link> component's default navigation on short-press
      e.preventDefault();
    }
    // On other pages, the default Link behavior is allowed to proceed
  }, [isHomepage]);

  const eventHandlers = {
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    onClick: handleClick,
  };

  const memoizedTooltip = useMemo(() => tooltip, [tooltip.isVisible, tooltip.text]);

  return {
    eventHandlers,
    tooltip: memoizedTooltip,
  };
};
