'use client';

import React, { useState } from 'react';
import { Layers, ArrowUpRight, ChevronRight } from 'lucide-react';
import { ProjectItem, SHOWCASE_PROJECTS } from './v3-theme';

interface ShowcaseSectionProps {
  playFeedback?: () => void;
}

export function ShowcaseSection({ playFeedback }: ShowcaseSectionProps) {
  const [filter, setFilter] = useState<'all' | 'Film' | 'Software' | 'AI Systems'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = filter === 'all' 
    ? SHOWCASE_PROJECTS 
    : SHOWCASE_PROJECTS.filter((p) => p.category === filter);

  const handleFilterClick = (cat: 'all' | 'Film' | 'Software' | 'AI Systems') => {
    if (playFeedback) playFeedback();
    setFilter(cat);
  };

  const handleProjectSelect = (project: ProjectItem) => {
    if (playFeedback) playFeedback();
    setSelectedProject(project);
  };

  return (
    <section id="showcase" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-[#AFC2D5]/15 bg-[#001514]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#AFC2D5]/15">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619] font-bold flex items-center gap-2">
              <span className="w-4 h-px bg-[#B5E619]" />
              02 / SELECTED WORK & CASE STUDIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FBFFFE] uppercase tracking-tight">
              Proof Over Claims.
            </h2>
            <p className="text-sm text-[#AFC2D5] max-w-xl">
              Authentic projects built from scratch across cinematic production, modern web systems, and applied AI.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#001514] border border-[#AFC2D5]/20 backdrop-blur-xl">
            {(['all', 'Film', 'Software', 'AI Systems'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterClick(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase transition-all duration-300 ${
                  filter === cat
                    ? 'bg-[#B5E619] text-[#001514] font-bold shadow-[0_0_12px_rgba(181,230,25,0.3)]'
                    : 'text-[#AFC2D5] hover:text-[#FBFFFE] hover:bg-[#AFC2D5]/10'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Projects List (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            {filteredProjects.map((project, idx) => {
              const isSelected = selectedProject?.id === project.id;
              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={`group cursor-pointer p-6 sm:p-7 rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                    isSelected
                      ? 'bg-[#001514] border-[#B5E619] shadow-[0_0_30px_rgba(181,230,25,0.2)] scale-[1.01]'
                      : 'bg-[#001514]/70 border-[#AFC2D5]/20 hover:border-[#AFC2D5]/50 hover:bg-[#001514]/90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#AFC2D5]/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#AFC2D5]/60 font-bold">
                        0{idx + 1}
                      </span>
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold"
                        style={{ 
                          backgroundColor: `${project.accent}20`,
                          color: project.accent,
                          border: `1px solid ${project.accent}50` 
                        }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#B5E619] bg-[#B5E619]/10 px-3 py-1 rounded-full border border-[#B5E619]/20 self-start sm:self-auto">
                      {project.metrics}
                    </span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#FBFFFE] group-hover:text-[#B5E619] transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-[#B5E619] translate-x-1 -translate-y-1' : 'text-[#AFC2D5] group-hover:text-[#FBFFFE]'}`} />
                    </div>
                    <p className="text-xs font-mono text-[#AFC2D5]">
                      {project.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[#AFC2D5]/90 leading-relaxed pt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#001514] border border-[#AFC2D5]/15 text-[#AFC2D5]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Interactive Inspect Inspector (Right Column) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            {selectedProject ? (
              <div className="p-7 rounded-3xl bg-[#001514] border border-[#B5E619]/40 backdrop-blur-2xl shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in duration-300">
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: selectedProject.accent }}
                />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#AFC2D5]">
                      CASE STUDY DEEP-DIVE
                    </span>
                    <span className="font-mono text-xs font-bold text-[#B5E619]">
                      {selectedProject.metrics}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#FBFFFE]">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs font-mono text-[#AFC2D5]">
                    {selectedProject.subtitle}
                  </p>
                </div>

                {/* Problem, Solution, Outcome Pillars */}
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#001514]/80 border border-[#8E592F]/30 space-y-1">
                    <span className="text-[11px] font-mono text-[#8E592F] uppercase font-bold block">
                      The Challenge / Problem
                    </span>
                    <p className="text-xs text-[#FBFFFE] leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#001514]/80 border border-[#AFC2D5]/30 space-y-1">
                    <span className="text-[11px] font-mono text-[#AFC2D5] uppercase font-bold block">
                      Engineered Solution
                    </span>
                    <p className="text-xs text-[#FBFFFE] leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#001514]/80 border border-[#B5E619]/40 space-y-1">
                    <span className="text-[11px] font-mono text-[#B5E619] uppercase font-bold block">
                      Verifiable Outcome
                    </span>
                    <p className="text-xs text-[#FBFFFE] leading-relaxed font-semibold">
                      {selectedProject.outcome}
                    </p>
                  </div>
                </div>

                {/* Interactive Simulated Preview */}
                <div className="p-4 rounded-2xl bg-[#001514] border border-[#AFC2D5]/20 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#AFC2D5] block">
                    FEATURED HIGHLIGHT PREVIEW
                  </span>
                  <div className="p-3 rounded-xl bg-[#001514]/90 border border-[#B5E619]/20 font-mono text-xs text-[#B5E619] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B5E619] animate-pulse" />
                    <span>{selectedProject.visualHighlight}</span>
                  </div>
                </div>

                <a
                  href="#terminal"
                  className="w-full text-center py-3.5 rounded-xl bg-[#B5E619] text-[#001514] font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(181,230,25,0.3)] hover:bg-[#B5E619]/90 transition-colors"
                >
                  <span>Commission Similar Project</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-[#001514]/60 border border-[#AFC2D5]/20 backdrop-blur-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#001514] border border-[#B5E619]/30 flex items-center justify-center mx-auto text-[#B5E619]">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#FBFFFE]">
                    Select a Project to Inspect
                  </h4>
                  <p className="text-xs text-[#AFC2D5]">
                    Click any project on the left to reveal technical breakdowns, architecture decisions, and measured outcomes.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
