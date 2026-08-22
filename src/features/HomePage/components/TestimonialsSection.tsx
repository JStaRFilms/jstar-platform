'use client';

import React from 'react';
import { testimonials } from '../../../content/testimonials';
import TestimonialCard from './TestimonialCard';
import { Sparkles, Users, Globe } from 'lucide-react';
import { PROFILE_DATA } from '@/features/AboutPage/data/portfolio';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="proof" className="py-24 bg-ink-black relative border-t border-powder-blue/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-powder-blue/20 text-powder-blue font-mono text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-chartreuse" />
              05 // Verified Proof & Results
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
              Trusted by creators, <br />
              <span className="text-chartreuse">organizations & brands.</span>
            </h2>
          </div>
          <p className="text-powder-blue/80 max-w-md text-base leading-relaxed">
            Real feedback from long-term collaborators, church media ministries, and content creators whose channels and workflows we've helped elevate.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {testimonials.map((t, idx) => (
            <div key={idx} className="h-full">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>

        {/* Client Channel Banner */}
        <div className="p-8 rounded-3xl bg-card border border-powder-blue/15">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-powder-blue/60">
              Creator Channels & Partner Communities We've Shaped
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {PROFILE_DATA.clients.map((client, idx) => {
              const Icon = client.logo;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-ink-black border border-powder-blue/10"
                >
                  <Icon className="w-4 h-4 text-chartreuse" />
                  <span className="text-xs font-bold text-ghost-white">{client.name}</span>
                  <span className="text-[10px] font-mono text-powder-blue/70">
                    ({client.subscribers} subs)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
