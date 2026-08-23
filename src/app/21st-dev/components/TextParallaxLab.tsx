'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Terminal, Shuffle, RefreshCw } from 'lucide-react';

const WORDS = [
  'CINEMATIC FILMS',
  'LOCAL AI DESKTOP',
  'DAVINCI COLORING',
  'FULL-STACK SAAS',
  'SPEEDCUBING ALGORITHMS',
];

const GLYPHS = '0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?';

export const TextParallaxLab: React.FC = () => {
  const [scrambledText, setScrambledText] = useState('CREATIVE TECHNOLOGY');
  const [wordIndex, setWordIndex] = useState(0);

  // Scramble effect
  const triggerScramble = (targetText: string = 'CREATIVE TECHNOLOGY') => {
    let iteration = 0;
    const interval = setInterval(() => {
      setScrambledText((prev) =>
        targetText
          .split('')
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  };

  useEffect(() => {
    const cycle = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-powder-blue/20 text-chartreuse font-mono text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Lab 02 // Typography & Morphing Text Effects
        </div>
        <h3 className="text-2xl font-bold text-ghost-white">
          Matrix Scramble Decoding, Word Cycling & Parallax Layers
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scramble Text Decoder */}
        <div className="p-8 rounded-3xl bg-card border border-powder-blue/20 flex flex-col justify-between min-h-[260px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-powder-blue/70">
                01 // Scramble Cyber-Decoder
              </span>
              <button
                onClick={() => triggerScramble('J STAR STUDIOS')}
                className="px-3 py-1 rounded-full bg-ink-black border border-chartreuse/30 text-chartreuse font-mono text-xs font-bold hover:bg-chartreuse hover:text-ink-black transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Scramble
              </button>
            </div>

            <p
              onMouseEnter={() => triggerScramble('DISCIPLINE & CRAFT')}
              className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-ghost-white cursor-pointer hover:text-chartreuse transition-colors py-4"
            >
              {scrambledText}
            </p>
          </div>

          <p className="text-xs font-mono text-powder-blue/60">
            Hover over text or click "Scramble" to trigger random glyph decoding interpolation.
          </p>
        </div>

        {/* Morphing Word Cycler */}
        <div className="p-8 rounded-3xl bg-card border border-powder-blue/20 flex flex-col justify-between min-h-[260px]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-powder-blue/70 mb-4 block">
              02 // Morphing Keyword Cycler
            </span>

            <div className="py-4">
              <span className="text-xl sm:text-2xl text-powder-blue/80 font-medium block mb-1">
                We design and ship
              </span>
              <motion.div
                key={wordIndex}
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-2xl sm:text-3xl font-extrabold text-chartreuse tracking-tight"
              >
                {WORDS[wordIndex]}
              </motion.div>
            </div>
          </div>

          <p className="text-xs font-mono text-powder-blue/60">
            Smooth layout-preserving spring fade and blur transformation between capability pillars.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextParallaxLab;
