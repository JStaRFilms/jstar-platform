'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Mic, Music, Video, Code, ArrowUpRight, Sparkles, Box } from 'lucide-react';
import { PROFILE_DATA } from '@/features/AboutPage/data/portfolio';

export const FounderStorySection: React.FC = () => {
  return (
    <section id="founder" className="py-24 bg-ink-black relative border-t border-powder-blue/10 overflow-hidden">
      {/* Background Lighting Glows */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-toffee-brown/15 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-chartreuse/10 rounded-full filter blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-powder-blue/20 text-powder-blue font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-chartreuse" />
            04 // The Founder & Polymath
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight">
            I like building things that shouldn't <br />
            <span className="text-chartreuse">logically belong together.</span>
          </h2>
          <p className="mt-4 text-lg text-powder-blue/80 leading-relaxed">
            I'm John — a filmmaker and product software engineer operating where cinematic storytelling, algorithmic problem-solving, and creative technology meet.
          </p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Main Portrait & Core Narrative (Large 7 Cols) */}
          <div className="md:col-span-7 rounded-3xl bg-card border border-powder-blue/15 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-chartreuse/40 flex-shrink-0">
                  <Image
                    src="/me/me2.jpg"
                    alt="John Oluleke-Oke"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ghost-white">John Oluleke-Oke</h3>
                  <p className="text-xs font-mono text-chartreuse">Creative Technologist · Filmmaker · Polymath</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-powder-blue/90 leading-relaxed">
                "Whether it's the rhythm of jazz on an alto sax, sub-12 second Rubik's cube algorithms, or building system-wide AI desktop utilities in Python, I believe real creative breakthroughs occur when diverse disciplines cross-pollinate."
              </p>

              {/* Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-ink-black border border-powder-blue/10 flex items-center gap-2.5">
                  <Trophy className="w-4 h-4 text-chartreuse flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] font-mono font-bold text-ghost-white">National Gold</span>
                    <span className="text-[10px] text-powder-blue/60">Speedcubing</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ink-black border border-powder-blue/10 flex items-center gap-2.5">
                  <Mic className="w-4 h-4 text-toffee-brown flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] font-mono font-bold text-ghost-white">TEDx Speaker</span>
                    <span className="text-[10px] text-powder-blue/60">Elizade Univ</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-ink-black border border-powder-blue/10 flex items-center gap-2.5">
                  <Music className="w-4 h-4 text-powder-blue flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] font-mono font-bold text-ghost-white">ABRSM Sax</span>
                    <span className="text-[10px] text-powder-blue/60">Alto Grade 5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-powder-blue/10 flex items-center justify-between relative z-10">
              <span className="text-xs font-mono text-powder-blue/60">Lagos, Nigeria · Global Remote</span>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-chartreuse hover:underline"
              >
                Read Full Bio & Timeline
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Filming Visual Stills (5 Cols) */}
          <div className="md:col-span-5 rounded-3xl bg-card border border-powder-blue/15 overflow-hidden relative min-h-[300px] flex flex-col justify-end p-8 group">
            <Image
              src="/me/cam.jpg"
              alt="Behind the Camera"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/50 to-transparent" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink-black/80 border border-toffee-brown/40 text-toffee-brown font-mono text-[10px] uppercase font-bold mb-2">
                <Video className="w-3 h-3" />
                Behind the Lens
              </span>
              <h4 className="text-xl font-bold text-ghost-white mb-1">
                280+ Films & Video Masters
              </h4>
              <p className="text-xs text-powder-blue/80">
                Directing camera setups, lighting, DaVinci Resolve color science, and storytelling across YouTube & enterprise clients.
              </p>
            </div>
          </div>

          {/* Card 3: Speedcubing Problem-Solving DNA (4 Cols) */}
          <div className="md:col-span-4 rounded-3xl bg-card border border-powder-blue/15 p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-chartreuse/10 flex items-center justify-center text-chartreuse mb-4">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-ghost-white mb-2">
                Problem Solving at Speed
              </h4>
              <p className="text-xs text-powder-blue/80 leading-relaxed mb-4">
                National Speedcubing Champion (WCA ID: 2022JOHN41) with 3.53s 2x2 single and 11.73s 3x3 single. High-speed pattern recognition directly informs my software architecture.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-ink-black border border-powder-blue/10 font-mono text-[11px] text-chartreuse">
              "Optimize for efficiency and elegance."
            </div>
          </div>

          {/* Card 4: Music & Soul (4 Cols) */}
          <div className="md:col-span-4 rounded-3xl bg-card border border-powder-blue/15 overflow-hidden relative p-8 flex flex-col justify-between min-h-[220px]">
            <Image
              src="/me/sax.jpg"
              alt="Saxophone Performance"
              fill
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-ink-black/60 to-transparent" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-toffee-brown/20 flex items-center justify-center text-toffee-brown mb-4">
                <Music className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-ghost-white mb-1">
                Acoustic Rhythm & Soul
              </h4>
              <p className="text-xs text-powder-blue/80">
                ABRSM Grade 5 Alto Saxophonist bringing musical timing, pacing, and harmonic intuition to video editing and pacing.
              </p>
            </div>
          </div>

          {/* Card 5: Engineering Stack (4 Cols) */}
          <div className="md:col-span-4 rounded-3xl bg-card border border-powder-blue/15 p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-powder-blue/10 flex items-center justify-center text-powder-blue mb-4">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-ghost-white mb-2">
                Creative Engineering Stack
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Next.js 15', 'TypeScript', 'Python', 'ONNX', 'Tailwind v4', 'DaVinci Resolve', 'Gemini API', 'PostgreSQL'].map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-ink-black border border-powder-blue/10 text-powder-blue">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 text-[11px] font-mono text-powder-blue/60">
              Local-first & Cloud Architectures
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStorySection;
