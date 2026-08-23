'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Film, Terminal, Bot, Sparkles, ExternalLink } from 'lucide-react';

export default function SelectedWork() {
  const [filter, setFilter] = useState<'all' | 'films' | 'labs' | 'intelligence'>('all');

  const projects = [
    {
      id: 'blink',
      title: 'Blink Desktop Automation',
      category: 'intelligence',
      categoryLabel: 'AI Utility / Desktop',
      tagline: 'Autonomous multi-step creative workflow engine',
      description:
        'A high-leverage desktop utility designed to eliminate friction in repetitive creative workflows, leveraging local AI to execute complex multi-step tasks in milliseconds.',
      tags: ['AI Agents', 'Automation', 'Python / TS', 'Workflow'],
      metric: 'Zero-friction execution',
      icon: Bot,
      color: '#B5E619',
    },
    {
      id: 'adaptive-study-game',
      title: 'Adaptive AI Study Game',
      category: 'labs',
      categoryLabel: 'Interactive Web Platform',
      tagline: 'Gamified real-time adaptive learning engine',
      description:
        'A full-stack web application that dynamically alters gameplay mechanics and pedagogical pacing based on student performance telemetry and live AI evaluation.',
      tags: ['Next.js', 'React', 'Generative AI', 'Game UI'],
      metric: 'Dynamic real-time difficulty',
      icon: Terminal,
      color: '#AFC2D5',
    },
    {
      id: 'samsung-galaxy',
      title: 'Samsung Galaxy Visual Campaign',
      category: 'films',
      categoryLabel: 'Cinematic Commercial',
      tagline: 'Precision mobile cinematography & color grading',
      description:
        'A high-tempo commercial film demonstrating cinematic mobile lens craft, dynamic kinetic camera movement, and bespoke high-dynamic-range color science.',
      tags: ['Cinematography', 'Color Grading', 'Commercial', 'Sound Design'],
      metric: '4K Cinema Delivery',
      icon: Film,
      color: '#8E592F',
    },
    {
      id: 'elizade-film',
      title: 'Elizade University Campus Documentary',
      category: 'films',
      categoryLabel: 'Brand Documentary',
      tagline: 'Human-centric institutional visual narrative',
      description:
        'A multi-location cinematic documentary capturing the vibrant community and architectural beauty of the institution, edited with deliberate emotional pacing.',
      tags: ['Documentary', 'Storytelling', 'Drone / Aerial', 'Direction'],
      metric: 'Full campus showcase',
      icon: Film,
      color: '#8E592F',
    },
    {
      id: 'obsidian-automator',
      title: 'Obsidian Semantic Tag Automator',
      category: 'intelligence',
      categoryLabel: 'Developer Tool / RAG',
      tagline: 'Semantic classification for personal knowledge graphs',
      description:
        'An intelligent metadata and semantic classification system that analyzes unstructured markdown knowledge graphs and automatically organizes taxonomies.',
      tags: ['Obsidian', 'Semantic NLP', 'Productivity', 'Open Source'],
      metric: 'Self-organizing notes',
      icon: Bot,
      color: '#B5E619',
    },
  ];

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="work" className="py-24 px-6 sm:px-8 border-t border-[#AFC2D5]/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619]">
                // 03 Selected Work
              </span>
              <span className="h-[1px] w-12 bg-[#B5E619]/40" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FBFFFE]">
              Real Projects. <br />
              <span className="text-[#AFC2D5]">Tangible Impact.</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 border border-[#AFC2D5]/15 p-1.5 rounded-full bg-[#001514] w-fit">
            {[
              { label: 'All Work', value: 'all' },
              { label: 'Films', value: 'films' },
              { label: 'Labs & Web', value: 'labs' },
              { label: 'Intelligence & AI', value: 'intelligence' },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                  filter === btn.value
                    ? 'bg-[#B5E619] text-[#001514] font-bold shadow-[0_0_15px_rgba(181,230,25,0.3)]'
                    : 'text-[#AFC2D5] hover:text-[#FBFFFE]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Work Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => {
            const Icon = project.icon;
            const isLarge = idx === 0;
            return (
              <div
                key={project.id}
                className={`rounded-3xl bg-[#001514] border border-[#AFC2D5]/15 hover:border-[#B5E619]/60 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_0_40px_rgba(0,21,20,0.8)] ${
                  isLarge ? 'md:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#AFC2D5]/70">
                        {project.categoryLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#B5E619] bg-[#B5E619]/10 px-3 py-1 rounded-full">
                      <span>{project.metric}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#FBFFFE] group-hover:text-[#B5E619] transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm font-mono text-[#8E592F] mb-4">
                    {project.tagline}
                  </p>

                  {/* Detailed Description */}
                  <p className="text-sm text-[#AFC2D5] leading-relaxed mb-8 max-w-3xl">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Tags & Indicator */}
                <div className="pt-6 border-t border-[#AFC2D5]/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono text-[#AFC2D5]/80 bg-[#AFC2D5]/5 border border-[#AFC2D5]/10 px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-[#FBFFFE] group-hover:text-[#B5E619] transition-colors">
                    <span>Explore Project</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
