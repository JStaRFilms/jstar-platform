'use client';

import React from 'react';
import { PROFILE_DATA } from '../data/portfolio';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FeaturedProjects = () => {
    // Animation for header
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({
        triggerOnce: true,
        threshold: 0.1
    });

    // Animation for project cards
    const { refs: projectRefs, visibilityStates: projectVisibility } = useScrollAnimationMulti<HTMLDivElement>({
        count: 3,
        staggerDelay: 150,
        triggerOnce: true
    });

    return (
        <section className="py-24 bg-black relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={headerRef}
                    className={`flex flex-col md:flex-row justify-between items-end mb-16 scroll-animate-hidden ${isHeaderVisible ? 'scroll-animate-fade-in-up' : ''}`}
                >
                    <div className="max-w-2xl">
                        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-jstar-blue/10 border border-jstar-blue/20">
                            <span className="text-jstar-blue font-bold text-xs tracking-wider uppercase">
                                Selected Works
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Featured Projects
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            A curation of digital products, AI applications, and immersive experiences that define my approach to creative technology.
                        </p>
                    </div>
                    <a
                        href="/portfolio"
                        className="hidden md:flex items-center gap-2 text-white font-medium hover:text-jstar-blue transition-colors group px-6 py-3 rounded-full border border-white/10 hover:border-jstar-blue/50 hover:bg-white/5"
                    >
                        View Full Portfolio
                        <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROFILE_DATA.projects.slice(0, 3).map((project, index) => (
                        <div
                            key={index}
                            ref={projectRefs[index]}
                            className={`group relative bg-gray-900/50 border border-white/5 rounded-2xl p-8 hover:border-jstar-blue/30 hover:bg-white/5 transition-all duration-500 hover:-translate-y-2 scroll-animate-hidden ${projectVisibility[index] ? 'scroll-animate-fade-in-up' : ''}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-jstar-blue/0 to-jstar-blue/0 group-hover:from-jstar-blue/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-500" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-jstar-blue transition-colors">
                                        {project.title}
                                    </h3>
                                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-jstar-blue/20 transition-colors">
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-jstar-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </div>

                                <p className="text-xs font-mono text-faith-purple mb-4 uppercase tracking-wider">
                                    {project.tech}
                                </p>

                                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-4 group-hover:text-gray-300 transition-colors">
                                    {project.description}
                                </p>

                                <a
                                    href={project.link}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                >
                                    Explore Project
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a
                        href="/portfolio"
                        className="inline-flex px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                    >
                        View All Projects
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjects;
