'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Music, Zap, Award, RefreshCw } from 'lucide-react';

interface PolymathSectionProps {
  playFeedback?: () => void;
}

export function PolymathSection({ playFeedback }: PolymathSectionProps) {
  const [cubeRotation, setCubeRotation] = useState({ x: -20, y: 35 });
  const [isRotating, setIsRotating] = useState(true);
  const [activeTab, setActiveTab] = useState<'mindset' | 'speedcubing' | 'music' | 'engineering'>('mindset');

  // Interactive 3D Rubik's cube rotation tick
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setCubeRotation((prev) => ({
        x: prev.x + 0.3,
        y: prev.y + 0.5,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, [isRotating]);

  const handleCubeClick = () => {
    if (playFeedback) playFeedback();
    setCubeRotation((prev) => ({
      x: prev.x + Math.floor(Math.random() * 90),
      y: prev.y + Math.floor(Math.random() * 90),
    }));
  };

  const polymathPillars = [
    {
      id: 'mindset',
      title: 'The Polymath Mindset',
      role: 'Creative Technologist',
      icon: <Compass className="w-5 h-5 text-[#B5E619]" />,
      quote: "I like building things that shouldn't logically belong together.",
      desc: "Specialization creates silos. By mastering visual cinema, software engineering, complex spatial algorithms, and acoustic theory simultaneously, I see non-obvious connections that pure specialists overlook.",
      accent: '#B5E619',
    },
    {
      id: 'speedcubing',
      title: 'Algorithmic Speedcubing',
      role: 'National Champion',
      icon: <Zap className="w-5 h-5 text-[#8E592F]" />,
      quote: "Sub-10 second spatial pattern recognition & state-space traversal.",
      desc: "Competitive speedcubing teaches you how to memorize hundreds of algorithmic permutations, execute state transitions under high adrenaline, and solve complex multi-dimensional problems with zero hesitation.",
      accent: '#8E592F',
    },
    {
      id: 'music',
      title: 'Acoustic Architecture',
      role: 'ABRSM Grade 5 Alto Saxophone',
      icon: <Music className="w-5 h-5 text-[#AFC2D5]" />,
      quote: "Rhythm, cadence, frequency dynamics, and emotional resonance.",
      desc: "Musical training directly dictates how I edit video and structure user experiences. Every film cut, UI motion curve, and sound effect is tuned to harmonic timing rather than arbitrary animations.",
      accent: '#AFC2D5',
    },
    {
      id: 'engineering',
      title: 'System Engineering',
      role: 'Full-Stack & AI Builder',
      icon: <Award className="w-5 h-5 text-[#FBFFFE]" />,
      quote: "Deep systems architecture meets pixel-perfect interaction.",
      desc: "Writing clean TypeScript, building custom GLSL shaders, integrating vector databases, and orchestrating distributed microservices without losing sight of human delight.",
      accent: '#FBFFFE',
    },
  ];

  return (
    <section id="polymath" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-[#AFC2D5]/15 bg-[#001514]/80">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B5E619] font-bold flex items-center gap-2">
              <span className="w-4 h-px bg-[#B5E619]" />
              03 / WHO IS BEHIND J STAR
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FBFFFE] uppercase tracking-tight">
              The Polymath Advantage.
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <p className="text-xl sm:text-2xl text-[#FBFFFE] font-medium leading-relaxed">
              &quot;I&apos;m John Oluleke-Oke. Filmmaker, software engineer, national speedcubing champion, and saxophonist.&quot;
            </p>
            <p className="text-sm sm:text-base text-[#AFC2D5] leading-relaxed max-w-3xl">
              Most agencies hide behind anonymous departments. At J StaR, you get direct access to a multidisciplinary mind capable of visualizing an entire film campaign in the morning, and writing the production code for its interactive web application by the afternoon.
            </p>
          </div>
        </div>

        {/* Interactive 3D Rubik's Cube & Discipline Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Interactive 3D Rubik's Cube Widget */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full p-8 rounded-3xl bg-[#001514] border border-[#AFC2D5]/20 backdrop-blur-2xl shadow-2xl relative flex flex-col items-center justify-center min-h-[380px] overflow-hidden group">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B5E619] animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#AFC2D5]">
                  INTERACTIVE SPEEDCUBE ENGINE
                </span>
              </div>

              {/* 3D CSS Rubik's Cube Container */}
              <div 
                className="my-10 cursor-pointer select-none transition-transform duration-100 ease-linear"
                style={{
                  perspective: '1000px',
                }}
                onClick={handleCubeClick}
                onMouseEnter={() => setIsRotating(false)}
                onMouseLeave={() => setIsRotating(true)}
              >
                <div 
                  className="relative w-36 h-36"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`,
                    transition: isRotating ? 'none' : 'transform 0.5s ease-out',
                  }}
                >
                  {/* Front Face (Chartreuse) */}
                  <div 
                    className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-[#001514] border border-[#AFC2D5]/30 rounded-lg shadow-lg"
                    style={{ transform: 'translateZ(72px)' }}
                  >
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-[#B5E619] rounded-sm opacity-90 shadow-inner" />
                    ))}
                  </div>

                  {/* Back Face (Toffee Brown) */}
                  <div 
                    className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-[#001514] border border-[#AFC2D5]/30 rounded-lg shadow-lg"
                    style={{ transform: 'rotateY(180deg) translateZ(72px)' }}
                  >
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-[#8E592F] rounded-sm opacity-90 shadow-inner" />
                    ))}
                  </div>

                  {/* Right Face (Powder Blue) */}
                  <div 
                    className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-[#001514] border border-[#AFC2D5]/30 rounded-lg shadow-lg"
                    style={{ transform: 'rotateY(90deg) translateZ(72px)' }}
                  >
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-[#AFC2D5] rounded-sm opacity-90 shadow-inner" />
                    ))}
                  </div>

                  {/* Left Face (White / Ice) */}
                  <div 
                    className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-[#001514] border border-[#AFC2D5]/30 rounded-lg shadow-lg"
                    style={{ transform: 'rotateY(-90deg) translateZ(72px)' }}
                  >
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-[#FBFFFE] rounded-sm opacity-90 shadow-inner" />
                    ))}
                  </div>

                  {/* Top Face (Chartreuse / Slate Accent) */}
                  <div 
                    className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-[#001514] border border-[#AFC2D5]/30 rounded-lg shadow-lg"
                    style={{ transform: 'rotateX(90deg) translateZ(72px)' }}
                  >
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-[#B5E619]/70 rounded-sm opacity-90 shadow-inner" />
                    ))}
                  </div>

                  {/* Bottom Face (Ink Black Base) */}
                  <div 
                    className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1 bg-[#001514] border border-[#AFC2D5]/30 rounded-lg shadow-lg"
                    style={{ transform: 'rotateX(-90deg) translateZ(72px)' }}
                  >
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-[#001514] border border-[#AFC2D5]/20 rounded-sm opacity-90" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center justify-between pt-4 border-t border-[#AFC2D5]/15">
                <span className="text-[11px] font-mono text-[#AFC2D5]">
                  Hover to pause · Click to scramble
                </span>
                <button
                  onClick={handleCubeClick}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#B5E619] hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Cycle Algorithm</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Polymath Matrix Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {polymathPillars.map((pillar) => {
              const isActive = activeTab === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => {
                    if (playFeedback) playFeedback();
                    setActiveTab(pillar.id as any);
                  }}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                    isActive
                      ? 'bg-[#001514] border-[#B5E619] shadow-[0_0_20px_rgba(181,230,25,0.2)]'
                      : 'bg-[#001514]/70 border-[#AFC2D5]/20 hover:border-[#AFC2D5]/40 hover:bg-[#001514]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#001514] border border-[#AFC2D5]/20 flex items-center justify-center">
                      {pillar.icon}
                    </div>
                    <span 
                      className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${pillar.accent}20`,
                        color: pillar.accent 
                      }}
                    >
                      {pillar.role}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#FBFFFE] mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-mono text-[#B5E619] mb-2 italic">
                    &ldquo;{pillar.quote}&rdquo;
                  </p>
                  <p className="text-xs text-[#AFC2D5]/90 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
