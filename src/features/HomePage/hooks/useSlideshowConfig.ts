import { useState, useEffect } from 'react';

/**
 * Interface for slideshow configuration
 */
export interface SlideshowConfig {
  id?: string;
  autoPlayEnabled: boolean;
  autoPlayInterval: number;
  showIndicators: boolean;
  transitionEffect: string;
  transitionDuration: number;
}

/**
 * Custom hook for managing slideshow configuration
 * Fetches configuration from API and provides defaults
 */
export const useSlideshowConfig = () => {
  const [config, setConfig] = useState<SlideshowConfig>({
    autoPlayEnabled: true,
    autoPlayInterval: 7000,
    showIndicators: true,
    transitionEffect: 'fade',
    transitionDuration: 700,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch slideshow configuration from API
   */
  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/hero-slideshow-config');
      const data = await response.json();

      if (data.status === 'success') {
        setConfig(data.data);
      } else {
        // Use defaults if API fails
        console.warn('Using default slideshow configuration');
      }
    } catch (err) {
      console.error('Error fetching slideshow config:', err);
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
      // Keep default config on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch configuration on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    refetch: fetchConfig,
  };
};
