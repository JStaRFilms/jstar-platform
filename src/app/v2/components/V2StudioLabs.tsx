'use client';

import React from 'react';
import ScrambleText from './ScrambleText';
import ColorGradeSlider from './ColorGradeSlider';
import TerminalLiveWindow from './TerminalLiveWindow';
import PerspectiveTiltCard from './PerspectiveTiltCard';
import RadialSpotlightCard from './RadialSpotlightCard';
import { Zap, Star } from 'lucide-react';

export const V2StudioLabs: React.FC = () => {
  return (
    <section id="labs" className="py-28 px-6 bg-ink-black relative border-b border-powder-blue/15">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono text-chartreuse uppercase tracking-widest block">
              <ScrambleText text="04 // INTERACTIVE STUDIO LABS" />
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
              Interactive instruments & <br />
              <span className="text-chartreuse">creative technology labs.</span>
            </h2>
          </div>
          <p className="text-sm font-mono text-powder-blue/70 max-w-sm">
            Live interactive demonstrations of our color science pipeline, local neural inference, and 3D UI physics.
          </p>
        </div>

        {/* Top Split: Live Terminal + Color Grade Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Terminal Window (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="mb-4">
              <span className="text-xs font-mono text-powder-blue/70 uppercase tracking-wider block mb-1">
                Lab 01 // Local-First Neural Engine
              </span>
              <h3 className="text-xl font-bold text-ghost-white">
                Deterministic CLI & Zero-Cloud Latency
              </h3>
            </div>
            <TerminalLiveWindow className="h-full" />
          </div>

          {/* Color Grade Scrubber (6 Cols) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-card border border-powder-blue/20 flex flex-col justify-between shadow-2xl">
            <div className="mb-4">
              <span className="text-xs font-mono text-toffee-brown uppercase tracking-wider block mb-1">
                Lab 02 // DaVinci Color Science
              </span>
              <h3 className="text-xl font-bold text-ghost-white">
                S-Log3 to 35mm ACES Filmic LUT
              </h3>
            </div>
            <ColorGradeSlider />
          </div>
        </div>

        {/* Bottom Split: 3D Spring Tilt Card + Radial Spotlight Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* 3D Spring Tilt Card */}
          <PerspectiveTiltCard className="min-h-[280px]">
            <div style={{ transform: 'translateZ(40px)' }} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-chartreuse/10 border border-chartreuse/30 text-chartreuse font-bold">
                  Lab 03 // 3D Perspective Tilt
                </span>
                <span className="text-xs font-mono text-powder-blue/60">SPRING PHYSICS</span>
              </div>
              <h4 className="text-2xl font-bold text-ghost-white">
                Blink AI Desktop Sidekick
              </h4>
              <p className="text-xs text-powder-blue/80 leading-relaxed font-light">
                Spring-damped 3D rotation with depth layers. Mouse coordinate tracking creates natural optical parallax on high-refresh displays.
              </p>
            </div>

            <div
              style={{ transform: 'translateZ(60px)' }}
              className="p-4 rounded-2xl bg-ink-black/80 border border-powder-blue/15 flex items-center justify-between mt-6"
            >
              <div className="flex items-center gap-2 text-chartreuse text-xs font-mono font-bold">
                <Zap className="w-4 h-4" />
                <span>Local ONNX Model</span>
              </div>
              <span className="text-[11px] font-mono text-powder-blue/70">0.018ms Latency</span>
            </div>
          </PerspectiveTiltCard>

          {/* Radial Spotlight Card */}
          <RadialSpotlightCard spotlightColor="rgba(181, 230, 25, 0.18)" className="min-h-[280px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-toffee-brown/20 border border-toffee-brown/40 text-toffee-brown font-bold">
                  Lab 04 // Radial Spotlight Flare
                </span>
                <span className="text-xs font-mono text-powder-blue/60">CURSOR TRACKED</span>
              </div>
              <h4 className="text-2xl font-bold text-ghost-white">
                High-Retention Video Editing Pipeline
              </h4>
              <p className="text-xs text-powder-blue/80 leading-relaxed font-light">
                Dynamic spotlight follow effect illuminating filmic grain and metadata tags on pointer hover.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-powder-blue/10 mt-6">
              <div className="flex items-center gap-1.5 text-chartreuse">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-mono text-powder-blue/70">280+ Directed Masters</span>
            </div>
          </RadialSpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default V2StudioLabs;
