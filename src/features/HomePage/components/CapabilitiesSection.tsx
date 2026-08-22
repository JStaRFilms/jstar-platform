'use client';

import React, { useState } from 'react';
import { Film, Terminal, Bot, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CAPABILITIES = [
  {
    id: 'films',
    index: '01',
    name: 'J StaR FILMS',
    tagline: 'Cinematic Visual Media & Production',
    accentColor: '#8E592F',
    icon: Film,
    description: 'End-to-end visual storytelling from script to color-graded master. We produce high-retention YouTube content, brand documentaries, and commercial visual assets.',
    capabilities: [
      'Commercial & Brand Documentaries',
      'DaVinci Resolve Node-Tree Color Grading',
      'Multi-Camera Live Broadcast Systems',
      'YouTube Channel Optimization & Retention Editing',
      'High-Resolution Mobile Cinematography',
    ],
    deliverables: 'Raw footage ingest, script editing, sound design, custom LUT grading, and 4K deliverable masters.',
    link: '#inquiry',
    linkText: 'Commission a Film',
  },
  {
    id: 'labs',
    index: '02',
    name: 'J StaR LABS',
    tagline: 'Software, Web Applications & Utilities',
    accentColor: '#B5E619',
    icon: Terminal,
    description: 'Engineering fast, responsive, modern digital products. From system-wide desktop utilities to full-stack Next.js platforms that solve real operational bottlenecks.',
    capabilities: [
      'Next.js 15 & React Full-Stack Platforms',
      'Local-First Windows Desktop Utilities (Python/Electron)',
      'Gamified & Interactive Web Interfaces',
      'PostgreSQL / Prisma Database Architectures',
      'Offline-First IndexedDB Web Apps',
    ],
    deliverables: 'Architecture blueprint, responsive codebase, CI/CD deployment, documentation, and source code handoff.',
    link: '#inquiry',
    linkText: 'Build an Application',
  },
  {
    id: 'ai',
    index: '03',
    name: 'J StaR AI',
    tagline: 'Intelligent Workflows & Custom LLMs',
    accentColor: '#AFC2D5',
    icon: Bot,
    description: 'Custom AI implementations tailored to creative workflows. Eliminating repetitive grunt work through local AI models, smart agent pipelines, and the JohnGPT assistant.',
    capabilities: [
      'Custom LLM Assistants & Knowledge Bases (RAG)',
      'Local ONNX Inference for Desktop Privacy',
      'Multimodal Document & Video Ingest Pipelines',
      'System-Wide Hotkey Query Integrations (Blink)',
      'Prompt Engineering & Agent Evaluation Suites',
    ],
    deliverables: 'Custom AI models/endpoints, system integrations, private embeddings, and deployment automation.',
    link: '#inquiry',
    linkText: 'Engineer an AI System',
  },
];

export const CapabilitiesSection: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="capabilities" className="py-24 bg-ink-black relative border-t border-powder-blue/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-powder-blue/20 text-powder-blue font-mono text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-chartreuse" />
              02 // Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
              Three Disciplines. <br />
              <span className="text-chartreuse">One Creative Studio.</span>
            </h2>
          </div>
          <p className="text-powder-blue/80 max-w-md text-base leading-relaxed">
            We don't offer generic 25-item service menus. We operate in three clear, focused divisions that deliver measurable craft and software excellence.
          </p>
        </div>

        {/* 3 Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CAPABILITIES.map((cap, index) => {
            const Icon = cap.icon;
            const isHovered = hoveredIdx === index;

            return (
              <div
                key={cap.id}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 hover:border-chartreuse/60 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Subtle top indicator */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-sm font-bold text-powder-blue/60 group-hover:text-chartreuse transition-colors">
                      [{cap.index} // {cap.id.toUpperCase()}]
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-card border border-powder-blue/20 group-hover:border-chartreuse group-hover:bg-chartreuse/10 flex items-center justify-center text-chartreuse transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-ghost-white mb-2 group-hover:text-chartreuse transition-colors">
                    {cap.name}
                  </h3>
                  <p className="text-xs font-mono text-toffee-brown mb-6">
                    {cap.tagline}
                  </p>

                  <p className="text-sm text-powder-blue/80 leading-relaxed mb-8">
                    {cap.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-powder-blue/60 block mb-2">
                      Key Capabilities
                    </span>
                    {cap.capabilities.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-ghost-white/90">
                        <Check className="w-3.5 h-3.5 text-chartreuse flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-6 border-t border-powder-blue/10 flex items-center justify-between">
                  <div className="text-[11px] text-powder-blue/60 font-mono">
                    High-Impact Scopes
                  </div>
                  <Link
                    href={cap.link}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-chartreuse group-hover:underline"
                  >
                    {cap.linkText}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
