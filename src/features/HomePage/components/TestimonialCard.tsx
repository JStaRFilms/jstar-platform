'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '../../../content/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-card border border-powder-blue/15 hover:border-chartreuse/50 rounded-3xl p-8 h-full flex flex-col justify-between transition-all duration-300 relative group shadow-lg">
      <Quote className="absolute top-6 right-6 w-8 h-8 text-powder-blue/10 group-hover:text-chartreuse/20 transition-colors pointer-events-none" />

      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-chartreuse/40 flex-shrink-0 relative">
            <Image
              src={testimonial.authorImage}
              alt={testimonial.authorName}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-bold text-ghost-white truncate">
              {testimonial.authorName}
            </h4>
            <p className="text-xs text-powder-blue/80 truncate">
              {testimonial.authorRole}
            </p>
            <div className="flex items-center gap-1 text-chartreuse mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-powder-blue/90 leading-relaxed italic">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-powder-blue/10 flex flex-wrap gap-1.5">
        {testimonial.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 rounded-full bg-ink-black border border-powder-blue/10 text-powder-blue font-mono text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;
