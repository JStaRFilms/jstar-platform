'use client';

import React, { useState, useEffect } from 'react';

/**
 * Interface for slideshow configuration
 */
interface SlideshowConfig {
  id?: string;
  autoPlayEnabled: boolean;
  autoPlayInterval: number;
  showIndicators: boolean;
  transitionEffect: string;
  transitionDuration: number;
}

/**
 * Props for SlideshowConfig component
 */
interface SlideshowConfigProps {
  /** Callback when configuration is updated */
  onConfigUpdate?: (config: SlideshowConfig) => void;
}

/**
 * SlideshowConfig Component
 * Admin interface for managing hero slideshow configuration
 * Controls auto-play, transitions, indicators, and timing
 */
const SlideshowConfig: React.FC<SlideshowConfigProps> = ({ onConfigUpdate }) => {
  const [config, setConfig] = useState<SlideshowConfig>({
    autoPlayEnabled: true,
    autoPlayInterval: 7000,
    showIndicators: true,
    transitionEffect: 'fade',
    transitionDuration: 700,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch current configuration from API
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
        throw new Error(data.message || 'Failed to fetch configuration');
      }
    } catch (err) {
      console.error('Error fetching slideshow config:', err);
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save configuration to API
   */
  const saveConfig = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/admin/hero-slideshow-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setConfig(data.data);
        onConfigUpdate?.(data.data);
        // TODO: Show success notification
      } else {
        throw new Error(data.message || 'Failed to save configuration');
      }
    } catch (err) {
      console.error('Error saving slideshow config:', err);
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (field: keyof SlideshowConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch configuration on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading slideshow configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Slideshow Configuration
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configure how the hero slideshow behaves on your homepage
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="space-y-6">
        {/* Auto-play Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Auto-play Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Enable Auto-play */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoPlayEnabled"
                checked={config.autoPlayEnabled}
                onChange={(e) => handleChange('autoPlayEnabled', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="autoPlayEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable auto-play
              </label>
            </div>

            {/* Auto-play Interval */}
            <div>
              <label htmlFor="autoPlayInterval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auto-advance interval (seconds)
              </label>
              <select
                id="autoPlayInterval"
                value={config.autoPlayInterval}
                onChange={(e) => handleChange('autoPlayInterval', parseInt(e.target.value))}
                disabled={!config.autoPlayEnabled}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="3000">3 seconds</option>
                <option value="5000">5 seconds</option>
                <option value="7000">7 seconds</option>
                <option value="10000">10 seconds</option>
                <option value="15000">15 seconds</option>
                <option value="20000">20 seconds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Visual Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Show Indicators */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showIndicators"
                checked={config.showIndicators}
                onChange={(e) => handleChange('showIndicators', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="showIndicators" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Show slide indicators
              </label>
            </div>

            {/* Transition Effect */}
            <div>
              <label htmlFor="transitionEffect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transition effect
              </label>
              <select
                id="transitionEffect"
                value={config.transitionEffect}
                onChange={(e) => handleChange('transitionEffect', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Advanced Settings
          </h3>

          <div>
            <label htmlFor="transitionDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transition duration (milliseconds)
            </label>
            <input
              type="number"
              id="transitionDuration"
              value={config.transitionDuration}
              onChange={(e) => handleChange('transitionDuration', parseInt(e.target.value))}
              min="100"
              max="5000"
              step="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              How long transitions take (100-5000ms). Higher = slower transitions.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleChange('transitionDuration', 300)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
              >
                Fast (300ms)
              </button>
              <button
                type="button"
                onClick={() => handleChange('transitionDuration', 700)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
              >
                Normal (700ms)
              </button>
              <button
                type="button"
                onClick={() => handleChange('transitionDuration', 1500)}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
              >
                Slow (1500ms)
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={saveConfig}
            disabled={saving}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideshowConfig;
