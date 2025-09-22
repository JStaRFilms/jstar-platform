'use client';

import { useState, useCallback, useEffect } from 'react';
import { FullscreenState } from '../types';

/**
 * Custom hook for managing fullscreen functionality
 * Provides state management and utilities for fullscreen mode across components
 */
export const useFullscreen = () => {
  const [fullscreenState, setFullscreenState] = useState<FullscreenState>({
    isActive: false,
    targetElement: null,
  });

  // Toggle fullscreen for a specific element
  const toggleFullscreen = useCallback((target: 'messageList' | 'messageDetails' | 'responseComposer') => {
    setFullscreenState(prev => {
      const isCurrentlyActive = prev.isActive && prev.targetElement === target;

      if (isCurrentlyActive) {
        // Exit fullscreen
        document.body.classList.remove('fullscreen-active');
        return {
          isActive: false,
          targetElement: null,
        };
      } else {
        // Enter fullscreen for new target
        document.body.classList.add('fullscreen-active');
        return {
          isActive: true,
          targetElement: target,
        };
      }
    });
  }, []);

  // Exit fullscreen mode
  const exitFullscreen = useCallback(() => {
    setFullscreenState({
      isActive: false,
      targetElement: null,
    });
    document.body.classList.remove('fullscreen-active');
  }, []);

  // Check if a specific element is in fullscreen
  const isFullscreen = useCallback((target: 'messageList' | 'messageDetails' | 'responseComposer') => {
    return fullscreenState.isActive && fullscreenState.targetElement === target;
  }, [fullscreenState]);

  // Keyboard shortcut for exiting fullscreen (Escape key)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenState.isActive) {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [fullscreenState.isActive, exitFullscreen]);

  // Handle fullscreen change events (for browser fullscreen API)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && fullscreenState.isActive) {
        // Browser exited fullscreen, also exit our custom fullscreen
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [fullscreenState.isActive, exitFullscreen]);

  return {
    fullscreenState,
    toggleFullscreen,
    exitFullscreen,
    isFullscreen,
  };
};
