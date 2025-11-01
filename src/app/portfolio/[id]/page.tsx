import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, ExternalLinkIcon } from '../../../components/icons/static-icons';
import { manualProjects } from '../../../content/portfolio';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(id: string) {
  // First check manual projects
  const manualProject = manualProjects.find(p => p.id === id);
  if (manualProject) {
    return manualProject;
  }

  // If not found in manual projects, try to fetch from YouTube API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/portfolio/youtube-playlist`, {
      next: { revalidate: 3600 }
    });

    if (response.ok) {
      const data = await response.json();
      const youtubeProject = data.projects?.find((p: any) => p.id === id);
      if (youtubeProject) {
        return youtubeProject;
      }
    }
  } catch (error) {
    console.error('Error fetching YouTube project:', error);
  }

  return null;
}

export default async function PortfolioCaseStudyPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Portfolio
            </Link>
            <div className="flex items-center space-x-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
                  View Live
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag: string, index: number) => {
              const colors = [
                'bg-primary/20 text-primary dark:text-accent',
                'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
                'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              ];
              return (
                <span
                  key={tag}
                  className={`px-3 py-1 text-sm font-medium rounded-full ${colors[index % colors.length]}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {project.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {project.description}
          </p>

          {/* Project Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Category: {project.category}</span>
            <span>Source: {project.source}</span>
            {project.views && <span>{project.views.toLocaleString()} views</span>}
            {project.duration && <span>Duration: {project.duration}</span>}
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="mb-12">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Case Study Content (for manual projects or YouTube videos with detailed case studies) */}
        {(project.source === 'manual' || project.hasDetailedCaseStudy) && (
          <div className="space-y-16">
            {/* Challenge Section */}
            {project.challenge && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Challenge</h2>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              </section>
            )}

            {/* Solution Section */}
            {project.solution && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Solution</h2>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </section>
            )}

            {/* Results Section */}
            {project.results && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Results</h2>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {project.results}
                  </p>
                </div>
              </section>
            )}

            {/* Project Credits */}
            {project.credits && project.credits.length > 0 && (
              <section>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Project Credits</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.credits.map((credit: any, index: number) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {credit.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {credit.role}
                      </p>
                      <div className="flex space-x-3">
                        {credit.linkedin && (
                          <a
                            href={credit.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          >
                            LinkedIn
                          </a>
                        )}
                        {credit.website && (
                          <a
                            href={credit.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* For YouTube videos, show additional info */}
        {project.source === 'youtube' && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About This Video
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {project.views && (
                <div>
                  <div className="text-3xl font-bold text-primary dark:text-accent mb-2">
                    {project.views.toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Views</div>
                </div>
              )}
              {project.duration && (
                <div>
                  <div className="text-3xl font-bold text-primary dark:text-accent mb-2">
                    {project.duration}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Duration</div>
                </div>
              )}
              <div>
                <div className="text-3xl font-bold text-primary dark:text-accent mb-2">
                  YouTube
                </div>
                <div className="text-gray-600 dark:text-gray-400">Platform</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
