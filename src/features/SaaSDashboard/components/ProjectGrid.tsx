'use client';

import { Project, Chapter } from '@prisma/client';
import { ProjectCard } from './ProjectCard';
import { Plus } from 'lucide-react';

interface ProjectGridProps {
    projects: (Project & {
        chapters: Chapter[];
    })[];
    isLoading?: boolean;
}

export function ProjectGrid({ projects, isLoading }: ProjectGridProps) {
    if (isLoading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 animate-pulse rounded-2xl bg-zinc-900/50 border border-white/5" />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center backdrop-blur-sm">
                <div className="mb-4 rounded-full bg-zinc-800/50 p-4 ring-1 ring-white/10">
                    <Plus className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">No projects yet</h3>
                <p className="mb-6 max-w-sm text-zinc-400">
                    Get started by creating your first creative project. Use our AI tools to brainstorm, draft, and polish.
                </p>
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95">
                    <Plus size={18} />
                    Create New Project
                </button>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
