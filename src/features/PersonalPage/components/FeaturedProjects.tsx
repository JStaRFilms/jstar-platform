'use client';

import { usePersonaData } from '../hooks/usePersonaData';
import { cn } from '@/lib/utils';
import { ExternalLink, Github, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedProjects() {
  const { projects, mode } = usePersonaData();

  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16 text-white">
          Selected <span className={cn(
            mode === 'ENGINEER' ? "text-blue-500" : "text-amber-500"
          )}>Works</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Top Bar Decoration */}
              <div className={cn(
                "h-1 w-full",
                mode === 'ENGINEER' ? "bg-blue-600" : "bg-amber-600"
              )} />

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      className="text-neutral-500 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  )}
                </div>

                <p className="text-neutral-400 mb-6 flex-1">
                  {project.description}
                </p>

                {/* Tech/Tools Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-neutral-300 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer Stats/Link */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  {project.stats ? (
                    <div className="flex gap-4">
                      {project.stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col">
                          <span className="text-xs text-neutral-500 uppercase">{stat.label}</span>
                          <span className="font-bold text-white">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-neutral-500">View Details</span>
                  )}

                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      className={cn(
                        "p-2 rounded-full hover:bg-white/10 transition-colors",
                        mode === 'ENGINEER' ? "text-blue-500" : "text-amber-500"
                      )}
                    >
                      {mode === 'ENGINEER' ? <Github className="w-5 h-5" /> : <Youtube className="w-5 h-5" />}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
