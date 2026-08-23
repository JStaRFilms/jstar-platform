'use client';

import React, { useState } from 'react';
import { Terminal, Copy, CheckCircle2 } from 'lucide-react';

interface TerminalLiveWindowProps {
  className?: string;
}

const COMMAND_SCENARIOS = [
  {
    cmd: '$ jstar-cli infer --model onnx/sentiment-v2 --threads 8',
    output: [
      '[INFO] Initializing ONNX Runtime DirectML engine...',
      '[INFO] Model loaded: 48.2MB graph in 12ms.',
      '[METRIC] Zero-cloud inference latency: 0.018ms/token.',
      '[STATUS] Offline privacy mode: SECURE_LOCAL.',
    ],
  },
  {
    cmd: '$ davinci-sync --project "Elizade Documentary" --aces-lut "Kodak5219"',
    output: [
      '[ACES] Matching 12-bit RAW clips to DaVinci Studio timeline...',
      '[COLOR] Applying 35mm film grain & highlight rolloff...',
      '[RENDER] 4K DCI ProRes 4444 export ready (280+ masters in archive).',
      '[STATUS] Color science verified across Rec.709 and DCI-P3.',
    ],
  },
  {
    cmd: '$ speedcube-solver --scramble "R U R\' U\' R\' F R2 U\' R\' U\' R U R\' F\'"',
    output: [
      '[WCA ID] 2022JOHN41 // National Podiums & Gold Medals.',
      '[SOLVER] Analyzing 3D permutation geometry in 0.002s...',
      '[SOLUTION] T-Permutation detected. Execution: 0.72s (14.2 TPS).',
      '[RECORD] Single PR: 11.73s. Fast spatial logic applied to software.',
    ],
  },
];

export const TerminalLiveWindow: React.FC<TerminalLiveWindowProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const scenario = COMMAND_SCENARIOS[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-3xl bg-card border border-powder-blue/20 overflow-hidden shadow-2xl ${className}`}>
      {/* macOS Studio Titlebar */}
      <div className="px-5 py-3.5 bg-ink-black/90 border-b border-powder-blue/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-card/80 p-1 rounded-xl border border-powder-blue/10">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              activeTab === 0 ? 'bg-chartreuse text-ink-black font-bold' : 'text-powder-blue/70 hover:text-ghost-white'
            }`}
          >
            neural-onnx
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              activeTab === 1 ? 'bg-chartreuse text-ink-black font-bold' : 'text-powder-blue/70 hover:text-ghost-white'
            }`}
          >
            davinci-aces
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-colors ${
              activeTab === 2 ? 'bg-chartreuse text-ink-black font-bold' : 'text-powder-blue/70 hover:text-ghost-white'
            }`}
          >
            speedcube-wca
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="text-xs font-mono text-powder-blue/60 hover:text-chartreuse transition-colors flex items-center gap-1"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-chartreuse" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Terminal Output Body */}
      <div className="p-6 font-mono text-xs text-powder-blue/90 space-y-3 bg-ink-black min-h-[220px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-chartreuse font-bold text-sm">
            <Terminal className="w-4 h-4" />
            <span>{scenario.cmd}</span>
          </div>

          <div className="space-y-1.5 pt-2 text-[11px] text-powder-blue/80">
            {scenario.output.map((line, idx) => (
              <p key={idx} className="leading-relaxed">
                {line.startsWith('[METRIC]') || line.startsWith('[RECORD]') ? (
                  <span className="text-chartreuse font-semibold">{line}</span>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-powder-blue/10 flex items-center justify-between text-[10px] text-powder-blue/50">
          <span>RUNNING ON LOCAL THREAD POOL</span>
          <span className="text-chartreuse font-bold">LATENCY: &lt; 1ms</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalLiveWindow;
