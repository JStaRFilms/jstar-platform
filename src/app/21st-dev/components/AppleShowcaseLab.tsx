'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Terminal, Film, Sliders, CheckCircle2, Copy } from 'lucide-react';

export const AppleShowcaseLab: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install @jstar/creative-os');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-powder-blue/20 text-chartreuse font-mono text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Lab 04 // Apple-Style App Window & DaVinci Grade Slider
        </div>
        <h3 className="text-2xl font-bold text-ghost-white">
          Precision Studio Windows & Interactive Before/After Comparisons
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Apple-style Studio Terminal Window (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-card border border-powder-blue/20 overflow-hidden shadow-2xl">
          {/* macOS Titlebar */}
          <div className="px-6 py-3.5 bg-ink-black/90 border-b border-powder-blue/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-xs font-mono text-powder-blue/70 font-semibold">
              blink-agent ~ onnx-runtime
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-mono text-powder-blue/60 hover:text-chartreuse transition-colors flex items-center gap-1"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-chartreuse" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Terminal Body */}
          <div className="p-6 font-mono text-xs text-powder-blue/90 space-y-3 bg-ink-black">
            <p className="text-chartreuse font-bold">
              $ jstar-neural-core --model onnx/sentiment-v2 --threads 8
            </p>
            <p className="text-powder-blue/70">
              [INFO] Loaded local neural graph: 48.2MB in 12ms.
            </p>
            <p className="text-powder-blue/70">
              [INFO] Directing 4K multi-cam DaVinci timeline sync...
            </p>
            <div className="p-4 rounded-xl bg-card border border-powder-blue/15 space-y-2 mt-4">
              <div className="flex justify-between text-ghost-white font-bold">
                <span>Real-time Inference Speed:</span>
                <span className="text-chartreuse">0.018ms</span>
              </div>
              <div className="w-full bg-ink-black h-2 rounded-full overflow-hidden">
                <div className="bg-chartreuse h-full w-[94%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Compare Slider (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-card border border-powder-blue/20 p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-powder-blue/70">
                Color Grade Scrubber
              </span>
              <span className="text-xs font-mono text-chartreuse font-bold">
                {sliderPos}% Graded
              </span>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden bg-ink-black select-none">
              <Image
                src="/me/cam.jpg"
                alt="Original Log vs Graded"
                fill
                className="object-cover"
                style={{
                  filter: `saturate(${1 + (sliderPos / 100) * 0.8}) contrast(${1 + (sliderPos / 100) * 0.4})`,
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-chartreuse shadow-glow-chartreuse"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-chartreuse text-ink-black flex items-center justify-center shadow-lg cursor-ew-resize">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full mt-4 accent-[#B5E619] cursor-pointer"
            />
          </div>

          <p className="text-[11px] font-mono text-powder-blue/70 pt-3">
            Interactive DaVinci Resolve color science comparison (S-Log3 flat profile vs custom filmic LUT).
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppleShowcaseLab;
