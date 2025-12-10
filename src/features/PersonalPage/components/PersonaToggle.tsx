'use client';

import { usePersonaMode } from '../context/PersonaContext';
import { Code, Video, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, otherwise I'll use template literals

export default function PersonaToggle() {
  const { mode, setMode } = usePersonaMode();

  return (
    <div className="relative inline-flex items-center justify-center p-1 bg-neutral-900/50 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
      {/* Sliding Background */}
      <div
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-br transition-all duration-500 ease-spring",
          mode === 'ENGINEER'
            ? "left-1 from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            : "left-[calc(50%)] from-amber-600 to-orange-500 shadow-[0_0_20px_rgba(217,119,6,0.5)]"
        )}
      />

      {/* Engineer Button */}
      <button
        onClick={() => setMode('ENGINEER')}
        className={cn(
          "relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors duration-300",
          mode === 'ENGINEER' ? "text-white" : "text-neutral-400 hover:text-white"
        )}
      >
        <Code className="w-4 h-4" />
        <span className="tracking-wide">ENGINEER</span>
      </button>

      {/* Creator Button */}
      <button
        onClick={() => setMode('CREATOR')}
        className={cn(
          "relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors duration-300",
          mode === 'CREATOR' ? "text-white" : "text-neutral-400 hover:text-white"
        )}
      >
        <Video className="w-4 h-4" />
        <span className="tracking-wide">CREATOR</span>
      </button>

      {/* Sparkle Decoration */}
      <div className="absolute -top-1 -right-1">
        <Sparkles className={cn(
          "w-4 h-4 transition-colors duration-500",
          mode === 'ENGINEER' ? "text-cyan-400" : "text-amber-400"
        )} />
      </div>
    </div>
  );
}
