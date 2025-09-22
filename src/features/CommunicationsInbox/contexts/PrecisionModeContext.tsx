'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { usePrecisionMode } from '../hooks/usePrecisionMode';
import { PrecisionModeState } from '../types';

/**
 * Context for precision mode functionality
 * Provides precision mode state and controls to all child components
 */
interface PrecisionModeContextType {
  precisionState: PrecisionModeState;
  togglePrecisionMode: () => void;
  updatePrecisionLevel: (level: number) => void;
  toggleDetailTracking: () => void;
  toggleHighlightUnnecessary: () => void;
  toggleShowTimestamps: () => void;
  calculatePrecisionScore: () => number;
}

const PrecisionModeContext = createContext<PrecisionModeContextType | undefined>(undefined);

/**
 * Props for the PrecisionModeProvider component
 */
interface PrecisionModeProviderProps {
  children: ReactNode;
}

/**
 * PrecisionModeProvider Component
 * Provides precision mode context to all child components
 * Wraps the Communications Inbox feature to enable precision mode functionality
 */
export const PrecisionModeProvider: React.FC<PrecisionModeProviderProps> = ({ children }) => {
  const precisionMode = usePrecisionMode();

  return (
    <PrecisionModeContext.Provider value={precisionMode}>
      {children}
    </PrecisionModeContext.Provider>
  );
};

/**
 * Custom hook to use precision mode context
 * Must be used within a PrecisionModeProvider
 */
export const usePrecisionModeContext = (): PrecisionModeContextType => {
  const context = useContext(PrecisionModeContext);

  if (context === undefined) {
    throw new Error('usePrecisionModeContext must be used within a PrecisionModeProvider');
  }

  return context;
};
