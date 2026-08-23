'use client';

import React, { useState } from 'react';
import { Film, Terminal, Bot, ArrowUpRight, Sparkles, Layers, Sliders, Check } from 'lucide-react';

export default function Disciplines() {
  const [activeTab, setActiveTab] = useState<'films' | 'labs' | 'intelligence'>('films');

  const disciplines = [
    {
      id: 'films' as const,
      num: '01',
      title: 'J StaR Films',
      subtitle: 'Cinematic Media & Visual Storytelling',
      icon: Film,
      accent: 'border-[#8E592F] text-[#8E592F]',
      badgeBg: 'bg-[#8E592F]/20 text-[#FBFFFE]',
      description:
        'We produce visually arresting commercial films, brand documentaries, and high-retention video assets that capture attention within the first three seconds and never let go.',
      deliverables: [
        'Commercials & Brand Short Films',
        'YouTube & Creator Video Production',
        'Documentaries & Campus Showcases',
        'Cinema-Grade Color Grading & 4K Mastering',
        'Dynamic Sound Design & Audio Mixing',
      ],
      highlight: '176K+ views & 280+ produced films',
    },
    {
      id: 'labs' as const,
      num: '02',
      title: 'J StaR Labs',
      subtitle: 'Web Platforms & Interactive Digital Products',
      icon: Terminal,
      accent: 'border-[#B5E619] text-[#B5E619]',
      badgeBg: 'bg-[#B5E619]/20 text-[#B5E619]',
      description:
        'We architect high-performance web applications, interactive visual platforms, and bespoke creative tools built with modern TypeScript, Next.js, and cutting-edge frontend engineering.',
      deliverables: [
        'Custom Web Applications & Portals',
        'Interactive & Editorial Web Experiences',
        'Fluid Animations & GPU-Accelerated UI',
        'Database & API Architecture (PostgreSQL/Prisma)',
        'Full-Stack Production Deployments',
      ],
      highlight: 'Sub-second load times & bespoke UX',
    },
    {
      id: 'intelligence' as const,
      num: '03',
      title: 'J StaR Intelligence',
      subtitle: 'AI Systems & Creative Workflow Automation',
      icon: Bot,
      accent: 'border-[#AFC2D5] text-[#AFC2D5]',
      badgeBg: 'bg-[#AFC2D5]/20 text-[#FBFFFE]',
      description:
        'We engineer tailored AI systems, multi-engine autonomous agents, and automated knowledge pipelines that eliminate repetitive friction and multiply creative leverage.',
      deliverables: [
        'Multi-Provider AI Assistant Systems (JohnGPT)',
        'Automated Knowledge & Note Graph Tools',
        'RAG & Vector Search Infrastructures',
        'Video Transcription & Intelligence Pipelines',
        'Custom Productivity & Desktop Utilities',
      ],
      highlight: 'Autonomous tools that do real work',
    },
  ];

  return (
    <section id="disciplines" className="py-24 px-6 sm:px-8 border-t border-[#AFC2D5]/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619]">
                // 02 Core Disciplines
              </span>
              <span className="h-[1px] w-12 bg-[#B5E619]/40" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FBFFFE]">
              Three Worlds. <br />
              <span className="text-[#AFC2D5]">One Dedicated Studio.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#AFC2D5] max-w-md">
            Instead of twenty generic services thrown at a wall, we focus on three intersecting pillars where cinema and technology amplify each other.
          </p>
        </div>

        {/* Pillar Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {disciplines.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-8 sm:p-10 rounded-3xl bg-[#001514] border transition-all duration-300 flex flex-col justify-between cursor-pointer group relative ${
                  isSelected
                    ? 'border-[#B5E619] shadow-[0_0_30px_rgba(181,230,25,0.12)]'
                    : 'border-[#AFC2D5]/15 hover:border-[#AFC2D5]/40'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.badgeBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono tracking-widest uppercase text-[#AFC2D5]/70">
                        {item.num} // Pillar
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[#AFC2D5]/40 group-hover:text-[#B5E619] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-[#FBFFFE] mb-2 group-hover:text-[#B5E619] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-[#8E592F] mb-6 font-semibold">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#AFC2D5] leading-relaxed mb-8">
                    {item.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="border-t border-[#AFC2D5]/10 pt-6 mb-8">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#AFC2D5]/50 mb-3">
                      Capabilities & Scope
                    </div>
                    <ul className="space-y-2.5">
                      {item.deliverables.map((deliv, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-xs text-[#FBFFFE]/90">
                          <Check className="w-3.5 h-3.5 text-[#B5E619] shrink-0" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Highlight */}
                <div className="pt-4 border-t border-[#AFC2D5]/10 flex items-center justify-between text-xs font-mono text-[#AFC2D5]/80">
                  <span>Standard</span>
                  <span className="text-[#B5E619] font-medium">{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
