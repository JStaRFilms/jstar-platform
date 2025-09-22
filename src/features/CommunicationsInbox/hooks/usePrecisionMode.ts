'use client';

import { useState, useCallback, useEffect } from 'react';
import { PrecisionModeState } from '../types';

/**
 * Custom hook for managing precision mode functionality
 * Provides state management and utilities for precision tracking and analysis
 */
export const usePrecisionMode = () => {
  const [precisionState, setPrecisionState] = useState<PrecisionModeState>({
    isActive: false,
    precisionLevel: 85.714,
    detailTracking: true,
    highlightUnnecessary: false,
    showTimestamps: true,
  });

  // Toggle precision mode on/off
  const togglePrecisionMode = useCallback(() => {
    setPrecisionState(prev => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  }, []);

  // Update precision level
  const updatePrecisionLevel = useCallback((level: number) => {
    setPrecisionState(prev => ({
      ...prev,
      precisionLevel: Math.max(0, Math.min(100, level)),
    }));
  }, []);

  // Toggle detail tracking
  const toggleDetailTracking = useCallback(() => {
    setPrecisionState(prev => ({
      ...prev,
      detailTracking: !prev.detailTracking,
    }));
  }, []);

  // Toggle unnecessary highlighting
  const toggleHighlightUnnecessary = useCallback(() => {
    setPrecisionState(prev => ({
      ...prev,
      highlightUnnecessary: !prev.highlightUnnecessary,
    }));
  }, []);

  // Toggle timestamp display
  const toggleShowTimestamps = useCallback(() => {
    setPrecisionState(prev => ({
      ...prev,
      showTimestamps: !prev.showTimestamps,
    }));
  }, []);

  // Calculate precision score based on current settings
  const calculatePrecisionScore = useCallback(() => {
    let score = 100;

    // Deduct points for disabled features
    if (!precisionState.detailTracking) score -= 5;
    if (!precisionState.showTimestamps) score -= 3;
    if (precisionState.highlightUnnecessary) score -= 2; // This is actually a precision feature

    return Math.max(0, Math.min(100, score));
  }, [precisionState]);

  // Auto-update precision level based on current settings
  useEffect(() => {
    const newScore = calculatePrecisionScore();
    setPrecisionState(prev => ({
      ...prev,
      precisionLevel: newScore,
    }));
  }, [calculatePrecisionScore]);

  // Keyboard shortcut for precision mode (Ctrl/Cmd + P)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        togglePrecisionMode();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePrecisionMode]);

  return {
    precisionState,
    togglePrecisionMode,
    updatePrecisionLevel,
    toggleDetailTracking,
    toggleHighlightUnnecessary,
    toggleShowTimestamps,
    calculatePrecisionScore,
  };
};
