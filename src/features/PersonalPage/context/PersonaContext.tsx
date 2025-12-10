'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PersonaMode } from '../types';

interface PersonaContextType {
  mode: PersonaMode;
  setMode: (mode: PersonaMode) => void;
  toggleMode: () => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PersonaMode>('ENGINEER'); // Default to Engineer

  const toggleMode = () => {
    setMode((prev) => (prev === 'ENGINEER' ? 'CREATOR' : 'ENGINEER'));
  };

  return (
    <PersonaContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersonaMode = () => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersonaMode must be used within a PersonaProvider');
  }
  return context;
};
