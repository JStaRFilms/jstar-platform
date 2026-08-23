'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Sliders, Sparkles } from 'lucide-react';

interface ColorGradeSliderProps {
  className?: string;
}

export const ColorGradeSlider: React.FC<ColorGradeSliderProps> = ({ className = '' }) => {
  const [sliderPos, setSliderPos] = useState(58);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const updatePosition = (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percentage = (relativeX / rect.width) * 100;
      setSliderPos(percentage);
    };

    updatePosition(e.clientX);

    const onPointerMove = (moveEvent: PointerEvent) => {
      updatePosition(moveEvent.clientX);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-powder-blue/80">
          <Sparkles className="w-3.5 h-3.5 text-chartreuse" />
          <span>DAVINCI RESOLVE ACES PIPELINE</span>
        </div>
        <span className="text-chartreuse font-bold">
          {Math.round(sliderPos)}% GRADED
        </span>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-ink-black border border-powder-blue/20 cursor-ew-resize select-none shadow-2xl group"
      >
        {/* Base Image: Graded / Enhanced Film Look */}
        <div className="absolute inset-0">
          <Image
            src="/me/cam.jpg"
            alt="DaVinci Resolve Graded"
            fill
            className="object-cover"
            style={{
              filter: 'saturate(1.35) contrast(1.2) brightness(0.95)',
            }}
          />
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-chartreuse/90 text-ink-black shadow-md">
              GRADED (ACES LUT)
            </span>
          </div>
        </div>

        {/* Clipped Top Image: Raw S-Log3 Flat Profile */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="relative w-full h-full" style={{ width: '100%' }}>
            <Image
              src="/me/cam.jpg"
              alt="Raw Log Profile"
              fill
              className="object-cover"
              style={{
                filter: 'saturate(0.4) contrast(0.75) brightness(1.15)',
              }}
            />
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-ink-black/85 text-powder-blue border border-powder-blue/30">
                RAW (S-LOG3 FLAT)
              </span>
            </div>
          </div>
        </div>

        {/* Divider Scrubber Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-chartreuse shadow-glow-chartreuse pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-chartreuse text-ink-black flex items-center justify-center shadow-2xl border-2 border-ink-black transform group-hover:scale-110 transition-transform">
            <Sliders className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-powder-blue/60 pt-1">
        <span>← Drag to compare S-Log3 flat capture</span>
        <span>Custom 35mm film emulation →</span>
      </div>
    </div>
  );
};

export default ColorGradeSlider;
