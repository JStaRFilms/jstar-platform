'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ScrambleText from './ScrambleText';
import V2MagneticButton from './V2MagneticButton';
import { manualProjects, PortfolioProject } from '../../../content/portfolio';
import { ArrowUpRight, Play, ExternalLink } from 'lucide-react';
import PortfolioModal from '@/features/HomePage/components/PortfolioModal';

export const V2Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [filter, setFilter] = useState<'all' | 'video' | 'web'>('all');

  const filtered = filter === 'all'
    ? manualProjects
    : manualProjects.filter((p) => p.category === filter);

  return (
    <section id="work" className="py-28 px-6 bg-ink-black relative border-b border-powder-blue/15">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono text-chartreuse uppercase tracking-widest block">
              <ScrambleText text="03 // SELECTED WORK & ARTIFACTS" />
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
              Curated deployments and <br />
              <span className="text-chartreuse">production masters.</span>
            </h2>
          </div>

          {/* Clean Editorial Filter Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'all'
                  ? 'bg-chartreuse text-ink-black font-bold shadow-glow-chartreuse'
                  : 'text-powder-blue hover:text-ghost-white bg-card border border-powder-blue/20'
              }`}
            >
              [ ALL_WORK ]
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'video'
                  ? 'bg-chartreuse text-ink-black font-bold shadow-glow-chartreuse'
                  : 'text-powder-blue hover:text-ghost-white bg-card border border-powder-blue/20'
              }`}
            >
              [ FILMS & MEDIA ]
            </button>
            <button
              onClick={() => setFilter('web')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'web'
                  ? 'bg-chartreuse text-ink-black font-bold shadow-glow-chartreuse'
                  : 'text-powder-blue hover:text-ghost-white bg-card border border-powder-blue/20'
              }`}
            >
              [ SOFTWARE & AI ]
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => {
            const isVideo = project.category === 'video';
            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-3xl bg-card border border-powder-blue/15 hover:border-chartreuse/60 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between shadow-xl"
              >
                {/* Thumbnail */}
                <div className="relative h-60 w-full bg-ink-black overflow-hidden">
                  <Image
                    src={project.thumbnailUrl || '/me/cam.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-ink-black/90 border border-powder-blue/20 text-powder-blue">
                      {project.category === 'video' ? 'FILM' : 'SOFTWARE'}
                    </span>
                  </div>

                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-chartreuse/90 text-ink-black flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-ghost-white group-hover:text-chartreuse transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-powder-blue/80 leading-relaxed font-light line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded font-mono text-[10px] bg-ink-black border border-powder-blue/10 text-powder-blue/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-powder-blue/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-powder-blue/60">Explore Case Study</span>
                    <span className="text-chartreuse font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>OPEN</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProject && (
        <PortfolioModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default V2Portfolio;
