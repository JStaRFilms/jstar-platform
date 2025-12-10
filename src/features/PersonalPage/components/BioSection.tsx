'use client';

import { usePersonaData } from '../hooks/usePersonaData';
import { cn } from '@/lib/utils';

export default function BioSection() {
  const { bio, mode } = usePersonaData();

  return (
    <section className="py-24 px-4 bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          {/* Title Column */}
          <div className="space-y-4">
            <h2 className={cn(
              "text-3xl md:text-4xl font-bold leading-tight",
              mode === 'ENGINEER' ? "text-blue-400" : "text-amber-400"
            )}>
              {bio.title}
            </h2>
            <div className={cn(
              "h-1 w-20 rounded-full",
              mode === 'ENGINEER' ? "bg-blue-600" : "bg-amber-600"
            )} />
          </div>

          {/* Content Column */}
          <div className="space-y-6 text-lg text-neutral-300 leading-relaxed font-light">
            {bio.paragraphs.map((para, idx) => (
              <p key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
