'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Code2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const ManifestoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'film' | 'code'>('both');

  return (
    <section id="manifesto" className="py-24 bg-ink-black relative overflow-hidden border-t border-powder-blue/10">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-toffee-brown/10 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-powder-blue/20 text-powder-blue font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-chartreuse" />
            01 // The Studio Manifesto
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight leading-tight">
            Most studios choose between <br />
            <span className="text-chartreuse">storytelling</span> and <span className="text-powder-blue">software</span>. <br />
            <span className="italic font-serif font-light text-toffee-brown">We build both.</span>
          </h2>
          <p className="mt-6 text-lg text-powder-blue/80 leading-relaxed">
            Most filmmakers don't write code. Most software engineers don't understand narrative tension. J StaR Studios was founded on the belief that the most memorable digital experiences happen when you refuse to separate the camera from the compiler.
          </p>
        </div>

        {/* Interactive Dual DNA Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Film Discipline Card */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 hover:border-toffee-brown/50 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-toffee-brown/15 rounded-full filter blur-[60px] group-hover:bg-toffee-brown/25 transition-all" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-toffee-brown/20 flex items-center justify-center text-toffee-brown mb-6">
                <Video className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-toffee-brown uppercase tracking-wider block mb-2">
                Discipline 01 // The Lens
              </span>
              <h3 className="text-2xl font-bold text-ghost-white mb-4">
                Filmmaking & Visual Direction
              </h3>
              <p className="text-powder-blue/80 leading-relaxed mb-6">
                Over 280+ videos produced across YouTube, commercial projects, and multi-camera broadcasts. Grounded in DaVinci Resolve color science, rhythm, and cinematography that moves real audiences.
              </p>

              <ul className="space-y-3 font-mono text-xs text-ghost-white/90">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-toffee-brown" />
                  DaVinci Resolve Node Tree Color Grading
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-toffee-brown" />
                  Commercial & Documentary Storyboarding
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-toffee-brown" />
                  High-Retention YouTube Editorial Strategy
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-powder-blue/10 flex items-center justify-between">
              <span className="text-xs text-powder-blue/60 font-mono">176K+ Global Impressions</span>
              <Link href="/portfolio" className="text-xs font-mono font-bold text-toffee-brown hover:text-ghost-white flex items-center gap-1">
                View Films <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Software & AI Discipline Card */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 hover:border-chartreuse/50 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-chartreuse/15 rounded-full filter blur-[60px] group-hover:bg-chartreuse/25 transition-all" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-chartreuse/20 flex items-center justify-center text-chartreuse mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-chartreuse uppercase tracking-wider block mb-2">
                Discipline 02 // The Logic
              </span>
              <h3 className="text-2xl font-bold text-ghost-white mb-4">
                Software Engineering & AI Systems
              </h3>
              <p className="text-powder-blue/80 leading-relaxed mb-6">
                Architecting local-first desktop utilities (Blink), multimodal AI learning platforms (Adaptive Study Game), and production Next.js platforms. Systems built for speed, privacy, and tangible utility.
              </p>

              <ul className="space-y-3 font-mono text-xs text-ghost-white/90">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-chartreuse" />
                  Local-First AI Desktop Architecture (Python / ONNX)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-chartreuse" />
                  Modern Full-Stack Applications (Next.js 15, TypeScript)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-chartreuse" />
                  Autonomous LLM Workflows & Prompt Engineering
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-powder-blue/10 flex items-center justify-between">
              <span className="text-xs text-powder-blue/60 font-mono">Open Source & Live Builds</span>
              <Link href="/portfolio" className="text-xs font-mono font-bold text-chartreuse hover:text-ghost-white flex items-center gap-1">
                View Software <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
