'use client';

import React from 'react';
import { Award, Music, Terminal, Film, Sparkles, Brain } from 'lucide-react';

export default function FounderStory() {
  const credentials = [
    {
      icon: Film,
      title: 'Filmmaker & Director',
      desc: '280+ videos produced & edited, 176K+ views generated with high emotional retention.',
    },
    {
      icon: Terminal,
      title: 'Software Engineer',
      desc: 'Architecting modern TypeScript, Next.js, and autonomous AI systems from the ground up.',
    },
    {
      icon: Award,
      title: 'Speedcubing Champion',
      desc: 'National competition winner. Extreme pattern recognition and execution under pressure.',
    },
    {
      icon: Music,
      title: 'ABRSM Saxophonist',
      desc: 'Grade 5 alto saxophonist. Brings melodic timing, tempo, and harmony to visual rhythm.',
    },
  ];

  return (
    <section id="about" className="py-24 px-6 sm:px-8 border-t border-[#AFC2D5]/10 relative overflow-hidden">
      {/* Background Accent Gradient */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#8E592F]/15 via-transparent to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619]">
            // 04 The Builder
          </span>
          <span className="h-[1px] w-12 bg-[#B5E619]/40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Vision */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FBFFFE] leading-[1.05] mb-6">
              &ldquo;I like building things that shouldn&apos;t logically belong together.&rdquo;
            </h2>

            <div className="space-y-4 text-base text-[#AFC2D5] leading-relaxed mb-8">
              <p>
                I&apos;m <strong className="text-[#FBFFFE]">John Oluleke-Oke</strong>. Most people specialize in one narrow box: either you make art or you write software. I believe the most extraordinary work happens right at the messy intersection.
              </p>
              <p>
                When you partner with J StaR, you aren&apos;t handed off between disconnected departments or waiting weeks for five different agencies to talk to each other. You collaborate directly with a creative technologist who knows how to shoot a cinema commercial and write the production code that powers the interactive launch.
              </p>
            </div>

            {/* Quick Quote Pill */}
            <div className="p-4 rounded-2xl bg-[#8E592F]/15 border border-[#8E592F]/30 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#B5E619] text-[#001514] flex items-center justify-center font-bold shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#AFC2D5]">
                <strong className="text-[#FBFFFE] block">Direct Access</strong>
                Zero bloated corporate layers. Pure creative & engineering firepower.
              </div>
            </div>
          </div>

          {/* Right Column: Credentials & Multidisciplinary Moat */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {credentials.map((cred, idx) => {
              const Icon = cred.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#001514] border border-[#AFC2D5]/15 hover:border-[#B5E619]/50 transition-colors flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-[#FBFFFE] mb-1">
                      {cred.title}
                    </h3>
                    <p className="text-xs text-[#AFC2D5]/80 leading-relaxed">
                      {cred.desc}
                    </p>
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
