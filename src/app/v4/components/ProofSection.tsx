'use client';

import React from 'react';
import { Quote, Star, CheckCircle } from 'lucide-react';

export default function ProofSection() {
  const testimonials = [
    {
      client: 'Winning Worship Way',
      role: 'Media & Ministry Lead',
      quote:
        'John took our raw live recordings and structured them into high-retention cinematic videos. The visual quality and sound design instantly elevated our digital reach.',
      highlight: 'Highest viewer retention upload of the year',
      tag: 'Cinematic Video Production',
    },
    {
      client: 'Monjola Aminu',
      role: 'Brand Strategist & Creator',
      quote:
        'Finding someone who genuinely understands visual aesthetics and modern software tools is extremely rare. J StaR delivered crisp execution without endless back-and-forth.',
      highlight: 'On-time delivery & pristine assets',
      tag: 'Brand Film & Identity',
    },
    {
      client: "Sharon's Chronicles",
      role: 'Content Creator',
      quote:
        'Every cut, color grade, and sound cue felt intentional. The storytelling kept viewers glued from the first five seconds to the end screen.',
      highlight: 'Consistent high-engagement pacing',
      tag: 'Post-Production & Editing',
    },
  ];

  return (
    <section className="py-24 px-6 sm:px-8 border-t border-[#AFC2D5]/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619]">
            // 05 Client Proof
          </span>
          <span className="h-[1px] w-12 bg-[#B5E619]/40" />
        </div>

        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#FBFFFE]">
              Commissioned for vision. <br />
              <span className="text-[#AFC2D5]">Measured on execution.</span>
            </h2>
          </div>
          <p className="text-sm text-[#AFC2D5] max-w-md">
            Direct feedback from creators, brands, and organizations who trust us to engineer their stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#001514] border border-[#AFC2D5]/15 hover:border-[#8E592F]/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Quote Icon & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#8E592F]/20 text-[#B5E619] flex items-center justify-center">
                    <Quote className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#AFC2D5]/60 bg-[#AFC2D5]/5 px-2.5 py-1 rounded-full border border-[#AFC2D5]/10">
                    {item.tag}
                  </span>
                </div>

                {/* Quote Body */}
                <p className="text-sm text-[#AFC2D5] leading-relaxed mb-6 italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Client Info & Metric */}
              <div className="pt-6 border-t border-[#AFC2D5]/10">
                <div className="text-sm font-bold text-[#FBFFFE]">{item.client}</div>
                <div className="text-xs text-[#AFC2D5]/70 font-mono mb-2">{item.role}</div>
                <div className="flex items-center gap-1.5 text-xs text-[#B5E619] font-medium font-mono">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
