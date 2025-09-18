import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook for fetching system metrics with React Query
 * Provides caching, background refetching, and error handling
 */
export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/system-metrics');
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch system metrics');
      }
      return data.data;
    },
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
  });
};
