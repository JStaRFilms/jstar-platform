'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, Zap, Terminal, Check } from 'lucide-react';
import { MagneticButton } from '@/components/motion/MagneticButton';

export const ButtonGalleryLab: React.FC = () => {
  const [clicked, setClicked] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setClicked(id);
    setTimeout(() => setClicked(null), 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-powder-blue/20 text-chartreuse font-mono text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Lab 03 // Next-Gen Button Architecture
        </div>
        <h3 className="text-2xl font-bold text-ghost-white">
          Liquid Glass, Playful Spring, Shimmer Radar & Magnetic Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Liquid Frosted Glass Button */}
        <div className="p-6 rounded-3xl bg-card border border-powder-blue/20 flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-powder-blue/60">
            01 // Liquid Glass
          </span>

          <button
            onClick={() => handleClick('glass')}
            className="group relative px-6 py-3 rounded-2xl bg-powder-blue/10 backdrop-blur-xl border border-powder-blue/30 hover:border-chartreuse/60 text-ghost-white font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-glow-chartreuse active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">
              {clicked === 'glass' ? <Check className="w-4 h-4 text-chartreuse" /> : <Play className="w-4 h-4 text-chartreuse fill-current" />}
              <span>Glass Preview</span>
            </span>
          </button>

          <p className="text-[11px] text-powder-blue/70">
            Frosted acrylic glass with top specular highlight and hover blur bloom.
          </p>
        </div>

        {/* 2. Playful Spring Bounce Button */}
        <div className="p-6 rounded-3xl bg-card border border-powder-blue/20 flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-powder-blue/60">
            02 // Playful Spring
          </span>

          <motion.button
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.92, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            onClick={() => handleClick('playful')}
            className="px-6 py-3 rounded-full bg-chartreuse text-ink-black font-extrabold text-sm shadow-glow-chartreuse flex items-center gap-2 cursor-pointer"
          >
            {clicked === 'playful' ? <Check className="w-4 h-4" /> : <Zap className="w-4 h-4 fill-current" />}
            <span>Playful Spring</span>
          </motion.button>

          <p className="text-[11px] text-powder-blue/70">
            High-damped spring physics with micro-rotational momentum on hover/click.
          </p>
        </div>

        {/* 3. Shimmer Radar Glow Button */}
        <div className="p-6 rounded-3xl bg-card border border-powder-blue/20 flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-powder-blue/60">
            03 // Shimmer Sweep
          </span>

          <button
            onClick={() => handleClick('shimmer')}
            className="relative px-6 py-3 rounded-full bg-ink-black border border-powder-blue/20 hover:border-chartreuse text-ghost-white text-sm font-bold overflow-hidden group cursor-pointer transition-colors"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-chartreuse/25 to-transparent pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">
              <span>Shimmer Sweep</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-chartreuse" />
            </span>
          </button>

          <p className="text-[11px] text-powder-blue/70">
            Continuous light beam sweep across dark ink background on hover.
          </p>
        </div>

        {/* 4. Magnetic Physics Button */}
        <div className="p-6 rounded-3xl bg-card border border-powder-blue/20 flex flex-col justify-between items-center text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-powder-blue/60">
            04 // Magnetic Pill
          </span>

          <MagneticButton strength={0.4}>
            <button
              onClick={() => handleClick('magnetic')}
              className="px-6 py-3 rounded-full bg-toffee-brown/20 border border-toffee-brown/50 text-ghost-white hover:border-chartreuse hover:text-chartreuse text-sm font-bold font-mono transition-colors shadow-lg"
            >
              <span>[ MAGNETIC ]</span>
            </button>
          </MagneticButton>

          <p className="text-[11px] text-powder-blue/70">
            Cursor gravitational tether pulling the button towards cursor centroid.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ButtonGalleryLab;
