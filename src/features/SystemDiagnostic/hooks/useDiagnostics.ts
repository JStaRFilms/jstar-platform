import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for running system diagnostics
 * Provides mutation handling with proper error states and success callbacks
 */
export const useDiagnostics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/diagnostics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to run diagnostics');
      }
      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch system metrics after successful diagnostics
      queryClient.invalidateQueries({ queryKey: ['system-metrics'] });
    },
  });
};
