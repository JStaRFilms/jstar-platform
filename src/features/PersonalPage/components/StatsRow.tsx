'use client';

import { usePersonaData } from '../hooks/usePersonaData';
import {
  Ship, Layers, GraduationCap,
  Eye, Video, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Ship, Layers, GraduationCap,
  Eye, Video, Clock
};

export default function StatsRow() {
  const { stats, mode } = usePersonaData();

  return (
    <section className="py-12 border-y border-white/5 bg-neutral-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon] || Layers;

            return (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className={cn(
                  "p-3 rounded-full mb-4 bg-opacity-20",
                  mode === 'ENGINEER' ? "bg-blue-500 text-blue-400" : "bg-amber-500 text-amber-400"
                )}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-widest text-neutral-500 font-semibold">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
