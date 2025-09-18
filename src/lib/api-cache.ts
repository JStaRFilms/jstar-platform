/**
 * API Caching and Optimization System
 * Provides intelligent caching, request deduplication, and performance optimization
 */

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

interface PendingRequest<T = any> {
  promise: Promise<T>;
  timestamp: number;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

class APICacheManager {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, PendingRequest>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count for cache analytics
    entry.hits++;
    return entry.data;
  }

  /**
   * Set data in cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    });
  }

  /**
   * Check if a request is currently pending (for deduplication)
   */
  getPendingRequest<T>(key: string): Promise<T> | null {
    const pending = this.pendingRequests.get(key);
    if (!pending) return null;

    // Clean up old pending requests (older than 30 seconds)
    const now = Date.now();
    if (now - pending.timestamp > 30 * 1000) {
      this.pendingRequests.delete(key);
      return null;
    }

    return pending.promise;
  }

  /**
   * Register a pending request for deduplication
   */
  setPendingRequest<T>(key: string): Promise<T> {
    let resolve: (value: T) => void;
    let reject: (error: any) => void;

    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
      resolve: resolve!,
      reject: reject!
    });

    return promise;
  }

  /**
   * Resolve a pending request and cache the result
   */
  resolvePendingRequest<T>(key: string, data: T, cacheTtl?: number): void {
    const pending = this.pendingRequests.get(key);
    if (pending) {
      pending.resolve(data);
      this.pendingRequests.delete(key);

      // Cache the result if TTL provided
      if (cacheTtl) {
        this.set(key, data, cacheTtl);
      }
    }
  }

  /**
   * Reject a pending request
   */
  rejectPendingRequest(key: string, error: any): void {
    const pending = this.pendingRequests.get(key);
    if (pending) {
      pending.reject(error);
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let totalEntries = 0;
    let expiredEntries = 0;
    let totalHits = 0;

    for (const [key, entry] of this.cache) {
      totalEntries++;
      totalHits += entry.hits;

      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      }
    }

    return {
      totalEntries,
      expiredEntries,
      activeEntries: totalEntries - expiredEntries,
      totalHits,
      pendingRequests: this.pendingRequests.size
    };
  }

  /**
   * Clean up expired cache entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`APICache: Cleaned up ${cleaned} expired entries`);
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Destroy the cache manager
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Global cache instance
export const apiCache = new APICacheManager();

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SYSTEM_METRICS: 2 * 60 * 1000, // 2 minutes
  DIAGNOSTICS: 5 * 60 * 1000,     // 5 minutes
  AI_HEALTH: 1 * 60 * 1000,       // 1 minute
  QUICK_STATS: 30 * 1000,         // 30 seconds
} as const;

/**
 * Generate cache key for API requests
 */
export function generateCacheKey(endpoint: string, params?: Record<string, any>): string {
  const baseKey = endpoint.replace('/api/', '').replace(/\//g, ':');
  if (!params || Object.keys(params).length === 0) {
    return baseKey;
  }

  // Sort params for consistent key generation
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return `${baseKey}?${sortedParams}`;
}

/**
 * Cached API response wrapper
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    skipCache?: boolean;
    forceRefresh?: boolean;
  } = {}
): Promise<T> {
  const { ttl = CACHE_TTL.SYSTEM_METRICS, skipCache = false, forceRefresh = false } = options;

  // Check for pending request (deduplication)
  const pendingRequest = apiCache.getPendingRequest<T>(key);
  if (pendingRequest && !forceRefresh) {
    return pendingRequest;
  }

  // Check cache unless skipping or forcing refresh
  if (!skipCache && !forceRefresh) {
    const cached = apiCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }
  }

  // Register pending request for deduplication
  const promise = apiCache.setPendingRequest<T>(key);

  try {
    const data = await fetcher();
    apiCache.resolvePendingRequest(key, data, ttl);
    return data;
  } catch (error) {
    apiCache.rejectPendingRequest(key, error);
    throw error;
  }
}
