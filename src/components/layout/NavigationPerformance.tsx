'use client';

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Navigation Performance Optimizations
 * Advanced interaction patterns and performance enhancements
 */

// Performance monitoring hook
export const useNavigationPerformance = () => {
  const startTimeRef = useRef<number>(0);
  const metricsRef = useRef({
    navigationCount: 0,
    averageTransitionTime: 0,
    slowestTransition: 0,
    failedNavigations: 0
  });

  const startNavigation = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endNavigation = useCallback((success: boolean = true) => {
    const endTime = performance.now();
    const duration = endTime - startTimeRef.current;

    const metrics = metricsRef.current;
    metrics.navigationCount++;

    if (success) {
      metrics.averageTransitionTime =
        (metrics.averageTransitionTime * (metrics.navigationCount - 1) + duration) / metrics.navigationCount;
      metrics.slowestTransition = Math.max(metrics.slowestTransition, duration);
    } else {
      metrics.failedNavigations++;
    }

    // Log performance metrics
    if (process.env.NODE_ENV === 'development') {
      console.log('Navigation Performance:', {
        duration: `${duration.toFixed(2)}ms`,
        success,
        average: `${metrics.averageTransitionTime.toFixed(2)}ms`,
        slowest: `${metrics.slowestTransition.toFixed(2)}ms`,
        totalNavigations: metrics.navigationCount,
        failureRate: `${((metrics.failedNavigations / metrics.navigationCount) * 100).toFixed(1)}%`
      });
    }
  }, []);

  return { startNavigation, endNavigation, metrics: metricsRef.current };
};

// Advanced keyboard navigation hook
export const useKeyboardNavigation = (
  items: Array<{ id: string; href: string }>,
  onNavigate?: (item: { id: string; href: string }) => void
) => {
  const currentIndexRef = useRef(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    const currentIndex = currentIndexRef.current;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, items.length - 1);
        currentIndexRef.current = nextIndex;
        focusItem(items[nextIndex]);
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        currentIndexRef.current = prevIndex;
        focusItem(items[prevIndex]);
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < items.length) {
          onNavigate?.(items[currentIndex]);
        }
        break;

      case 'Home':
        e.preventDefault();
        currentIndexRef.current = 0;
        focusItem(items[0]);
        break;

      case 'End':
        e.preventDefault();
        currentIndexRef.current = items.length - 1;
        focusItem(items[items.length - 1]);
        break;
    }
  }, [items, onNavigate]);

  const focusItem = useCallback((item: { id: string; href: string }) => {
    const element = document.querySelector(`[data-nav-item="${item.id}"]`) as HTMLElement;
    element?.focus();
  }, []);

  const resetFocus = useCallback(() => {
    currentIndexRef.current = -1;
  }, []);

  return { handleKeyDown, resetFocus };
};

// Smart prefetching hook
export const useSmartPrefetch = (routes: string[], enabled: boolean = true) => {
  const router = useRouter();
  const prefetchedRef = useRef<Set<string>>(new Set());

  const prefetchRoute = useCallback((route: string) => {
    if (enabled && !prefetchedRef.current.has(route)) {
      router.prefetch(route);
      prefetchedRef.current.add(route);
    }
  }, [router, enabled]);

  // Prefetch on hover with debouncing
  const prefetchOnHover = useCallback((route: string) => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      prefetchRoute(route);
    }, 100); // 100ms delay to avoid unnecessary prefetches

    return () => clearTimeout(timeoutId);
  }, [prefetchRoute, enabled]);

  // Prefetch on visible
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const route = entry.target.getAttribute('data-prefetch-route');
            if (route) {
              prefetchRoute(route);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    const prefetchElements = document.querySelectorAll('[data-prefetch-route]');
    prefetchElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [prefetchRoute, enabled]);

  return { prefetchOnHover, prefetchRoute };
};

// Advanced search with debouncing and caching
export const useAdvancedSearch = (
  searchFunction: (query: string) => Promise<any[]>,
  debounceMs: number = 300
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, any[]>>(new Map());

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // Check cache first
    if (cache.has(searchQuery)) {
      setResults(cache.get(searchQuery)!);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await searchFunction(searchQuery);
      setResults(searchResults);

      // Cache results
      setCache(prev => new Map(prev.set(searchQuery, searchResults)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchFunction, cache]);

  const debouncedSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, debounceMs);
  }, [performSearch, debounceMs]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    search: debouncedSearch,
    clearSearch,
    cacheSize: cache.size
  };
};

// Gesture navigation hook for mobile
export const useGestureNavigation = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    touchEndRef.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    if (!touchStartRef.current || !touchEndRef.current) return;

    const distanceX = touchStartRef.current.x - touchEndRef.current.x;
    const distanceY = touchStartRef.current.y - touchEndRef.current.y;
    const isLeftSwipe = distanceX > threshold;
    const isRightSwipe = distanceX < -threshold;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Only trigger horizontal swipes
    if (!isVerticalSwipe) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return { touchStart: touchStartRef.current, touchEnd: touchEndRef.current };
};

// Navigation analytics hook
export const useNavigationAnalytics = () => {
  const pathname = usePathname();
  const navigationHistoryRef = useRef<Array<{
    from: string;
    to: string;
    timestamp: number;
    duration: number;
  }>>([]);
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    if (lastPathRef.current && lastPathRef.current !== pathname) {
      const now = Date.now();
      const lastEntry = navigationHistoryRef.current[navigationHistoryRef.current.length - 1];

      if (lastEntry) {
        lastEntry.duration = now - lastEntry.timestamp;
      }

      navigationHistoryRef.current.push({
        from: lastPathRef.current,
        to: pathname,
        timestamp: now,
        duration: 0
      });
    }

    lastPathRef.current = pathname;
  }, [pathname]);

  const getAnalytics = useCallback(() => {
    const history = navigationHistoryRef.current;
    const totalNavigations = history.length;
    const averageDuration = totalNavigations > 0
      ? history.reduce((sum, entry) => sum + entry.duration, 0) / totalNavigations
      : 0;

    return {
      totalNavigations,
      averageDuration,
      navigationHistory: history,
      mostVisitedPaths: history.reduce((acc, entry) => {
        acc[entry.to] = (acc[entry.to] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, []);

  return { getAnalytics };
};

// Memory-efficient navigation state management
export const useOptimizedNavigationState = (initialState: any = {}) => {
  const stateRef = useRef(initialState);
  const listenersRef = useRef<Set<(state: any) => void>>(new Set());

  const getState = useCallback(() => stateRef.current, []);

  const setState = useCallback((newState: any | ((prevState: any) => any)) => {
    const currentState = stateRef.current;
    const updatedState = typeof newState === 'function' ? newState(currentState) : { ...currentState, ...newState };

    // Only update if state actually changed
    if (JSON.stringify(currentState) !== JSON.stringify(updatedState)) {
      stateRef.current = updatedState;
      listenersRef.current.forEach(listener => listener(updatedState));
    }
  }, []);

  const subscribe = useCallback((listener: (state: any) => void) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  return { getState, setState, subscribe };
};

export default {
  useNavigationPerformance,
  useKeyboardNavigation,
  useSmartPrefetch,
  useAdvancedSearch,
  useGestureNavigation,
  useNavigationAnalytics,
  useOptimizedNavigationState
};
