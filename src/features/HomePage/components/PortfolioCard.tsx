'use client';

import React from 'react';
import Image from 'next/image';
import { PortfolioProject } from '../../../content/portfolio';
import { Play, ArrowUpRight, Github, ExternalLink } from 'lucide-react';

interface PortfolioCardProps {
  project: PortfolioProject;
  onClick: (startTime?: number) => void;
  getTagColor?: (tag: string, index: number) => string;
  forceHover?: boolean;
  isModalOpen?: boolean;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onClick }) => {
  const isVideo = project.category === 'video';

  return (
    <div
      onClick={() => onClick(0)}
      data-cursor
      data-cursor-text={isVideo ? 'PLAY' : 'VIEW'}
      className="group relative h-full flex flex-col justify-between rounded-3xl bg-card border border-powder-blue/15 hover:border-chartreuse/60 transition-all duration-500 overflow-hidden cursor-pointer shadow-lg hover:shadow-glow-chartreuse"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full h-56 bg-ink-black overflow-hidden">
        <Image
          src={project.thumbnailUrl || '/me/cam.jpg'}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-ink-black/80 border border-powder-blue/20 text-powder-blue">
            {project.category === 'video' ? '🎬 Film / Media' : '💻 Software / AI'}
          </span>
        </div>

        {/* Play icon overlay for videos */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-chartreuse/90 text-ink-black flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-ghost-white mb-2 group-hover:text-chartreuse transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-powder-blue/80 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md font-mono text-[10px] bg-ink-black border border-powder-blue/10 text-powder-blue/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-powder-blue/10 flex items-center justify-between">
          <span className="text-xs font-mono text-powder-blue/60">
            {project.hasDetailedCaseStudy ? 'Read Case Study' : 'View Project'}
          </span>
          <div className="flex items-center gap-1 text-chartreuse font-mono text-xs font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Explore</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
