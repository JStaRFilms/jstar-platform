'use client';

import { usePersonaData } from '../hooks/usePersonaData';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ContactCTA() {
  const { cta, mode } = usePersonaData();

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 opacity-20",
        mode === 'ENGINEER'
          ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-neutral-900 to-black"
          : "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900 via-neutral-900 to-black"
      )} />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          {cta.text}
        </h2>

        <div className="flex justify-center pt-8">
          <Link
            href={cta.link}
            target="_blank"
            className={cn(
              "group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105",
              mode === 'ENGINEER'
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                : "bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_30px_rgba(217,119,6,0.3)]"
            )}
          >
            {cta.buttonLabel}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
