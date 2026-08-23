'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronsLeftRight,
  ChevronDown,
  Clapperboard,
  Code,
  Cpu,
  Film,
  Play,
  Send,
  Sliders,
  Terminal,
  X,
} from 'lucide-react';

// --- DATA STRUCTURES ---

interface DeepDiveContent {
  tag: string;
  title: string;
  badgeColor: string;
  quote: string;
  desc: string;
  capabilities: string[];
  metrics: string;
}

const DEEP_DIVE_DATA: Record<string, DeepDiveContent> = {
  films: {
    tag: '01 // CINEMATIC PRODUCTION',
    title: 'J StaR Films',
    badgeColor: 'text-[#8E592F] bg-[#8E592F]/20 border-[#8E592F]/40',
    quote: "We don't shoot content. We engineer cinematic frames that linger in memory.",
    desc: 'J StaR Films is a boutique cinematic production unit specializing in commercial advertising, high-retention brand documentaries, mobile cinema, and bespoke visual color science. Every cut is timed to narrative cadence, emotional peaks, and psychological retention.',
    capabilities: [
      'Commercial & Brand Documentaries',
      '4K Anamorphic Mobile Cinematography',
      'High-Retention YouTube Narrative Direction',
      'Custom 3D LUT Color Science & Grading',
      'Cinematic Sound Design & Acoustic Scoring',
    ],
    metrics: '280+ Films Produced · 176K+ Organic Reach',
  },
  labs: {
    tag: '02 // SOFTWARE ARCHITECTURE',
    title: 'J StaR Labs',
    badgeColor: 'text-[#AFC2D5] bg-[#AFC2D5]/20 border-[#AFC2D5]/40',
    quote: 'Sub-second responsiveness meets art-directed visual precision.',
    desc: 'J StaR Labs builds bespoke web applications, interactive WebGL 3D experiences, and digital products engineered for high performance. We believe interfaces should feel as fluid and intentional as high-end industrial design.',
    capabilities: [
      'Full-Stack Next.js & TypeScript Architectures',
      'WebGL & Custom GLSL Shader Engineering',
      'Design Systems & Component Token Infrastructures',
      'Real-Time Collaborative Web Platforms',
      'Sub-10ms Global API Response Benchmarks',
    ],
    metrics: '60 FPS WebGL · Modern Reactive Stack',
  },
  intelligence: {
    tag: '03 // AI CREATOR ENGINES',
    title: 'J StaR Intelligence',
    badgeColor: 'text-[#B5E619] bg-[#B5E619]/20 border-[#B5E619]/40',
    quote: 'AI that amplifies creative velocity by 10x without sacrificing artistic conviction.',
    desc: 'J StaR Intelligence constructs autonomous agent pipelines, local desktop workflow utilities (Blink Engine), and multimodal generative systems that automate tedious human production steps and supercharge creative output.',
    capabilities: [
      'Autonomous Agent Tool Loops & Orchestration',
      'Local Offline AI Utilities (Blink Desktop Suite)',
      'Multimodal Video & Audio Transcript Synthesis',
      'Custom RAG & Semantic Vector Knowledge Graphs',
      'Automated Content Taxonomy & Tagging Systems',
    ],
    metrics: '10x Production Acceleration · Zero-Latency Local LLMs',
  },
};

const SCRAMBLE_PHRASES = [
  'Got something weird or ambitious in mind?',
  'Have a cinematic vision that requires code?',
  'Ready to engineer something extraordinary?',
  'Building at the edge of art and intelligence?',
];

export default function V5LandingPage() {
  // Modal State
  const [activeDeepDive, setActiveDeepDive] = useState<string | null>(null);

  // Comparator State
  const [comparatorMode, setComparatorMode] = useState<'color' | 'code' | 'ai'>('color');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const comparatorRef = useRef<HTMLDivElement>(null);

  // CTA Scramble State
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState<number>(0);
  const [scrambledText, setScrambledText] = useState<string>(SCRAMBLE_PHRASES[0]);
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Form State
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [projectType, setProjectType] = useState<string>('film');

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- WEBGL BACKGROUND CANVAS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    let animFrame: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const vs = `
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    const fs = `
      precision mediump float;
      varying vec2 uv;
      uniform float time;
      uniform vec2 mouse;
      void main() {
        vec2 p = uv * 2.0 - 1.0;
        p.x *= 1.5;
        float d = length(p - (mouse * 2.0 - 1.0));
        float c = sin(p.x * 2.5 + time * 0.4) * cos(p.y * 2.5 + time * 0.4);
        c += sin(d * 5.0 - time * 0.8);
        vec3 col = mix(vec3(0.0, 0.08, 0.08), vec3(0.71, 0.90, 0.10), c * 0.12);
        gl_FragColor = vec4(col, 0.22);
      }
    `;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'time');
    const uMouse = gl.getUniformLocation(prog, 'mouse');

    let mouseX = 0.5,
      mouseY = 0.5;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = (now: number) => {
      gl.uniform1f(uTime, now * 0.001);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrame = requestAnimationFrame(render);
    };
    animFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // --- CTA TEXT SCRAMBLER EFFECT ---
  const triggerScramble = (targetText: string) => {
    const chars = 'ABCDEF012345!@#$%^&*<>[]{}';
    let iteration = 0;
    if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);

    scrambleIntervalRef.current = setInterval(() => {
      setScrambledText(
        targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
      }
      iteration += 1.5;
    }, 30);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhraseIdx((prev) => {
        const next = (prev + 1) % SCRAMBLE_PHRASES.length;
        triggerScramble(SCRAMBLE_PHRASES[next]);
        return next;
      });
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // --- COMPARATOR SLIDER DRAGGING ---
  const handleComparatorMove = (clientX: number) => {
    if (!comparatorRef.current) return;
    const rect = comparatorRef.current.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    pos = Math.max(0.05, Math.min(0.95, pos));
    setSliderPos(pos * 100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleComparatorMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleComparatorMove(e.clientX);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging]);

  return (
    <div className="relative min-h-screen bg-[#001514] text-[#FBFFFE] selection:bg-[#B5E619] selection:text-[#001514] font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      
      {/* Dynamic Font Stylesheet Loading */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@500;700;800;900&display=swap');

        .font-display {
          font-family: 'Syne', sans-serif;
        }
        .font-serif-italic {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
        }
        .font-mono-tech {
          font-family: 'Space Mono', monospace;
        }

        .glass-hud {
          background: rgba(0, 21, 20, 0.78);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(175, 194, 213, 0.15);
        }

        .glass-hud-lime {
          background: rgba(0, 21, 20, 0.92);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(181, 230, 25, 0.4);
        }

        .glow-lime {
          box-shadow: 0 0 35px -5px rgba(181, 230, 25, 0.35);
        }
        .text-glow-lime {
          text-shadow: 0 0 20px rgba(181, 230, 25, 0.5);
        }

        .portal-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .portal-mask {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(181, 230, 25, 0.12) 0%, rgba(142, 89, 47, 0.15) 100%);
          clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
          transition: clip-path 0.5s cubic-bezier(0.65, 0, 0.35, 1);
          pointer-events: none;
        }
        .portal-card:hover .portal-mask {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
        .portal-card:hover {
          transform: translateY(-4px);
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        .bg-dot-grid {
          background-image: radial-gradient(rgba(175, 194, 213, 0.1) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>

      {/* WebGL Ambient Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-25" />

      {/* FLOATING PILL HEADER */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl px-6 py-3.5 rounded-full glass-hud border border-[#AFC2D5]/20 flex items-center justify-between shadow-2xl">
        <a href="#hero" className="flex items-center space-x-2 font-mono-tech font-bold text-sm tracking-tight text-[#FBFFFE] group">
          <span className="w-3 h-3 rounded-full bg-[#B5E619] group-hover:scale-125 transition-transform" />
          <span>J StaR</span>
          <span className="text-[#AFC2D5]/50 text-xs hidden sm:inline">// STUDIO</span>
        </a>

        <nav className="hidden md:flex items-center space-x-6 font-mono-tech text-xs text-[#AFC2D5]/70">
          <a href="#manifesto" className="hover:text-[#B5E619] transition-colors">THESIS</a>
          <a href="#disciplines" className="hover:text-[#B5E619] transition-colors">DIVISIONS</a>
          <a href="#craft" className="hover:text-[#B5E619] transition-colors">LUT LAB</a>
          <a href="#work" className="hover:text-[#B5E619] transition-colors">PROJECTS</a>
          <a href="#founder" className="hover:text-[#B5E619] transition-colors">ARCHITECT</a>
          <a href="#metrics" className="hover:text-[#B5E619] transition-colors">VERIFICATION</a>
        </nav>

        <a
          href="#contact"
          className="px-4 py-2 rounded-full bg-[#B5E619] text-[#001514] font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-[#FBFFFE] transition-all shadow-[0_0_20px_rgba(181,230,25,0.4)]"
        >
          Start A Project
        </a>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="relative z-10 min-h-screen flex flex-col bg-dot-grid">

        {/* HERO SECTION */}
        <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 max-w-7xl mx-auto w-full">
          {/* Status Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-hud border border-[#B5E619]/40 text-[#B5E619] font-mono-tech text-xs uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-[#B5E619] animate-ping" />
            <span>CREATIVE TECHNOLOGY & CINEMATIC SYSTEMS</span>
          </div>

          {/* Giant Bold Title in Syne */}
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-display font-black tracking-tight text-[#FBFFFE] uppercase leading-[0.95] mb-8">
            Films <span className="text-[#8E592F]">·</span> Apps <span className="text-[#AFC2D5]">·</span> <br />
            <span className="text-[#B5E619] underline decoration-[#8E592F]/40">Intelligence</span>
          </h1>

          {/* Hero Subtitle in Syne Medium */}
          <p className="max-w-2xl text-base sm:text-xl text-[#AFC2D5]/80 font-display font-medium leading-relaxed mb-12">
            We build things worth watching. J StaR merges high-retention cinematic storytelling with full-stack software architectures and generative AI engines.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              className="px-8 py-4 rounded-xl bg-[#B5E619] text-[#001514] font-mono-tech text-sm font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_30px_rgba(181,230,25,0.4)] flex items-center space-x-2"
            >
              <span>Explore Portfolio</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>
            <a
              href="#craft"
              className="px-8 py-4 rounded-xl glass-hud border border-[#AFC2D5]/30 text-[#FBFFFE] font-mono-tech text-sm font-bold uppercase tracking-wider hover:border-[#B5E619] hover:text-[#B5E619] transition-all flex items-center space-x-2"
            >
              <span>Interactive Grade Demo</span>
              <Sliders className="w-4 h-4 text-[#B5E619]" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-[#AFC2D5]/40 font-mono-tech text-xs">
            <span>SCROLL TO DISCOVER</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#B5E619]" />
          </div>
        </section>

        {/* KINETIC MARQUEE BANNER */}
        <div className="py-6 border-y border-[#AFC2D5]/15 bg-[#001514]/90 overflow-hidden">
          <div className="animate-marquee font-mono-tech text-xs uppercase tracking-widest text-[#AFC2D5]/70">
            <span className="mx-8 text-[#B5E619] font-bold">★ J StaR FILMS</span>
            <span className="mx-8">· COMMERCIAL PRODUCTION & CINEMATOGRAPHY</span>
            <span className="mx-8 text-[#AFC2D5] font-bold">★ J StaR LABS</span>
            <span className="mx-8">· CUSTOM WEB APPS & SHADERS</span>
            <span className="mx-8 text-[#8E592F] font-bold">★ J StaR INTELLIGENCE</span>
            <span className="mx-8">· AUTONOMOUS AGENT PIPELINES</span>
            <span className="mx-8 text-[#B5E619] font-bold">★ J StaR FILMS</span>
            <span className="mx-8">· COMMERCIAL PRODUCTION & CINEMATOGRAPHY</span>
            <span className="mx-8 text-[#AFC2D5] font-bold">★ J StaR LABS</span>
            <span className="mx-8">· CUSTOM WEB APPS & SHADERS</span>
            <span className="mx-8 text-[#8E592F] font-bold">★ J StaR INTELLIGENCE</span>
            <span className="mx-8">· AUTONOMOUS AGENT PIPELINES</span>
          </div>
        </div>

        {/* FUSED SECTION 1 & 2: MANIFESTO & THE THREE DISCIPLINES */}
        <section id="manifesto" className="py-24 px-6 lg:px-16 border-t border-[#AFC2D5]/10 bg-[#001514]/95">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-2 text-[#B5E619] font-mono-tech text-xs tracking-widest uppercase mb-4">
              <span>01 // THE MANIFESTO & DISCIPLINES</span>
              <span className="w-12 h-px bg-[#B5E619]/40" />
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#FBFFFE] tracking-tight leading-tight max-w-4xl mb-6">
              Most agencies force you to choose between <span className="text-[#8E592F] font-serif-italic font-normal">cinematic emotion</span> and <span className="text-[#B5E619] font-mono-tech font-normal">technical rigor</span>. We refuse that compromise.
            </h2>

            <p className="text-[#AFC2D5]/80 text-base max-w-2xl mb-14 font-normal leading-relaxed">
              Three specialized disciplines operating as one unified studio. Click any discipline below to enter its dedicated deep-dive portal:
            </p>

            {/* 3 Discipline Cards */}
            <div id="disciplines" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* J StaR Films */}
              <div onClick={() => setActiveDeepDive('films')} className="portal-card p-8 rounded-2xl glass-hud border-l-4 border-[#8E592F] hover:border-[#B5E619] flex flex-col justify-between group">
                <div className="portal-mask" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between font-mono-tech text-xs text-[#8E592F] mb-4">
                    <span className="font-bold">01 // ANALOG & CINEMA</span>
                    <Clapperboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#FBFFFE] mb-2 group-hover:text-[#8E592F] transition-colors">
                    J StaR Films
                  </h3>
                  <p className="text-sm text-[#AFC2D5]/80 leading-relaxed mb-6 font-normal">
                    Pacing, anamorphic framing, emotional cadence, color grading, and narrative structure. We make audiences feel before they think.
                  </p>
                </div>
                <div className="relative z-10 pt-4 border-t border-[#AFC2D5]/10 flex items-center justify-between font-mono-tech text-xs">
                  <span className="text-[#8E592F] font-bold">280+ Films Produced</span>
                  <span className="text-[#FBFFFE] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>ENTER DEEP DIVE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* J StaR Labs */}
              <div onClick={() => setActiveDeepDive('labs')} className="portal-card p-8 rounded-2xl glass-hud border-l-4 border-[#AFC2D5] hover:border-[#B5E619] flex flex-col justify-between group">
                <div className="portal-mask" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between font-mono-tech text-xs text-[#AFC2D5] mb-4">
                    <span className="font-bold">02 // ARCHITECTURE & CODE</span>
                    <Terminal className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#FBFFFE] mb-2 group-hover:text-[#AFC2D5] transition-colors">
                    J StaR Labs
                  </h3>
                  <p className="text-sm text-[#AFC2D5]/80 leading-relaxed mb-6 font-normal">
                    Full-stack TypeScript, WebGL shaders, distributed databases, clean architectures, and 60fps interaction performance.
                  </p>
                </div>
                <div className="relative z-10 pt-4 border-t border-[#AFC2D5]/10 flex items-center justify-between font-mono-tech text-xs">
                  <span className="text-[#AFC2D5] font-bold">WebGL & Full-Stack</span>
                  <span className="text-[#FBFFFE] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>ENTER DEEP DIVE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* J StaR Intelligence */}
              <div onClick={() => setActiveDeepDive('intelligence')} className="portal-card p-8 rounded-2xl glass-hud border-l-4 border-[#B5E619] hover:border-[#FBFFFE] flex flex-col justify-between group">
                <div className="portal-mask" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between font-mono-tech text-xs text-[#B5E619] mb-4">
                    <span className="font-bold">03 // SYNAPSE & AI</span>
                    <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#FBFFFE] mb-2 group-hover:text-[#B5E619] transition-colors">
                    J StaR Intelligence
                  </h3>
                  <p className="text-sm text-[#AFC2D5]/80 leading-relaxed mb-6 font-normal">
                    Autonomous agent orchestration, multimodal workflows, prompt-engineered pipelines, and custom intelligence tools for creators.
                  </p>
                </div>
                <div className="relative z-10 pt-4 border-t border-[#AFC2D5]/10 flex items-center justify-between font-mono-tech text-xs">
                  <span className="text-[#B5E619] font-bold">10x Acceleration</span>
                  <span className="text-[#FBFFFE] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>ENTER DEEP DIVE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: MULTI-MODE PROOF OF CRAFT */}
        <section id="craft" className="py-24 px-6 lg:px-16 border-t border-[#AFC2D5]/10 bg-[#001514]/90">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="font-mono-tech text-xs text-[#B5E619] tracking-widest uppercase mb-2">03 // PROOF OF CRAFT</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FBFFFE] uppercase tracking-tight mb-4">
                Interactive Comparator
              </h2>
              <p className="text-[#AFC2D5]/80 text-sm max-w-xl mx-auto font-normal">
                Drag the split slider to inspect before-and-after transformation across color science, shader code, and AI synthesis.
              </p>

              {/* Mode Switcher */}
              <div className="inline-flex items-center p-1.5 rounded-xl glass-hud border border-[#AFC2D5]/20 font-mono-tech text-xs mt-6 gap-2">
                <button
                  onClick={() => setComparatorMode('color')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    comparatorMode === 'color'
                      ? 'bg-[#B5E619] text-[#001514] shadow-lg'
                      : 'text-[#AFC2D5]/80 hover:text-[#FBFFFE]'
                  }`}
                >
                  01 // Film Grading
                </button>
                <button
                  onClick={() => setComparatorMode('code')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    comparatorMode === 'code'
                      ? 'bg-[#B5E619] text-[#001514] shadow-lg'
                      : 'text-[#AFC2D5]/80 hover:text-[#FBFFFE]'
                  }`}
                >
                  02 // WebGL Architecture
                </button>
                <button
                  onClick={() => setComparatorMode('ai')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    comparatorMode === 'ai'
                      ? 'bg-[#B5E619] text-[#001514] shadow-lg'
                      : 'text-[#AFC2D5]/80 hover:text-[#FBFFFE]'
                  }`}
                >
                  03 // AI Transcript Engine
                </button>
              </div>
            </div>

            {/* Draggable Stage */}
            <div
              ref={comparatorRef}
              onMouseDown={handleMouseDown}
              onTouchMove={(e) => {
                if (e.touches[0]) handleComparatorMove(e.touches[0].clientX);
              }}
              className="comparator-container w-full h-[380px] sm:h-[460px] rounded-3xl border border-[#AFC2D5]/20 shadow-2xl relative cursor-ew-resize overflow-hidden"
            >
              {/* Left / Before Stage */}
              <div className="absolute inset-0 bg-[#2a302e] flex items-center justify-center p-8 text-center filter saturate-50">
                {comparatorMode === 'color' && (
                  <div className="space-y-3 opacity-60">
                    <div className="font-mono-tech text-xs text-[#AFC2D5] uppercase tracking-widest">[RAW S-LOG3 FLAT PROFILE]</div>
                    <div className="text-2xl sm:text-4xl font-display font-black text-[#FBFFFE] uppercase">Raw Camera Sensor</div>
                    <div className="font-mono-tech text-xs text-[#AFC2D5]">10-BIT 4:2:2 · NO LUT APPLIED</div>
                  </div>
                )}
                {comparatorMode === 'code' && (
                  <div className="space-y-3 opacity-50 font-mono-tech text-xs">
                    <div className="text-[#AFC2D5] uppercase tracking-widest">[RAW DOM BLUEPRINT]</div>
                    <div className="text-2xl sm:text-3xl font-display font-bold text-[#FBFFFE]">&lt;div class="canvas-fallback" /&gt;</div>
                    <div className="text-[#AFC2D5]">0.0 ms shader pipeline</div>
                  </div>
                )}
                {comparatorMode === 'ai' && (
                  <div className="space-y-2 opacity-50 font-mono-tech text-xs text-left max-w-sm">
                    <div className="text-[#AFC2D5] uppercase tracking-widest">// RAW UNINDEXED AUDIO BUFFER</div>
                    <p className="text-[11px] text-[#AFC2D5]/70 font-mono-tech">
                      "um yeah so basically we started the film back in march and then there were lots of things we talked about like..."
                    </p>
                  </div>
                )}
              </div>

              {/* Right / After Stage (Clipped) */}
              <div
                style={{ width: `${sliderPos}%` }}
                className="absolute top-0 left-0 h-full bg-gradient-to-tr from-[#001514] via-[#2a1b12] to-[#12261f] border-r-2 border-[#B5E619] flex items-center justify-center p-8 text-center overflow-hidden"
              >
                {comparatorMode === 'color' && (
                  <div className="space-y-3">
                    <div className="font-mono-tech text-xs text-[#B5E619] uppercase tracking-widest font-bold">[J STAR MASTER CINEMATIC GRADE]</div>
                    <div className="text-2xl sm:text-4xl font-display font-black text-[#FBFFFE] uppercase">Anamorphic Gold</div>
                    <div className="font-mono-tech text-xs text-[#B5E619] font-bold">TOFFEE AMBER & INK OBSIDIAN CONTRAST</div>
                  </div>
                )}
                {comparatorMode === 'code' && (
                  <div className="space-y-3 font-mono-tech text-xs">
                    <div className="text-[#B5E619] uppercase tracking-widest font-bold">[INTERACTIVE SHADER KERNEL]</div>
                    <div className="text-2xl sm:text-3xl font-display font-black text-[#FBFFFE]">WebGL Fluid Dynamics</div>
                    <div className="text-[#B5E619] font-bold">60 FPS · MOUSE VECTOR INERTIA</div>
                  </div>
                )}
                {comparatorMode === 'ai' && (
                  <div className="space-y-2 font-mono-tech text-xs text-left max-w-sm">
                    <div className="text-[#B5E619] font-bold uppercase tracking-widest">// BLINK AI SYNTHESIS ENGINE</div>
                    <div className="p-3 rounded-lg bg-[#001514]/90 border border-[#B5E619]/40 text-[#FBFFFE] text-[11px]">
                      <span className="text-[#B5E619] font-bold">HOOK (00:00-00:05):</span> "Most creators lose 80% of viewers in the first 4 seconds..."
                    </div>
                  </div>
                )}
              </div>

              {/* Slider Handle */}
              <div
                style={{ left: `${sliderPos}%` }}
                className="comparator-handle flex items-center justify-center pointer-events-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#B5E619] text-[#001514] flex items-center justify-center font-bold text-xs shadow-lg">
                  <ChevronsLeftRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex justify-between font-mono-tech text-xs text-[#AFC2D5]/50 mt-3 px-2">
              <span>◀ RAW SENSOR / BLUEPRINT</span>
              <span className="text-[#B5E619]">DRAG INTERACTIVE SLIDER</span>
              <span>J STAR PRODUCTION GRADE ▶</span>
            </div>
          </div>
        </section>

        {/* SECTION 4: SELECTED WORK (PROBLEM -> BUILD -> OUTCOME) */}
        <section id="work" className="py-24 px-6 lg:px-16 border-t border-[#AFC2D5]/10 bg-[#001514] relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <div className="flex items-center space-x-2 text-[#B5E619] font-mono-tech text-xs tracking-widest uppercase mb-2">
                  <span>04 // SELECTED WORK & ARTIFACTS</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-[#FBFFFE] tracking-tight">
                  Evidence Over Adjectives.
                </h2>
              </div>
              <div className="font-mono-tech text-xs text-[#AFC2D5]/60 mt-4 md:mt-0">
                [PROVEN CASE STUDIES]
              </div>
            </div>

            <div className="space-y-12">

              {/* Case 1: Blink */}
              <div className="p-8 lg:p-10 rounded-2xl glass-hud border border-[#AFC2D5]/15 hover:border-[#B5E619]/50 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#AFC2D5]/10">
                  <div>
                    <div className="flex items-center space-x-3 mb-2 font-mono-tech text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#B5E619]/20 text-[#B5E619] font-bold">AI / DESKTOP UTILITY</span>
                      <span className="text-[#AFC2D5]/40">2025</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#FBFFFE] group-hover:text-[#B5E619] transition-colors">
                      Blink — Local AI Workflow Assistant
                    </h3>
                  </div>
                  <a href="#contact" className="inline-flex items-center space-x-2 text-[#B5E619] font-mono-tech text-xs font-bold hover:underline">
                    <span>REQUEST DEMO</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 font-mono-tech text-xs">
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#8E592F] font-bold mb-1">// THE PROBLEM</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Creative directors waste up to 2 hours daily context-switching across browser tabs to summarize video transcripts and manage assets.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#AFC2D5] font-bold mb-1">// THE BUILD</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Lightweight local desktop app with global keystroke HUD, zero-latency local LLM routing, and direct file-system clipboard integration.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#B5E619] font-bold mb-1">// THE OUTCOME</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      10x acceleration in daily asset organization with 100% privacy and offline-first execution.
                    </p>
                  </div>
                </div>
              </div>

              {/* Case 2: Adaptive AI Study Game */}
              <div className="p-8 lg:p-10 rounded-2xl glass-hud border border-[#AFC2D5]/15 hover:border-[#B5E619]/50 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#AFC2D5]/10">
                  <div>
                    <div className="flex items-center space-x-3 mb-2 font-mono-tech text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#AFC2D5]/20 text-[#AFC2D5] font-bold">SOFTWARE / INTERACTIVE PLATFORM</span>
                      <span className="text-[#AFC2D5]/40">2025</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#FBFFFE] group-hover:text-[#AFC2D5] transition-colors">
                      Adaptive AI Study Engine
                    </h3>
                  </div>
                  <a href="#contact" className="inline-flex items-center space-x-2 text-[#AFC2D5] font-mono-tech text-xs font-bold hover:underline">
                    <span>VIEW REPOSITORY</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 font-mono-tech text-xs">
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#8E592F] font-bold mb-1">// THE PROBLEM</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Traditional flashcards and quiz apps suffer from high drop-off rates due to static difficulty curves and lack of dopamine feedback loops.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#AFC2D5] font-bold mb-1">// THE BUILD</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Gamified real-time web application featuring dynamic LLM difficulty scaling, arcade score streaks, and procedural question generation.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#B5E619] font-bold mb-1">// THE OUTCOME</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      85% sustained retention increase during high-stakes examination testing cycles.
                    </p>
                  </div>
                </div>
              </div>

              {/* Case 3: Samsung Galaxy */}
              <div className="p-8 lg:p-10 rounded-2xl glass-hud border border-[#AFC2D5]/15 hover:border-[#8E592F]/50 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#AFC2D5]/10">
                  <div>
                    <div className="flex items-center space-x-3 mb-2 font-mono-tech text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#8E592F]/30 text-[#8E592F] font-bold">FILM / MOBILE CINEMATOGRAPHY</span>
                      <span className="text-[#AFC2D5]/40">2024</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#FBFFFE] group-hover:text-[#8E592F] transition-colors">
                      Samsung Galaxy — Cinematic Visual Showcase
                    </h3>
                  </div>
                  <a href="#contact" className="inline-flex items-center space-x-2 text-[#8E592F] font-mono-tech text-xs font-bold hover:underline">
                    <span>WATCH FILM</span>
                    <Play className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 font-mono-tech text-xs">
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#8E592F] font-bold mb-1">// THE PROBLEM</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Consumer skepticism surrounding mobile camera sensors performing in low-light and commercial-tier anamorphic workflows.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#AFC2D5] font-bold mb-1">// THE BUILD</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Directed and graded an intense 4K narrative film shot entirely on mobile sensor with custom LUT color pipelines and sound design.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#B5E619] font-bold mb-1">// THE OUTCOME</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Over 45K+ organic views and critical acclaim from mobile filmmaker communities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Case 4: Elizade University */}
              <div className="p-8 lg:p-10 rounded-2xl glass-hud border border-[#AFC2D5]/15 hover:border-[#B5E619]/50 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#AFC2D5]/10">
                  <div>
                    <div className="flex items-center space-x-3 mb-2 font-mono-tech text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#8E592F]/30 text-[#8E592F] font-bold">FILM / BRAND DOCUMENTARY</span>
                      <span className="text-[#AFC2D5]/40">2024</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#FBFFFE] group-hover:text-[#B5E619] transition-colors">
                      Elizade University — Institutional Documentary
                    </h3>
                  </div>
                  <a href="#contact" className="inline-flex items-center space-x-2 text-[#B5E619] font-mono-tech text-xs font-bold hover:underline">
                    <span>WATCH DOCUMENTARY</span>
                    <Play className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 font-mono-tech text-xs">
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#8E592F] font-bold mb-1">// THE PROBLEM</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Traditional university promo videos felt generic, overly corporate, and disconnected from genuine student culture.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#AFC2D5] font-bold mb-1">// THE BUILD</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      A high-velocity documentary blending student interviews, kinetic drone choreography, and an original synth-orchestral score.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#001514]/60 border border-[#AFC2D5]/10">
                    <div className="text-[#B5E619] font-bold mb-1">// THE OUTCOME</div>
                    <p className="text-[#AFC2D5]/80 font-sans text-sm font-normal">
                      Premiered at university convocation and adopted as the primary international admissions centerpiece.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 5: CANONICAL METRICS */}
        <section id="metrics" className="py-20 px-6 lg:px-16 border-t border-[#AFC2D5]/15 bg-[#001514]/90">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="font-mono-tech text-xs text-[#B5E619] tracking-widest uppercase mb-2">05 // VERIFIED PROOF</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#FBFFFE] tracking-tight">Canonical Track Record</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono-tech text-center">
              <div className="p-6 rounded-2xl glass-hud">
                <div className="text-4xl sm:text-5xl font-bold text-[#B5E619] mb-2">176K+</div>
                <div className="text-xs text-[#AFC2D5]/60 uppercase tracking-widest">Views Generated</div>
              </div>
              <div className="p-6 rounded-2xl glass-hud">
                <div className="text-4xl sm:text-5xl font-bold text-[#FBFFFE] mb-2">280+</div>
                <div className="text-xs text-[#AFC2D5]/60 uppercase tracking-widest">Films & Edits</div>
              </div>
              <div className="p-6 rounded-2xl glass-hud">
                <div className="text-4xl sm:text-5xl font-bold text-[#8E592F] mb-2">8+</div>
                <div className="text-xs text-[#AFC2D5]/60 uppercase tracking-widest">Client Partners</div>
              </div>
              <div className="p-6 rounded-2xl glass-hud">
                <div className="text-4xl sm:text-5xl font-bold text-[#AFC2D5] mb-2">6+</div>
                <div className="text-xs text-[#AFC2D5]/60 uppercase tracking-widest">Years Polymath Craft</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: MEET JOHN (THE ARCHITECT) */}
        <section id="founder" className="py-24 px-6 lg:px-16 border-t border-[#AFC2D5]/10 relative">
          <div className="max-w-5xl mx-auto">
            <div className="p-8 lg:p-14 rounded-3xl glass-hud border border-[#B5E619]/30 relative overflow-hidden">
              <div className="absolute top-4 right-6 font-mono-tech text-6xl lg:text-8xl font-black text-[#AFC2D5]/5 select-none pointer-events-none">
                POLYMATH
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Portrait */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-[#B5E619] p-1 bg-[#001514] glow-lime mb-6">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#001514] via-[#8E592F]/40 to-[#B5E619]/40 flex items-center justify-center text-5xl font-mono-tech font-black text-[#FBFFFE]">
                      JO
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#B5E619] text-[#001514] font-mono-tech text-[10px] font-bold">
                      FOUNDER
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="space-y-1.5 font-mono-tech text-xs text-[#AFC2D5]/80">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B5E619]" />
                      <span>Software Engineer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8E592F]" />
                      <span>Cinematographer & Editor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#AFC2D5]" />
                      <span>National Speedcuber</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FBFFFE]" />
                      <span>ABRSM Saxophonist</span>
                    </div>
                  </div>
                </div>

                {/* Right Narrative */}
                <div className="lg:col-span-8">
                  <div className="font-mono-tech text-xs text-[#B5E619] tracking-widest uppercase mb-2">
                    06 // THE ARCHITECT
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#FBFFFE] mb-6">
                    "I like building things that shouldn't logically belong together."
                  </h2>
                  <div className="space-y-4 text-[#AFC2D5]/90 text-base leading-relaxed font-normal">
                    <p>
                      I'm John Oluleke-Oke. Most people spend their careers staying in one lane — they either write code, direct cameras, or train algorithms.
                    </p>
                    <p>
                      I believe the most extraordinary breakthroughs happen at the messy intersection. When you approach a film with the algorithmic precision of a software engineer, or build software with the emotional rhythm of a film director, the output is unmistakably distinct.
                    </p>
                    <p className="font-mono-tech text-xs text-[#B5E619] pt-2">
                      // Lagos, Nigeria · Available Worldwide for Direct Commissions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: CONTACT & INTAKE */}
        <section id="contact" className="py-24 px-6 lg:px-16 border-t border-[#AFC2D5]/10 bg-[#001514] relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#B5E619]/10 border border-[#B5E619]/30 text-[#B5E619] font-mono-tech text-xs tracking-widest uppercase mb-6">
              <span>07 // COMMISSIONS & PARTNERSHIPS</span>
            </div>

            {/* Dynamic Glitch / Text Scrambler Headline */}
            <h2
              onMouseEnter={() => {
                const next = (currentPhraseIdx + 1) % SCRAMBLE_PHRASES.length;
                setCurrentPhraseIdx(next);
                triggerScramble(SCRAMBLE_PHRASES[next]);
              }}
              className="text-4xl sm:text-6xl font-extrabold text-[#FBFFFE] tracking-tight mb-6 cursor-pointer"
            >
              {scrambledText} <br />
              <span className="font-serif-italic font-normal text-[#B5E619] text-glow-lime">Let's build it.</span>
            </h2>

            <p className="text-[#AFC2D5]/80 text-lg max-w-xl mx-auto mb-10 font-normal">
              We accept a limited number of high-impact commissions each quarter across cinematic production, custom software, and AI systems.
            </p>

            {/* Intake Form */}
            <div className="p-8 sm:p-10 rounded-2xl glass-hud border border-[#AFC2D5]/20 text-left max-w-2xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }}
                className="space-y-6 font-mono-tech text-xs"
              >
                <div>
                  <label className="block text-[#AFC2D5]/70 uppercase tracking-wider mb-2">
                    // 01: What are you looking to build?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center space-x-2 p-3 rounded-lg bg-[#001514]/80 border border-[#AFC2D5]/20 cursor-pointer hover:border-[#B5E619]">
                      <input
                        type="radio"
                        name="project_type"
                        value="film"
                        checked={projectType === 'film'}
                        onChange={() => setProjectType('film')}
                        className="text-[#B5E619] focus:ring-0"
                      />
                      <span className="text-[#FBFFFE]">Cinematic Film</span>
                    </label>
                    <label className="flex items-center space-x-2 p-3 rounded-lg bg-[#001514]/80 border border-[#AFC2D5]/20 cursor-pointer hover:border-[#B5E619]">
                      <input
                        type="radio"
                        name="project_type"
                        value="software"
                        checked={projectType === 'software'}
                        onChange={() => setProjectType('software')}
                        className="text-[#B5E619] focus:ring-0"
                      />
                      <span className="text-[#FBFFFE]">Web / Software</span>
                    </label>
                    <label className="flex items-center space-x-2 p-3 rounded-lg bg-[#001514]/80 border border-[#AFC2D5]/20 cursor-pointer hover:border-[#B5E619]">
                      <input
                        type="radio"
                        name="project_type"
                        value="ai"
                        checked={projectType === 'ai'}
                        onChange={() => setProjectType('ai')}
                        className="text-[#B5E619] focus:ring-0"
                      />
                      <span className="text-[#FBFFFE]">AI / Automation</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#AFC2D5]/70 uppercase tracking-wider mb-2">
                      // 02: Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      className="w-full px-4 py-3 rounded-lg bg-[#001514]/90 border border-[#AFC2D5]/20 text-[#FBFFFE] focus:outline-none focus:border-[#B5E619] text-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[#AFC2D5]/70 uppercase tracking-wider mb-2">
                      // 03: Direct Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-lg bg-[#001514]/90 border border-[#AFC2D5]/20 text-[#FBFFFE] focus:outline-none focus:border-[#B5E619] text-sm font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#AFC2D5]/70 uppercase tracking-wider mb-2">
                    // 04: Brief Project Details & Timeline
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the vision, target scope, and timeline..."
                    className="w-full px-4 py-3 rounded-lg bg-[#001514]/90 border border-[#AFC2D5]/20 text-[#FBFFFE] focus:outline-none focus:border-[#B5E619] text-sm font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#B5E619] text-[#001514] font-bold font-mono-tech text-sm uppercase tracking-widest hover:bg-[#FBFFFE] transition-all glow-lime flex items-center justify-center space-x-2"
                >
                  <span>Transmit Project Intake</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {formSubmitted && (
                <div className="mt-4 p-4 rounded-lg bg-[#B5E619]/20 border border-[#B5E619] text-[#B5E619] font-mono-tech text-xs text-center font-bold">
                  ✓ INTAKE RECEIVED. John will personally review your brief within 24 hours.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-6 lg:px-16 border-t border-[#AFC2D5]/10 font-mono-tech text-xs text-[#AFC2D5]/60">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-[#B5E619] text-[#001514] flex items-center justify-center font-bold">J★</div>
              <span className="text-[#FBFFFE] font-bold">J StaR Studios</span>
              <span>© 2026. All Rights Reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#B5E619] transition-colors">YouTube</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#B5E619] transition-colors">GitHub</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#B5E619] transition-colors">Twitter / X</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#B5E619] transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>

      </main>

      {/* TIME-TRAVEL DEEP-DIVE MODAL */}
      {activeDeepDive && DEEP_DIVE_DATA[activeDeepDive] && (
        <div className="fixed inset-0 z-50 p-4 sm:p-8 flex items-center justify-center bg-[#001514]/90 backdrop-blur-2xl">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-hud-lime p-8 sm:p-12 border border-[#B5E619] relative shadow-2xl">
            <button
              onClick={() => setActiveDeepDive(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#001514] border border-[#AFC2D5]/30 hover:border-[#B5E619] text-[#AFC2D5] hover:text-[#B5E619] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className={`inline-block px-3 py-1 rounded-full font-mono-tech text-xs font-bold uppercase tracking-wider border ${DEEP_DIVE_DATA[activeDeepDive].badgeColor}`}>
                {DEEP_DIVE_DATA[activeDeepDive].tag}
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[#FBFFFE] uppercase">
                {DEEP_DIVE_DATA[activeDeepDive].title}
              </h2>
              <p className="text-xl font-serif-italic text-[#B5E619]">
                "{DEEP_DIVE_DATA[activeDeepDive].quote}"
              </p>
              <p className="text-[#AFC2D5]/90 text-base leading-relaxed font-sans font-normal">
                {DEEP_DIVE_DATA[activeDeepDive].desc}
              </p>
              <div className="p-6 rounded-2xl bg-[#001514]/90 border border-[#AFC2D5]/20 space-y-3 font-mono-tech text-xs">
                <div className="text-[#AFC2D5]/50 uppercase tracking-widest">// CORE CAPABILITIES</div>
                {DEEP_DIVE_DATA[activeDeepDive].capabilities.map((c, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-[#FBFFFE]">
                    <span className="text-[#B5E619]">▸</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#AFC2D5]/15 font-mono-tech text-xs">
                <span className="text-[#B5E619] font-bold">{DEEP_DIVE_DATA[activeDeepDive].metrics}</span>
                <a
                  href="#contact"
                  onClick={() => setActiveDeepDive(null)}
                  className="px-6 py-3 rounded-xl bg-[#B5E619] text-[#001514] font-bold uppercase tracking-wider hover:bg-[#FBFFFE] transition-all glow-lime text-center"
                >
                  Commission In This Discipline →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
