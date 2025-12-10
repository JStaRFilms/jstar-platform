'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';
import { PROFILE_DATA } from '../data/portfolio';
import { Trophy, Medal, Timer, Zap } from 'lucide-react';

const ThePolymath = () => {
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
    const { refs: statRefs, visibilityStates: statVisibility } = useScrollAnimationMulti<HTMLDivElement>({
        count: PROFILE_DATA.speedcubing.records.length,
        staggerDelay: 100,
    });

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Decor - Abstract Cubes? */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div
                    ref={headerRef}
                    className={`text-center mb-16 scroll-animate-hidden ${isHeaderVisible ? 'scroll-animate-fade-in-up' : ''}`}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-medium tracking-wider mb-6">
                        <Trophy className="w-3 h-3" />
                        HIDDEN TALENT
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        The Speedcuber
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        {PROFILE_DATA.speedcubing.highlight}
                    </p>
                </div>

                {/* Medals & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* WCA ID Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col justify-between group hover:bg-white/10 transition-colors">
                        <div>
                            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">WCA ID</span>
                            <div className="text-3xl font-mono font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">{PROFILE_DATA.speedcubing.wcaId}</div>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
                            <Zap className="w-4 h-4" />
                            Official Competitor
                        </div>
                    </div>

                    {/* Medals Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-500/20 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Medal className="w-16 h-16 text-yellow-500" />
                        </div>
                        <div>
                            <span className="text-yellow-500/80 text-sm font-medium uppercase tracking-wider">National Medals</span>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl font-bold text-white">
                                    {PROFILE_DATA.speedcubing.medals.gold + PROFILE_DATA.speedcubing.medals.silver + PROFILE_DATA.speedcubing.medals.bronze}
                                </span>
                                <span className="text-sm text-gray-400">Total</span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-yellow-400">{PROFILE_DATA.speedcubing.medals.gold}</span>
                                <span className="text-[10px] uppercase text-gray-500">Gold</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-gray-300">{PROFILE_DATA.speedcubing.medals.silver}</span>
                                <span className="text-[10px] uppercase text-gray-500">Silver</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-orange-400">{PROFILE_DATA.speedcubing.medals.bronze}</span>
                                <span className="text-[10px] uppercase text-gray-500">Bronze</span>
                            </div>
                        </div>
                    </div>

                    {/* PBs - Dynamic from Data */}
                    {PROFILE_DATA.speedcubing.records.slice(0, 2).map((record, index) => (
                        <div
                            key={record.event}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-colors"
                        >
                            <div>
                                <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">{record.event}</span>
                                <div className="mt-4 flex flex-col gap-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-2xl font-bold text-white">{record.single}</span>
                                        <span className="text-xs text-gray-500 mb-1">Single</span>
                                    </div>
                                    <div className="w-full h-px bg-white/10 my-1" />
                                    <div className="flex justify-between items-end">
                                        <span className="text-xl font-bold text-gray-300">{record.average}</span>
                                        <span className="text-xs text-gray-500 mb-1">Avg</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded w-fit">
                                {record.rank}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ThePolymath;
