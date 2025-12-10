'use client';

import { usePersonaData } from '../hooks/usePersonaData';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

export default function TestimonialsCarousel() {
  const { testimonials, mode } = usePersonaData();

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-neutral-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">
          What People <span className={cn(
            mode === 'ENGINEER' ? "text-blue-500" : "text-amber-500"
          )}>Say</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative p-8 rounded-2xl bg-white/5 border border-white/5"
            >
              <Quote className={cn(
                "absolute top-8 left-8 w-8 h-8 opacity-20",
                mode === 'ENGINEER' ? "text-blue-500" : "text-amber-500"
              )} />

              <div className="relative z-10 pt-6">
                <p className="text-lg text-neutral-300 mb-8 leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                    mode === 'ENGINEER' ? "bg-blue-900 text-blue-200" : "bg-amber-900 text-amber-200"
                  )}>
                    {testimonial.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {testimonial.clientName}
                    </div>
                    {testimonial.role && (
                      <div className="text-sm text-neutral-500">
                        {testimonial.role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
