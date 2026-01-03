'use client';

import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Edit, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Project, Chapter, ProjectStatus } from '@prisma/client';

interface ProjectCardProps {
    project: Project & {
        chapters: Chapter[];
    };
}

const statusColors = {
    [ProjectStatus.IDEA]: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    [ProjectStatus.DRAFTING]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    [ProjectStatus.POLISHING]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    [ProjectStatus.PUBLISHED]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    [ProjectStatus.ARCHIVED]: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function ProjectCard({ project }: ProjectCardProps) {
    const completedChapters = project.chapters.filter((c) => c.isCompleted).length;
    const totalChapters = project.chapters.length;
    const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-blue-500/5">
            {/* Absolute Gradient Glow on Hover */}
            <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
            </div>

            <div className="relative z-10">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${statusColors[project.status]}`}>
                            {project.status.toLowerCase()}
                        </span>
                        <h3 className="line-clamp-1 mt-2 text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {project.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-zinc-400">
                            {project.description || 'No description provided.'}
                        </p>
                    </div>

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="mt-1 text-xs text-zinc-600">
                    {completedChapters} of {totalChapters} chapters completed
                </div>
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="text-xs text-zinc-500">
                    Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </div>
                <Link
                    href={`/project/${project.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-white/10 active:scale-95"
                >
                    <Edit size={14} />
                    Open Studio
                </Link>
            </div>
        </div>
    );
}
