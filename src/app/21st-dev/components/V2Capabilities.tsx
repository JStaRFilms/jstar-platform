'use client';

import React from 'react';
import ScrambleText from './ScrambleText';
import KineticBorderCard from './KineticBorderCard';
import { Film, Terminal, Bot, ArrowUpRight } from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    name: 'J StaR FILMS',
    tagline: 'Cinematic Production & Post-Production',
    desc: 'High-end commercial films, brand documentaries, DaVinci Resolve color science grading, and YouTube channel content pipelines.',
    specs: ['DaVinci Resolve Studio', '4K Multi-Camera Live Broadcast', 'Sound Design & Pacing', 'Organic Channel Growth'],
    color: '#8E592F',
    isFeatured: false,
  },
  {
    num: '02',
    name: 'J StaR LABS',
    tagline: 'Full-Stack Digital Products & SaaS',
    desc: 'High-performance web applications, offline-first desktop tools (Blink, MindGuard), and custom tools tailored for creative workflows.',
    specs: ['Next.js 15 & React 19', 'TypeScript Strict Mode', 'Electron & Native OS APIs', 'High-Performance WebGL'],
    color: '#B5E619',
    isFeatured: true,
  },
  {
    num: '03',
    name: 'J StaR AI',
    tagline: 'Local Neural Inference & Automation',
    desc: 'Privacy-first AI assistants, local ONNX neural networks, Gemini multi-agent systems, and specialized creator growth engines.',
    specs: ['ONNX Runtime Offline', 'Gemini 2.5 / OpenAI Pipelines', 'RAG Embeddings & Vector Search', 'Autonomous Task Agents'],
    color: '#AFC2D5',
    isFeatured: false,
  },
];

export const V2Capabilities: React.FC = () => {
  return (
    <section id="capabilities" className="py-28 px-6 bg-ink-black relative border-b border-powder-blue/15">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono text-chartreuse uppercase tracking-widest block">
              <ScrambleText text="02 // THREE STUDIO DIVISIONS" />
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
              Crafted with rigor across <br />
              <span className="text-chartreuse">media, code, and intelligence.</span>
            </h2>
          </div>
          <p className="text-sm font-mono text-powder-blue/70 max-w-sm">
            Each division operates independently or synchronizes into an integrated product and marketing engine.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PILLARS.map((pillar) => {
            if (pillar.isFeatured) {
              return (
                <KineticBorderCard key={pillar.num} glowColor="#B5E619" className="h-full">
                  <div className="h-full flex flex-col justify-between space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-chartreuse font-bold">[{pillar.num} // CORE]</span>
                        <span className="text-powder-blue/60">DEPLOYED</span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-ghost-white mb-1">
                          {pillar.name}
                        </h3>
                        <p className="text-xs font-mono text-chartreuse mb-4">
                          {pillar.tagline}
                        </p>
                        <p className="text-sm text-powder-blue/80 font-light leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-powder-blue/10">
                        {pillar.specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono text-powder-blue/90">
                            <span className="w-1.5 h-1.5 rounded-full bg-chartreuse" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-powder-blue/10 flex items-center justify-between text-xs font-mono text-chartreuse font-bold">
                      <span>Explore Labs Division</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </KineticBorderCard>
              );
            }

            return (
              <div
                key={pillar.num}
                className="p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 flex flex-col justify-between space-y-8 hover:border-chartreuse/40 transition-colors group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-xs font-mono text-powder-blue/60">
                    <span>[{pillar.num}]</span>
                    <span>ACTIVE</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-ghost-white mb-1 group-hover:text-chartreuse transition-colors">
                      {pillar.name}
                    </h3>
                    <p className="text-xs font-mono text-powder-blue/70 mb-4">
                      {pillar.tagline}
                    </p>
                    <p className="text-sm text-powder-blue/80 font-light leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-powder-blue/10">
                    {pillar.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-powder-blue/90">
                        <span className="w-1.5 h-1.5 rounded-full bg-powder-blue/40" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-powder-blue/10 flex items-center justify-between text-xs font-mono text-powder-blue/70 group-hover:text-ghost-white transition-colors">
                  <span>View Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default V2Capabilities;
