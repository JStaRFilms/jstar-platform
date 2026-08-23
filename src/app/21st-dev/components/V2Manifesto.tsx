'use client';

import React from 'react';
import ScrambleText from './ScrambleText';
import KineticBorderCard from './KineticBorderCard';
import { Camera, Terminal, Cpu, Film, Flame } from 'lucide-react';

export const V2Manifesto: React.FC = () => {
  return (
    <section className="py-28 px-6 bg-ink-black relative border-b border-powder-blue/15">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono text-chartreuse uppercase tracking-widest block">
            <ScrambleText text="01 // THE DUAL-THREAT PHILOSOPHY" />
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-ghost-white tracking-tight leading-tight">
            Most studios choose between narrative and code. <br />
            <span className="text-chartreuse">We refuse that compromise.</span>
          </h2>
          <p className="text-base text-powder-blue/80 leading-relaxed font-light">
            When the filmmaker understands algorithmic optimization and the software engineer understands pacing and visual emotion, the work reaches a standard most agencies can't match.
          </p>
        </div>

        {/* The Two Disciplines Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Discipline 1: The Camera */}
          <div className="p-8 sm:p-10 rounded-3xl bg-card border border-powder-blue/15 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-toffee-brown/20 border border-toffee-brown/40 flex items-center justify-center text-toffee-brown">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-ghost-white mb-2">
                  The Cinematic Lens
                </h3>
                <p className="text-sm text-powder-blue/80 leading-relaxed font-light">
                  Story architecture, high-retention editing, DaVinci Resolve color science, and dynamic multi-camera broadcasting that holds audience attention.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-powder-blue/10 text-xs font-mono text-powder-blue/70">
                <div className="flex justify-between py-1 border-b border-powder-blue/5">
                  <span>Color Pipeline</span>
                  <span className="text-ghost-white font-bold">DaVinci ACES / Film Emulation</span>
                </div>
                <div className="flex justify-between py-1 border-b border-powder-blue/5">
                  <span>Production Archive</span>
                  <span className="text-ghost-white font-bold">280+ Directed Masters</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Focus Area</span>
                  <span className="text-ghost-white font-bold">Commercials, Docu & YouTube</span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-mono text-toffee-brown font-bold uppercase tracking-wider">
              [ DIRECTING & CINEMATOGRAPHY ]
            </span>
          </div>

          {/* Discipline 2: The Compiler (Kinetic Glow Border) */}
          <KineticBorderCard glowColor="#B5E619" className="h-full">
            <div className="h-full flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-chartreuse/20 border border-chartreuse/40 flex items-center justify-center text-chartreuse">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-ghost-white mb-2">
                    The Modern Compiler
                  </h3>
                  <p className="text-sm text-powder-blue/80 leading-relaxed font-light">
                    Full-stack TypeScript applications, local-first ONNX neural networks, and automated creator tooling engineered for performance and privacy.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-powder-blue/10 text-xs font-mono text-powder-blue/70">
                  <div className="flex justify-between py-1 border-b border-powder-blue/5">
                    <span>Engineering Core</span>
                    <span className="text-ghost-white font-bold">Next.js 15 · TypeScript · Python</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-powder-blue/5">
                    <span>AI Execution</span>
                    <span className="text-ghost-white font-bold">Offline Local ONNX / Gemini Pipelines</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Design System</span>
                    <span className="text-ghost-white font-bold">Strict 5-Color Official Palette</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono text-chartreuse font-bold uppercase tracking-wider">
                [ SOFTWARE & AI ARCHITECTURE ]
              </span>
            </div>
          </KineticBorderCard>
        </div>
      </div>
    </section>
  );
};

export default V2Manifesto;
