'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioProject } from '../../../content/portfolio';
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer';
import { PlayCircleIcon, PauseCircleIcon } from '@/components/icons/static-icons';
import { InstagramEmbed } from '@/components/embeds/InstagramEmbed';

/**
 * Props for the PortfolioModal component.
 */
interface PortfolioModalProps {
  /** The project data to display. If null, the modal is hidden (though usually controlled by isOpen). */
  project: PortfolioProject | null;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** Boolean indicating if the modal is currently open. */
  isOpen: boolean;
  /** Initial start time for the video in seconds. */
  initialTime?: number;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * A modal component that displays detailed information about a portfolio project.
 * It features a split layout with a video player (using a custom YouTube hook) and a content section.
 */

// Custom Mute/Unmute Icons
const VolumeUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318 1.177-2.318 2.318v3.864c0 1.141 1.177 2.318 2.318 2.318h1.932l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.5 12c0-1.703-1.002-3.185-2.5-3.874v7.748c1.498-.689 2.5-2.17 2.5-3.874z" />
    <path d="M20.5 12c0 2.623-1.506 4.89-3.75 5.933v-2.13c1.247-.804 2.083-2.195 2.083-3.803s-.836-2.999-2.083-3.803V6.067C18.994 7.11 20.5 9.377 20.5 12z" />
  </svg>
);

const VolumeOffIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318 1.177-2.318 2.318v3.864c0 1.141 1.177 2.318 2.318 2.318h1.932l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM17.7 7.7l-1.4-1.4L12 10.6 7.7 6.3 6.3 7.7l4.3 4.3-4.3 4.3 1.4 1.4 4.3-4.3 4.3 4.3 1.4-1.4-4.3-4.3L17.7 7.7z" />
  </svg>
);

const PortfolioModal: React.FC<PortfolioModalProps> = ({ project, onClose, isOpen, initialTime = 0, onNext, onPrev, hasNext, hasPrev }) => {
  const [showControls, setShowControls] = useState(false);

  // Hook for YouTube Player
  const { isReady, isPlaying, isMuted, togglePlay, toggleMute } = useYouTubePlayer({
    videoId: project?.videoId || '',
    elementId: 'youtube-player-container',
    autoPlay: true,
    startTime: initialTime,
  });

  if (!isOpen || !project) return null;

  const isYouTube = project.source === 'youtube' && project.videoId;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 md:p-8" onClick={onClose}>
      <div
        className="relative w-full max-w-7xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Arrows */}
        {hasPrev && onPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors backdrop-blur-sm group/nav"
            aria-label="Previous Project"
          >
            <svg className="w-6 h-6 group-hover/nav:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {hasNext && onNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors backdrop-blur-sm group/nav"
            aria-label="Next Project"
          >
            <svg className="w-6 h-6 group-hover/nav:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* 70% Video Section */}
        <div
          className="w-full md:w-[70%] h-[40vh] md:h-full bg-black relative group"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {isYouTube ? (
            <>
              <div id="youtube-player-container" className="w-full h-full" />

              {/* Custom Controls Overlay */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 flex items-center justify-between ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
              >
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-primary transition-colors"
                >
                  {isPlaying ? (
                    <PauseCircleIcon className="w-12 h-12" />
                  ) : (
                    <PlayCircleIcon className="w-12 h-12" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
                >
                  {isMuted ? (
                    <>
                      <VolumeOffIcon className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">Unmute</span>
                    </>
                  ) : (
                    <>
                      <VolumeUpIcon className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white">Mute</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : project.source === 'instagram' && project.videoUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 overflow-hidden relative group-hover:bg-black transition-colors">
              {/* Ambient Background Effect */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <Image
                  src={project.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover blur-3xl opacity-40 scale-125"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Instagram Embed Container */}
              <div className="relative z-10 w-full h-full flex justify-center items-center p-4">
                <div className="shadow-2xl rounded-sm overflow-hidden max-h-full overflow-y-auto custom-scrollbar w-full flex justify-center">
                  <InstagramEmbed key={project.videoUrl} postUrl={project.videoUrl} />
                </div>
              </div>
            </div>
          ) : project.videoUrl ? (
            <video
              className="w-full h-full object-cover"
              src={project.videoUrl}
              controls
              autoPlay
            />
          ) : (
            <div className="w-full h-full relative">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* 30% Content Section */}
        <div className="w-full md:w-[30%] h-full bg-white dark:bg-gray-800 overflow-y-auto custom-scrollbar">
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {project.title}
            </h2>

            <div className="flex items-center gap-3 mb-6 text-sm text-gray-500 dark:text-gray-400">
              <span>{new Date(project.publishedAt).getFullYear()}</span>
              {project.views && (
                <>
                  <span>•</span>
                  <span>{project.views.toLocaleString()} views</span>
                </>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                {project.description}
              </p>

              {project.challenge && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">The Challenge</h3>
                  <p className="text-gray-600 dark:text-gray-400">{project.challenge}</p>
                </div>
              )}

              {project.solution && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">The Solution</h3>
                  <p className="text-gray-600 dark:text-gray-400">{project.solution}</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors mb-3"
                >
                  View Live Project
                </a>
              )}
              {(project.source === 'manual' || project.hasDetailedCaseStudy) && (
                <Link
                  href={`/portfolio/${project.id}`}
                  onClick={onClose}
                  className="w-full block text-center px-6 py-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg font-medium transition-colors"
                >
                  Read Full Case Study
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;
