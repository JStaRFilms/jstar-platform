'use client';

import { usePersonaData } from '../hooks/usePersonaData';
import PersonaToggle from './PersonaToggle';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

export default function MeHero() {
  const { hero, mode } = usePersonaData();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Dynamic Background */}
      <div className={cn(
        "absolute inset-0 transition-colors duration-1000 bg-gradient-to-br",
        hero.bgStyle
      )} />

      {/* Animated Mesh/Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
        {/* Toggle */}
        <div className="animate-in fade-in slide-in-from-top-8 duration-700 delay-100">
          <PersonaToggle />
        </div>

        {/* Headlines */}
        <div className="space-y-6">
          <h1 className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r transition-all duration-700",
            mode === 'ENGINEER'
              ? "from-white via-blue-100 to-blue-200 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              : "from-white via-amber-100 to-amber-200 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]"
          )}>
            {hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {hero.subheadline}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white/50" />
        </div>
      </div>
    </section>
  );
}
