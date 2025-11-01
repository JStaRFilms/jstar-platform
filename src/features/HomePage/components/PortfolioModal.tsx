'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioProject } from '../../../content/portfolio';
import { ArrowRightIcon } from '../../../components/icons/static-icons';

interface PortfolioModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  isOpen: boolean;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ project, onClose, isOpen }) => {
  if (!isOpen || !project) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="modal-container relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Video Section (70% of modal height) */}
          <div className="video-section bg-black rounded-t-2xl overflow-hidden">
            <div className="aspect-ratio-container">
              {project.videoUrl && project.source === 'youtube' ? (
                <iframe
                  className="video-iframe"
                  src={`https://www.youtube.com/embed/${project.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : project.videoUrl ? (
                <video
                  className="video-iframe"
                  src={project.videoUrl}
                  controls
                  autoPlay
                  muted
                />
              ) : project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover rounded-t-2xl"
                  priority
                />
              ) : null}
            </div>
          </div>

          {/* Content Section (30% of modal height) */}
          <div className="content-section">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {project.title}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {project.source === 'manual' ? 'Case Study' : 'Video Project'} • {new Date(project.publishedAt).getFullYear()}
              </span>
              {project.source === 'manual' && (
                <>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">15 min read</span>
                </>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {project.description}
            </p>

            {/* Technology Tags */}
            <div className="tag-container">
              {project.tags.map((tag, index) => {
                const tagColors = [
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
                  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                ];
                return (
                  <span
                    key={tag}
                    className={`tech-tag ${tagColors[index % tagColors.length]}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>

            {/* Project Stats */}
            {project.source === 'youtube' && project.showViews !== false && (
              <div className="stats-container mt-6">
                {project.views && (
                  <div className="stats-badge flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {project.views.toLocaleString()} views
                  </div>
                )}
                {project.duration && (
                  <div className="stats-badge flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {project.duration}
                  </div>
                )}
                {project.views && (
                  <div className="stats-badge flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {Math.floor(project.views / 35).toLocaleString()} likes
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <span>View Live Project</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {(project.source === 'manual' || project.hasDetailedCaseStudy) && (
                <Link
                  href={`/portfolio/${project.id}`}
                  className="btn-outline py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  <span>View Full Case Study</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Modal container with proper sizing */
        .modal-container {
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Video section takes 70% of modal height */
        .video-section {
          flex: 0 0 auto;
          height: 70%;
          max-height: 600px;
          position: relative;
          overflow: hidden;
        }

        /* Aspect ratio container - maintains 16:9 */
        .aspect-ratio-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        /* Content section takes remaining space */
        .content-section {
          flex: 1 1 auto;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .content-section::-webkit-scrollbar {
          width: 8px;
        }

        .content-section::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .content-section::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .content-section::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* For mobile responsiveness */
        @media (max-width: 768px) {
          .modal-container {
            max-height: 95vh;
          }

          .video-section {
            height: 60%;
          }

          .content-section {
            height: 40%;
          }
        }

        .tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .tech-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .tech-tag:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%);
          background-size: 200% 200%;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
          background-position: right center;
        }

        .btn-outline {
          border: 2px solid #2563EB;
          color: #2563EB;
          transition: all 0.3s ease;
        }

        .btn-outline:hover {
          background: #2563EB;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
        }

        .stats-badge {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 0.3rem 0.75rem;
          font-size: 0.75rem;
          color: #4b5563;
        }

        .stats-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .focus-ring {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
        }
      `}</style>
    </>
  );
};

export default PortfolioModal;
