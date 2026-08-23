'use client';

import React from 'react';
import { ArrowRight, Play, Code2, Film, Sparkles } from 'lucide-react';

export default function Hero() {
  const stats = [
    { label: 'Views Generated', value: '176K+' },
    { label: 'Videos Produced & Cut', value: '280+' },
    { label: 'Verified Partnerships', value: '8+' },
    { label: 'Years Engineering & Film', value: '6+' },
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-12 px-6 sm:px-8 overflow-hidden">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-[#8E592F]/20 via-[#B5E619]/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      
      {/* Background Matrix/Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#afc2d508_1px,transparent_1px),linear-gradient(to_bottom,#afc2d508_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto">
        {/* Editorial Eyebrow */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#AFC2D5]/20 bg-[#001514]/70 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#B5E619] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#AFC2D5]">
              Creative Technology Studio
            </span>
          </div>
          <span className="hidden sm:inline text-xs font-mono text-[#AFC2D5]/40">//</span>
          <span className="hidden sm:inline text-xs font-mono text-[#AFC2D5]/70">
            Films · Digital Products · AI Systems
          </span>
        </div>

        {/* Big Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.92] text-[#FBFFFE] mb-8 max-w-5xl">
          We build things <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B5E619] via-[#FBFFFE] to-[#AFC2D5]">
            worth watching.
          </span>
        </h1>

        {/* Sub-headline & Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
          <p className="md:col-span-8 text-base sm:text-lg lg:text-xl text-[#AFC2D5] font-normal leading-relaxed max-w-2xl">
            Filmmaking meets software engineering. J StaR is an independent creative technology studio that turns ambitious ideas into cinematic media, high-performance digital products, and intelligent AI tools.
          </p>

          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-3 bg-[#B5E619] hover:bg-[#c2f325] text-[#001514] px-7 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(181,230,25,0.25)]"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 border border-[#AFC2D5]/25 hover:border-[#FBFFFE] text-[#FBFFFE] hover:bg-[#AFC2D5]/5 px-7 py-4 rounded-full text-sm font-medium transition-all duration-300"
            >
              <span>Explore Selected Work</span>
            </a>
          </div>
        </div>

        {/* Interactive Discipline Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#AFC2D5]/15">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#001514]/60 border border-[#AFC2D5]/10 hover:border-[#B5E619]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#AFC2D5]/60">01 / Discipline</div>
              <div className="text-sm font-bold text-[#FBFFFE]">Cinematic Film & Media</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#001514]/60 border border-[#AFC2D5]/10 hover:border-[#B5E619]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#AFC2D5]/60">02 / Discipline</div>
              <div className="text-sm font-bold text-[#FBFFFE]">Custom Web & Labs</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#001514]/60 border border-[#AFC2D5]/10 hover:border-[#B5E619]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#AFC2D5]/60">03 / Discipline</div>
              <div className="text-sm font-bold text-[#FBFFFE]">Creative AI Systems</div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Metric Strip */}
      <div className="max-w-7xl mx-auto w-full relative z-10 mt-12 pt-8 border-t border-[#AFC2D5]/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-[#FBFFFE] tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs font-mono text-[#AFC2D5]/70 uppercase tracking-wider mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
