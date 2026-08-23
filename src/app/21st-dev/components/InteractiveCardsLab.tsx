'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Eye, Play, Star, ShieldCheck, Zap } from 'lucide-react';

export const InteractiveCardsLab: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-powder-blue/20 text-chartreuse font-mono text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Lab 01 // Interactive Cards & Bento Physics
        </div>
        <h3 className="text-2xl font-bold text-ghost-white">
          3D Perspective Tilt, Radial Spotlight & Expanders
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 3D Spring Tilt Card */}
        <TiltCard />

        {/* Card 2: Mouse Spotlight Flare Card */}
        <SpotlightCard />

        {/* Card 3: Glowing Gradient Border Hologram */}
        <GlowBorderCard />
      </div>
    </div>
  );
};

// 1. 3D Spring Tilt Card
const TiltCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className="relative h-80 rounded-3xl bg-card border border-powder-blue/20 p-6 flex flex-col justify-between overflow-hidden shadow-2xl group cursor-pointer"
    >
      <div style={{ transform: 'translateZ(40px)' }} className="space-y-3">
        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-chartreuse/10 border border-chartreuse/30 text-chartreuse font-bold">
          3D Perspective Tilt
        </span>
        <h4 className="text-xl font-bold text-ghost-white group-hover:text-chartreuse transition-colors">
          Blink AI Desktop Utility
        </h4>
        <p className="text-xs text-powder-blue/80 leading-relaxed">
          Spring-damped 3D rotation with depth layers. Mouse coordinate tracking creates realistic optical parallax.
        </p>
      </div>

      <div style={{ transform: 'translateZ(60px)' }} className="p-4 rounded-2xl bg-ink-black/80 border border-powder-blue/15 flex items-center justify-between">
        <div className="flex items-center gap-2 text-chartreuse text-xs font-mono">
          <Zap className="w-4 h-4" />
          <span>Local ONNX Model</span>
        </div>
        <span className="text-[10px] font-mono text-powder-blue/60">0.02ms Latency</span>
      </div>
    </motion.div>
  );
};

// 2. Mouse Spotlight Card
const SpotlightCard = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-80 rounded-3xl bg-card border border-powder-blue/20 p-6 flex flex-col justify-between overflow-hidden shadow-2xl group cursor-pointer"
    >
      {/* Radial Spotlight Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(181, 230, 25, 0.15), transparent 80%)`,
          }}
        />
      )}

      <div className="space-y-3 relative z-10">
        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-toffee-brown/20 border border-toffee-brown/40 text-toffee-brown font-bold">
          Radial Spotlight
        </span>
        <h4 className="text-xl font-bold text-ghost-white group-hover:text-chartreuse transition-colors">
          DaVinci Resolve Color Grade
        </h4>
        <p className="text-xs text-powder-blue/80 leading-relaxed">
          Dynamic spotlight follow effect illuminating filmic grain and metadata tags on pointer hover.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-powder-blue/10">
        <div className="flex items-center gap-1 text-chartreuse">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" />
          ))}
        </div>
        <span className="text-xs font-mono text-powder-blue/70">Verified Production</span>
      </div>
    </div>
  );
};

// 3. Glow Gradient Border Hologram Card
const GlowBorderCard = () => {
  return (
    <div className="relative h-80 rounded-3xl p-[1px] overflow-hidden group cursor-pointer shadow-2xl">
      {/* Moving Animated Gradient Border */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,#B5E619_360deg)] animate-[spin_4s_linear_infinite]" />

      <div className="relative h-full w-full rounded-[23px] bg-card p-6 flex flex-col justify-between z-10">
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase bg-powder-blue/10 border border-powder-blue/30 text-powder-blue font-bold">
            Kinetic Border Glow
          </span>
          <h4 className="text-xl font-bold text-ghost-white group-hover:text-chartreuse transition-colors">
            Speedcubing Algorithm Engine
          </h4>
          <p className="text-xs text-powder-blue/80 leading-relaxed">
            Continuous conic-gradient boundary light tracing the card perimeter at 60 FPS without layout repaint.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-ink-black border border-powder-blue/10 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-chartreuse">11.73s Single</span>
          <span className="text-[10px] font-mono text-powder-blue/60">WCA ID: 2022JOHN41</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCardsLab;
