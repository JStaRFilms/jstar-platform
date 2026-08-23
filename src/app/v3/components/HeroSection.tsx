'use client';

import React from 'react';
import { ArrowUpRight, Cpu, Film, Code, Compass } from 'lucide-react';
import { LensType, LENSES, CANONICAL_METRICS } from './v3-theme';

interface HeroSectionProps {
  activeLens: LensType;
  onSelectLens: (lens: LensType) => void;
  playFeedback?: () => void;
}

export function HeroSection({ activeLens, onSelectLens, playFeedback }: HeroSectionProps) {
  const currentLensConfig = LENSES[activeLens];

  const handleLensClick = (lensId: LensType) => {
    if (playFeedback) playFeedback();
    onSelectLens(lensId);
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between pt-28 md:pt-36 pb-12 px-4 sm:px-6 md:px-8">
      {/* Top Editorial Annotation */}
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-6 border-b border-[#AFC2D5]/15">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001514] border border-[#B5E619]/40 text-[11px] font-mono uppercase tracking-widest text-[#B5E619] shadow-[0_0_10px_rgba(181,230,25,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B5E619] animate-ping" />
            V3 / CREATIVE TECHNOLOGY STUDIO
          </span>
          <span className="hidden sm:inline text-xs font-mono text-[#AFC2D5]/70">
            LOCATED AT THE INTERSECTION OF CINEMA & CODE
          </span>
        </div>

        {/* 4-Lens Interactive Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#001514]/90 border border-[#AFC2D5]/20 backdrop-blur-xl shadow-xl">
          {(['film', 'code', 'ai', 'polymath'] as LensType[]).map((lensKey) => {
            const lens = LENSES[lensKey];
            const isSelected = activeLens === lensKey;
            const icons = {
              film: <Film className="w-3.5 h-3.5" />,
              code: <Code className="w-3.5 h-3.5" />,
              ai: <Cpu className="w-3.5 h-3.5" />,
              polymath: <Compass className="w-3.5 h-3.5" />,
            };

            return (
              <button
                key={lensKey}
                onClick={() => handleLensClick(lensKey)}
                className={`group relative px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#B5E619] text-[#001514] font-bold shadow-[0_0_16px_rgba(181,230,25,0.4)] scale-100'
                    : 'text-[#AFC2D5] hover:text-[#FBFFFE] hover:bg-[#AFC2D5]/10'
                }`}
              >
                <span>{icons[lensKey]}</span>
                <span>{lens.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Hero Headline & Spatial Depth Presentation */}
      <div className="max-w-7xl mx-auto w-full my-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Big Editorial Typography */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="space-y-2">
              <p className="font-mono text-xs md:text-sm tracking-widest text-[#AFC2D5] uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-[#B5E619]" />
                John Oluleke-Oke · Polymath & Creator
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#FBFFFE] leading-[1.02] uppercase font-sans">
                We Build Things <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#B5E619] via-[#FBFFFE] to-[#AFC2D5] drop-shadow-[0_0_35px_rgba(181,230,25,0.25)]">
                  Worth Watching.
                </span>
              </h1>
            </div>

            {/* Dynamic Lens Focus Pitch */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#001514]/80 border border-[#AFC2D5]/20 backdrop-blur-xl transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div
                className="absolute top-0 left-0 h-1 w-full transition-colors duration-500"
                style={{ backgroundColor: currentLensConfig.accentColor }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#B5E619]">
                      {currentLensConfig.badge}
                    </span>
                    <span className="text-xs text-[#AFC2D5]/50">•</span>
                    <span className="text-xs text-[#AFC2D5] font-mono">ACTIVE PERSPECTIVE</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FBFFFE] tracking-tight">
                    {currentLensConfig.tagline}
                  </h3>
                  <p className="text-sm text-[#AFC2D5]/90 max-w-2xl leading-relaxed">
                    {currentLensConfig.description}
                  </p>
                </div>

                <div className="shrink-0 sm:text-right border-t sm:border-t-0 sm:border-l border-[#AFC2D5]/15 pt-3 sm:pt-0 sm:pl-6">
                  <span className="block text-2xl sm:text-3xl font-extrabold text-[#FBFFFE] font-mono">
                    {currentLensConfig.highlightMetric}
                  </span>
                  <span className="block text-[11px] font-mono text-[#AFC2D5] max-w-[140px]">
                    {currentLensConfig.highlightLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#showcase"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#B5E619] text-[#001514] font-bold text-xs uppercase tracking-widest hover:bg-[#B5E619]/90 transition-all duration-300 shadow-[0_0_25px_rgba(181,230,25,0.35)] hover:shadow-[0_0_35px_rgba(181,230,25,0.55)] hover:scale-105"
              >
                <span>Explore Selected Work</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="#terminal"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#001514]/90 border border-[#AFC2D5]/30 text-[#FBFFFE] font-semibold text-xs uppercase tracking-wider hover:border-[#B5E619]/60 hover:text-[#B5E619] transition-all duration-300 backdrop-blur-md"
              >
                <span>Launch Project Scope</span>
                <span className="text-[#AFC2D5] group-hover:text-[#B5E619] font-mono">→</span>
              </a>

              <a
                href="#polymath"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8E592F]/20 border border-[#8E592F]/40 text-[#FBFFFE] text-xs font-mono hover:bg-[#8E592F]/30 transition-colors"
              >
                <span>⚡</span>
                <span className="text-[#AFC2D5]">Speedcuber & Saxophonist Polymath</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual HUD Glass Module */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-[#001514]/85 border border-[#AFC2D5]/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-[#B5E619]/40 transition-all duration-500">
              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#B5E619]/10 blur-2xl group-hover:bg-[#B5E619]/20 transition-all duration-500" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between pb-3 border-b border-[#AFC2D5]/15">
                  <span className="text-[10px] font-mono tracking-widest text-[#AFC2D5] uppercase">
                    STUDIO MANIFESTO PILLARS
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#B5E619] shadow-[0_0_6px_#B5E619]" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#001514] border border-[#AFC2D5]/10 hover:border-[#8E592F]/50 transition-colors">
                    <span className="text-xs font-mono text-[#8E592F] font-bold block mb-1">#01 · FILMMAKING BRAIN</span>
                    <p className="text-xs text-[#FBFFFE] font-medium leading-snug">
                      Visual pacing, emotional arc, high dynamic range color grading, and commercial retention.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#001514] border border-[#AFC2D5]/10 hover:border-[#AFC2D5]/50 transition-colors">
                    <span className="text-xs font-mono text-[#AFC2D5] font-bold block mb-1">#02 · SOFTWARE ARCHITECTURE</span>
                    <p className="text-xs text-[#FBFFFE] font-medium leading-snug">
                      Next.js 15, WebGL GLSL shaders, distributed databases, and high-performance real-time UI.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#001514] border border-[#AFC2D5]/10 hover:border-[#B5E619]/50 transition-colors">
                    <span className="text-xs font-mono text-[#B5E619] font-bold block mb-1">#03 · APPLIED INTELLIGENCE</span>
                    <p className="text-xs text-[#FBFFFE] font-medium leading-snug">
                      Knowledge graph indexers, multimodal workflows, and autonomous creative desktop utilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Canonical Real-World Metrics Bar */}
      <div className="max-w-7xl mx-auto w-full pt-6 border-t border-[#AFC2D5]/15">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {CANONICAL_METRICS.map((metric, idx) => (
            <div key={idx} className="flex flex-col gap-1 group">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-[#FBFFFE] group-hover:text-[#B5E619] transition-colors">
                  {metric.value}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B5E619] opacity-70 group-hover:opacity-100" />
              </div>
              <span className="text-xs font-bold text-[#FBFFFE] uppercase tracking-wide">
                {metric.label}
              </span>
              <span className="text-[11px] text-[#AFC2D5]/70 leading-tight">
                {metric.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
