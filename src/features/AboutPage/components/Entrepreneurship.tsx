'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';
import { PROFILE_DATA } from '../data/portfolio';
import { ArrowUpRight } from 'lucide-react';

const Entrepreneurship = () => {
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
    const { refs: ventureRefs, visibilityStates: ventureVisibility } = useScrollAnimationMulti<HTMLDivElement>({
        count: PROFILE_DATA.ventures.length,
        staggerDelay: 200,
    });

    return (
        <section className="py-24 bg-[#050505] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div
                    ref={headerRef}
                    className={`mb-16 scroll-animate-hidden ${isHeaderVisible ? 'scroll-animate-fade-in-up' : ''}`}
                >
                    <span className="block text-purple-500 text-sm font-medium tracking-wider uppercase mb-3">Leadership & Vision</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Entrepreneurship & Speaking</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PROFILE_DATA.ventures.map((venture, index) => {
                        const Icon = venture.icon;
                        return (
                            <div
                                key={venture.name}
                                ref={ventureRefs[index]}
                                className={`group relative p-8 rounded-3xl bg-gray-900/50 border border-white/5 hover:bg-gray-800/50 transition-all duration-500 scroll-animate-hidden ${ventureVisibility[index] ? 'scroll-animate-fade-in-up' : ''}`}
                            >
                                <div className="absolute top-8 right-8 text-gray-600 group-hover:text-white transition-colors duration-300">
                                    <ArrowUpRight className="w-6 h-6" />
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform duration-500">
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{venture.name}</h3>
                                <p className="text-purple-400 font-medium mb-4">{venture.role}</p>
                                <p className="text-gray-400 leading-relaxed text-lg">{venture.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Entrepreneurship;
