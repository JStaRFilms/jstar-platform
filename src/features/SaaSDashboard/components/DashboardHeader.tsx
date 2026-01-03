'use client';

import { Plus, Search, Filter } from 'lucide-react';
import { User } from '@prisma/client';

interface DashboardHeaderProps {
    user?: Partial<User> | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.name?.split(' ')[0] || 'Creator'}</span>
                </h1>
                <p className="mt-2 text-zinc-400">
                    Manage your creative projects and track your progress.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="h-10 w-64 rounded-xl border border-white/10 bg-zinc-900/50 pl-9 pr-4 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                </div>

                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
                    <Filter size={18} />
                </button>

                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95">
                    <Plus size={18} />
                    <span className="hidden sm:inline">New Project</span>
                </button>
            </div>
        </div>
    );
}
