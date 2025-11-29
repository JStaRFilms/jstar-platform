'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioProject } from '../../../content/portfolio';

interface PortfolioModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  isOpen: boolean;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ project, onClose, isOpen }) => {
  if (!isOpen || !project) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div
          className="relative w-full max-w-6xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center z-20 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Video Container - Simple 16:9 */}
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            {project.source === 'youtube' && project.videoId ? (
              <iframe
                className="absolute top-0 left-0 !w-full !h-full"
                src={`https://www.youtube.com/embed/${project.videoId}?autoplay=1&rel=0`}
                title={project.title}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : project.videoUrl ? (
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={project.videoUrl}
                controls
                autoPlay
              />
            ) : project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          {/* Content */}
          <div className="p-8 bg-white dark:bg-gray-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {project.title}
            </h2>

            <div className="flex items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{project.source === 'manual' ? 'Case Study' : 'Video'}</span>
              <span>•</span>
              <span>{new Date(project.publishedAt).getFullYear()}</span>
              {project.views && (
                <>
                  <span>•</span>
                  <span>{project.views.toLocaleString()} views</span>
                </>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>View Project</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {(project.source === 'manual' || project.hasDetailedCaseStudy) && (
                <Link
                  href={`/portfolio/${project.id}`}
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
                >
                  Full Case Study
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioModal;
