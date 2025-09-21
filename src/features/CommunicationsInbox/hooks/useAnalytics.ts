'use client';

import useSWR from 'swr';
import { AnalyticsResponse } from '../types';
import { fetchAnalytics, handleApiError, getErrorMessage } from '@/lib/communications-api';

/**
 * Custom hook for managing contact analytics with SWR
 * Provides data fetching, caching, and real-time updates for analytics
 */
export const useAnalytics = () => {
  // Fetch analytics with SWR
  const {
    data: response,
    error,
    isLoading,
    mutate,
    isValidating
  } = useSWR<AnalyticsResponse>(
    '/api/admin/contacts/analytics',
    () => fetchAnalytics(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes for analytics
      revalidateOnFocus: false, // Don't refresh on focus for analytics
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute deduping
      errorRetryCount: 3,
      errorRetryInterval: 10000,
    }
  );

  // Extract data from response
  const analytics = response?.data || null;

  // Calculate derived metrics
  const responseRate = analytics ?
    Math.round((analytics.respondedCount / Math.max(analytics.totalSubmissions, 1)) * 100) : 0;

  const pendingCount = analytics?.pendingCount || 0;
  const totalSubmissions = analytics?.totalSubmissions || 0;

  // Format data for QuickStats component
  const quickStats = analytics ? {
    total: totalSubmissions,
    unread: pendingCount,
    responded: analytics.respondedCount,
    responseRate,
    avgResponseTime: '24h', // TODO: Calculate from actual response time data
  } : {
    total: 0,
    unread: 0,
    responded: 0,
    responseRate: 0,
    avgResponseTime: '24h',
  };

  // Refresh data
  const refresh = () => {
    mutate();
  };

  return {
    // Raw data
    analytics,

    // Formatted data
    quickStats,

    // State
    isLoading,
    isValidating,
    error: error ? getErrorMessage(handleApiError(error)) : null,

    // Actions
    refresh,
    mutate,
  };
};
