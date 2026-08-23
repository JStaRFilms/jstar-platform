'use client';

import React, { useState, useCallback, useRef } from 'react';
import { LensType, LENSES } from './components/v3-theme';
import { NeuralNoiseCanvas } from './components/NeuralNoiseCanvas';
import { V3Navigation } from './components/V3Navigation';
import { HeroSection } from './components/HeroSection';
import { ManifestoSection } from './components/ManifestoSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { PolymathSection } from './components/PolymathSection';
import { ProjectTerminalSection } from './components/ProjectTerminalSection';
import { V3Footer } from './components/V3Footer';

export default function V3Page() {
  const [activeLens, setActiveLens] = useState<LensType>('film');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Subtle web audio synthesis for haptic audio feedback
  const playHapticTone = useCallback((freq = 440, type: OscillatorType = 'sine', duration = 0.05) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  }, [soundEnabled]);

  const handleSelectLens = (lens: LensType) => {
    setActiveLens(lens);
    playHapticTone(587.33, 'sine', 0.08); // High note on lens switch
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playHapticTone(880, 'sine', 0.1);
    }
  };

  const currentLensConfig = LENSES[activeLens];

  return (
    <main className="relative min-h-screen bg-[#001514] text-[#FBFFFE] selection:bg-[#B5E619] selection:text-[#001514] overflow-x-hidden font-sans antialiased">
      {/* Dynamic WebGL Shader Background */}
      <NeuralNoiseCanvas
        color={currentLensConfig.shaderColor}
        speed={currentLensConfig.shaderSpeed}
        opacity={0.65}
      />

      {/* Floating Dynamic Island Navigation */}
      <V3Navigation
        activeLens={activeLens}
        onSelectLens={handleSelectLens}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Page Content Layers */}
      <div className="relative z-10 flex flex-col">
        <HeroSection
          activeLens={activeLens}
          onSelectLens={handleSelectLens}
          playFeedback={() => playHapticTone(520, 'sine', 0.04)}
        />

        <ManifestoSection
          playFeedback={() => playHapticTone(440, 'sine', 0.04)}
        />

        <ShowcaseSection
          playFeedback={() => playHapticTone(480, 'sine', 0.04)}
        />

        <PolymathSection
          playFeedback={() => playHapticTone(660, 'triangle', 0.06)}
        />

        <ProjectTerminalSection
          playFeedback={() => playHapticTone(740, 'sine', 0.05)}
        />

        <V3Footer />
      </div>
    </main>
  );
}
