'use client';

import React from 'react';
import { PROFILE_DATA } from '../data/portfolio';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ProfessionalExperience = () => {
    // Header animation
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({
        triggerOnce: true,
        threshold: 0.2
    });

    // Timeline items animation
    const { refs: itemRefs, visibilityStates: itemVisibility } = useScrollAnimationMulti<HTMLDivElement>({
        count: PROFILE_DATA.experience.length,
        staggerDelay: 200,
        triggerOnce: true
    });

    return (
        <section className="py-24 relative bg-gray-900 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-16">
                    {/* Header */}
                    <div className="md:w-1/3">
                        <div
                            ref={headerRef}
                            className={`sticky top-24 scroll-animate-hidden ${isHeaderVisible ? 'scroll-animate-fade-in-left' : ''}`}
                        >
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                                Professional Experience
                            </h2>
                            <p className="text-gray-400 leading-relaxed text-lg mb-8">
                                A timeline of my journey in technology, media production, and system architecture.
                            </p>
                            <div className="hidden md:block w-12 h-1 bg-gradient-to-r from-jstar-blue to-transparent rounded-full" />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="md:w-2/3 space-y-16 relative border-l border-white/10 pl-8 ml-4 md:ml-0">
                        {PROFILE_DATA.experience.map((job, index) => (
                            <div
                                key={index}
                                ref={itemRefs[index]}
                                className={`relative group scroll-animate-hidden ${itemVisibility[index] ? 'scroll-animate-fade-in-up' : ''}`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-2 border-white/20 bg-gray-900 group-hover:border-jstar-blue group-hover:bg-jstar-blue/20 transition-all duration-300 shadow-md shadow-black/50" />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-jstar-blue transition-colors">
                                        {job.role}
                                    </h3>
                                    <span className="text-sm font-mono text-jstar-blue bg-jstar-blue/10 border border-jstar-blue/20 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                                        {job.period}
                                    </span>
                                </div>

                                <div className="text-lg text-faith-purple font-medium mb-6 flex items-center gap-2">
                                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {job.company}
                                </div>

                                <ul className="space-y-4">
                                    {job.description.map((desc, i) => (
                                        <li key={i} className="text-gray-400 leading-relaxed flex items-start gap-3 group/item hover:text-gray-300 transition-colors">
                                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/20 shrink-0 group-hover/item:bg-jstar-blue transition-colors" />
                                            {desc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfessionalExperience;
