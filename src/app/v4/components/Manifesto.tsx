'use client';

import React from 'react';
import { Film, Terminal, Zap, CheckCircle2 } from 'lucide-react';

export default function Manifesto() {
  return (
    <section className="py-24 px-6 sm:px-8 border-t border-[#AFC2D5]/10 relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8E592F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619]">
            // 01 The Studio Thesis
          </span>
          <span className="h-[1px] w-12 bg-[#B5E619]/40" />
        </div>

        {/* Section Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#FBFFFE] leading-[1.05]">
              Most studios make you choose between <span className="text-[#B5E619]">storytelling</span> and <span className="text-[#AFC2D5]">engineering</span>.
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-base sm:text-lg text-[#AFC2D5] leading-relaxed">
              We reject the wall between creative media and technical software. When the person shaping the visual narrative also architects the code, the final product feels cohesive, intentional, and genuinely alive.
            </p>
          </div>
        </div>

        {/* Dual Brain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: The Film Brain */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#001514] border border-[#AFC2D5]/15 hover:border-[#8E592F]/60 transition-all duration-300 relative group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase text-[#FBFFFE] tracking-tight">The Film Brain</h3>
                  <p className="text-xs font-mono text-[#AFC2D5]/70">Narrative & Visual Emotion</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-bold text-[#8E592F]/40 group-hover:text-[#8E592F] transition-colors">
                01
              </span>
            </div>

            <p className="text-sm text-[#AFC2D5] leading-relaxed mb-8">
              Every frame and interaction must serve a narrative purpose. We bring cinema-grade camera work, deliberate pacing, high-end color grading, and sonic depth to every medium.
            </p>

            <ul className="space-y-3 border-t border-[#AFC2D5]/10 pt-6">
              {[
                'Cinematic Camera Direction & Lighting',
                'Retention-Engineered Editing Pacing',
                'Color Science & High-Dynamic Grading',
                'Immersive Spatial & Sound Design',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs font-mono text-[#FBFFFE]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#B5E619] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: The Engineer Brain */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#001514] border border-[#AFC2D5]/15 hover:border-[#B5E619]/60 transition-all duration-300 relative group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#B5E619]/10 text-[#B5E619] flex items-center justify-center">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase text-[#FBFFFE] tracking-tight">The Engineer Brain</h3>
                  <p className="text-xs font-mono text-[#AFC2D5]/70">Systems, Logic & AI</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-bold text-[#B5E619]/40 group-hover:text-[#B5E619] transition-colors">
                02
              </span>
            </div>

            <p className="text-sm text-[#AFC2D5] leading-relaxed mb-8">
              Software shouldn&apos;t feel like a sterile form. We engineer bespoke interactive applications, generative AI pipelines, and fluid reactive interfaces that perform at lightning speed.
            </p>

            <ul className="space-y-3 border-t border-[#AFC2D5]/10 pt-6">
              {[
                'Full-Stack Next.js & TypeScript Architecture',
                'Custom AI Pipelines & Automated Workflows',
                'Fluid Micro-Interactions & Modern WebGL',
                'Rock-Solid API & Database Infrastructure',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs font-mono text-[#FBFFFE]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#B5E619] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Synthesis Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#8E592F]/15 via-[#001514] to-[#B5E619]/10 border border-[#AFC2D5]/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#B5E619] text-[#001514] flex items-center justify-center font-bold shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#FBFFFE]">The Result</div>
              <div className="text-xs text-[#AFC2D5]">Products that feel emotionally engaging and technically unstoppable.</div>
            </div>
          </div>
          <a
            href="#work"
            className="text-xs font-mono uppercase tracking-wider text-[#B5E619] hover:underline shrink-0"
          >
            See how this translates to projects →
          </a>
        </div>
      </div>
    </section>
  );
}
