'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { manualProjects, PortfolioProject } from '../../../content/portfolio';
import PortfolioCard from './PortfolioCard';
import PortfolioModal from './PortfolioModal';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'web'>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = activeFilter === 'all'
    ? manualProjects
    : manualProjects.filter((item) => item.category === activeFilter);

  return (
    <section id="selected-work" className="py-24 bg-ink-black relative border-t border-powder-blue/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-powder-blue/20 text-powder-blue font-mono text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-chartreuse" />
              03 // Selected Work
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
              Curated Case Studies & <br />
              <span className="text-chartreuse">Live Deployments</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1.5 rounded-full bg-card border border-powder-blue/15">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-chartreuse text-ink-black shadow-sm'
                  : 'text-powder-blue hover:text-ghost-white'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                activeFilter === 'video'
                  ? 'bg-chartreuse text-ink-black shadow-sm'
                  : 'text-powder-blue hover:text-ghost-white'
              }`}
            >
              Films & Media
            </button>
            <button
              onClick={() => setActiveFilter('web')}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all ${
                activeFilter === 'web'
                  ? 'bg-chartreuse text-ink-black shadow-sm'
                  : 'text-powder-blue hover:text-ghost-white'
              }`}
            >
              Software & AI
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id}>
              <PortfolioCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA to Full Portfolio */}
        <div className="mt-16 p-8 rounded-3xl bg-card border border-powder-blue/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-toffee-brown/20 flex items-center justify-center text-toffee-brown flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-ghost-white">
                Looking for specific production archives or GitHub repositories?
              </h4>
              <p className="text-sm text-powder-blue/80">
                Explore our full library of DaVinci Resolve tutorials, open-source repositories, and client productions.
              </p>
            </div>
          </div>

          <Link
            href="/portfolio"
            className="px-6 py-3 rounded-full bg-card border border-powder-blue/30 text-ghost-white hover:border-chartreuse hover:text-chartreuse font-mono text-xs font-bold flex items-center gap-2 flex-shrink-0 transition-all"
          >
            Full Portfolio Archive
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Case Study Modal */}
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

export default PortfolioSection;
