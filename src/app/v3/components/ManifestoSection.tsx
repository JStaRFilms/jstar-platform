'use client';

import React from 'react';
import { Film, Terminal, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { CAPABILITIES } from './v3-theme';

interface ManifestoSectionProps {
  playFeedback?: () => void;
}

export function ManifestoSection({ playFeedback }: ManifestoSectionProps) {
  return (
    <section id="manifesto" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-[#AFC2D5]/15 bg-[#001514]/60">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Section Header & Manifesto Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619] font-bold flex items-center gap-2">
              <span className="w-4 h-px bg-[#B5E619]" />
              01 / THE MANIFESTO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#FBFFFE] uppercase tracking-tight">
              Different Disciplines. <br />
              <span className="text-[#AFC2D5]">One Studio.</span>
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <p className="text-lg sm:text-xl md:text-2xl text-[#FBFFFE] font-medium leading-relaxed">
              Most studios force you to choose between <span className="text-[#8E592F] font-bold">cinematic emotion</span> and <span className="text-[#B5E619] font-bold">technical excellence</span>. We refuse that compromise.
            </p>
            <p className="text-sm sm:text-base text-[#AFC2D5] leading-relaxed max-w-3xl">
              We shoot film, direct actors, design brand identities, engineer full-stack software, and build autonomous AI workflows under one roof. When you combine director-level visual storytelling with computer science rigor, the result is work that doesn&apos;t just look polished—it commands attention and converts.
            </p>
          </div>
        </div>

        {/* The 3 Core Capabilities Triad Cards */}
        <div id="capabilities" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#AFC2D5]/15">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#AFC2D5] block">
                CORE DISCIPLINES
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FBFFFE] uppercase">
                The Three Pillars of J StaR
              </h3>
            </div>
            <span className="text-xs font-mono text-[#B5E619] bg-[#001514] px-3 py-1.5 rounded-full border border-[#B5E619]/30">
              INTEGRATED FULL-STACK EXECUTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CAPABILITIES.map((cap) => {
              const icons = {
                film: <Film className="w-5 h-5 text-[#8E592F]" />,
                labs: <Terminal className="w-5 h-5 text-[#AFC2D5]" />,
                ai: <Cpu className="w-5 h-5 text-[#B5E619]" />,
              };

              return (
                <div
                  key={cap.id}
                  className="group relative p-7 rounded-3xl bg-[#001514]/90 border border-[#AFC2D5]/20 hover:border-[#B5E619]/50 transition-all duration-500 flex flex-col justify-between backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(181,230,25,0.15)] hover:-translate-y-1"
                >
                  {/* Top Bar */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#001514] border border-[#AFC2D5]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {icons[cap.id as keyof typeof icons]}
                      </div>
                      <span className="font-mono text-sm font-bold text-[#AFC2D5]/60 group-hover:text-[#B5E619] transition-colors">
                        {cap.number}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-[#FBFFFE] tracking-tight group-hover:text-[#B5E619] transition-colors">
                        {cap.title}
                      </h4>
                      <p className="text-xs font-mono text-[#AFC2D5] tracking-wide uppercase">
                        {cap.headline}
                      </p>
                      <p className="text-xs text-[#AFC2D5]/80 leading-relaxed pt-1">
                        {cap.description}
                      </p>
                    </div>

                    {/* Deliverables List */}
                    <div className="space-y-2 pt-3 border-t border-[#AFC2D5]/15">
                      <span className="text-[10px] font-mono tracking-widest text-[#AFC2D5]/70 uppercase block mb-1">
                        KEY CAPABILITIES
                      </span>
                      {cap.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#FBFFFE]/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B5E619] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-6 mt-6 border-t border-[#AFC2D5]/10">
                    <a
                      href="#showcase"
                      onClick={() => {
                        if (playFeedback) playFeedback();
                      }}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#AFC2D5] group-hover:text-[#B5E619] transition-colors"
                    >
                      <span>Explore Case Studies</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
