'use client';

import { usePersonaData } from '../hooks/usePersonaData';
import { cn } from '@/lib/utils';

export default function SkillsMatrix() {
  const { skills, mode } = usePersonaData();

  return (
    <section className="py-24 px-4 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">
          Technical <span className={cn(
            mode === 'ENGINEER' ? "text-blue-500" : "text-amber-500"
          )}>Arsenal</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((category) => (
            <div
              key={category.category}
              className="bg-neutral-900/50 rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors"
            >
              <h3 className={cn(
                "text-xl font-bold mb-6",
                mode === 'ENGINEER' ? "text-blue-400" : "text-amber-400"
              )}>
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-white/5 rounded-md text-sm text-neutral-300 border border-white/5 hover:bg-white/10 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
