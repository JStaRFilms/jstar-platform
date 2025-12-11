'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { PROFILE_DATA } from '../data/portfolio';
import { Music, Box, Youtube, Code, Cpu, Trophy, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ThePolymath = () => {
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });

    // Speedcubing Card State
    const [isHoveringCube, setIsHoveringCube] = useState(false);
    const [activeRecordIndex, setActiveRecordIndex] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHoveringCube) {
            interval = setInterval(() => {
                setActiveRecordIndex((prev) => (prev + 1) % PROFILE_DATA.speedcubing.records.length);
            }, 2000);
        } else {
            setActiveRecordIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHoveringCube]);

    // Animation variants for grid items
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div
                    ref={headerRef}
                    className={`text-center mb-16 scroll-animate-hidden ${isHeaderVisible ? 'scroll-animate-fade-in-up' : ''}`}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium tracking-wider mb-6">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        MORE THAN JUST CODE
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Polymath</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        I believe in the intersection of disciplines. Whether it's the rhythm of jazz, the logic of algorithms, or the storytelling of cinema—it all feeds the creative process.
                    </p>
                </div>

                {/* Bento Grid layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]"
                >

                    {/* 1. The Musician (Large - 2x2 on desktop) */}
                    <motion.div
                        variants={itemVariants}
                        className="col-span-1 md:col-span-2 row-span-2 relative group rounded-3xl overflow-hidden border border-white/10 bg-gray-900"
                    >
                        <Image
                            src="/me/sax.jpg"
                            alt="Playing Saxophone"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                <Music className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-wider uppercase">The Musician</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">Classically Trained. <br />Soulfully Driven.</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold mt-2">
                                <Trophy className="w-3 h-3" />
                                ABRSM Grade 5 Merit
                            </div>
                            <p className="text-gray-400 mt-4 max-w-sm">
                                Alto Saxophonist since 2015. Finding the rhythm in code and the melody in chaos.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. The Competitor (Speedcubing stats - Interactive) */}
                    <motion.div
                        variants={itemVariants}
                        className="col-span-1 md:col-span-1 row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col hover:border-blue-500/30 transition-colors"
                        onMouseEnter={() => setIsHoveringCube(true)}
                        onMouseLeave={() => setIsHoveringCube(false)}
                    >
                        {/* Background Icon */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-5 transition-opacity">
                            <Box className="w-24 h-24" />
                        </div>

                        {/* Header (Always Visible) */}
                        <div className="relative z-10 mb-4 flex-shrink-0">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Box className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-wider uppercase">The Competitor</span>
                            </div>
                        </div>

                        {/* Content Switching Area */}
                        <div className="relative z-10 flex-1 w-full">
                            {/* Standard View - Absolute to prevent layout jump */}
                            <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${isHoveringCube ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                {/* Medal Grid */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                        <div className="text-xl font-bold text-yellow-500">2</div>
                                        <div className="text-[10px] uppercase text-yellow-500/70 font-medium">Gold</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-gray-300/10 border border-gray-300/20">
                                        <div className="text-xl font-bold text-gray-300">2</div>
                                        <div className="text-[10px] uppercase text-gray-300/70 font-medium">Silver</div>
                                    </div>
                                    <div className="text-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                        <div className="text-xl font-bold text-orange-500">1</div>
                                        <div className="text-[10px] uppercase text-orange-500/70 font-medium">Bronze</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-blue-400 font-bold tracking-wide uppercase">National Champion</div>
                                    <div className="text-[10px] text-gray-500 mt-1">Nigeria Championship (3rd Place)</div>
                                </div>
                            </div>

                            {/* Hover Detail View - Absolute */}
                            <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${!isHoveringCube ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                {PROFILE_DATA.speedcubing.records.map((record, index) => (
                                    <div key={record.event} className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${activeRecordIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">{record.event}</div>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <div className="text-4xl font-bold text-white max-w-full overflow-hidden text-ellipsis">{record.single}</div>
                                            <div className="text-xs text-gray-500 whitespace-nowrap">Single</div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-2">
                                            <div>
                                                <div className="text-xs text-gray-400">Average</div>
                                                <div className="text-sm font-mono text-gray-200">{record.average}</div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap">{record.rank}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Dots */}
                                <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-1.5 ">
                                    {PROFILE_DATA.speedcubing.records.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1 h-1 rounded-full transition-all duration-300 ${activeRecordIndex === i ? 'bg-blue-400 w-3' : 'bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. The Creator (YouTube) */}
                    <motion.div
                        variants={itemVariants}
                        className="col-span-1 md:col-span-1 row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-red-950/30 to-black p-6 flex flex-col justify-between hover:border-red-500/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Youtube className="w-24 h-24" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 text-red-500 mb-2">
                                <Youtube className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-wider uppercase">The Creator</span>
                            </div>
                            <h3 className="text-xl font-bold text-white leading-tight">Empowering Creators</h3>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">176K+</span>
                                <span className="text-sm text-gray-400">Views</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">J Star Films on YouTube</div>
                            <a href="https://youtube.com/@jstarfilms" target="_blank" className="mt-4 inline-flex items-center text-xs text-red-400 hover:text-red-300 transition-colors">
                                Visit Channel <ArrowUpRight className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                    </motion.div>

                    {/* 4. The Engineer (Tech/AI) - Wide Bottom Card */}
                    <motion.div
                        variants={itemVariants}
                        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 relative group rounded-3xl overflow-hidden border border-white/10 bg-gray-900 p-8 flex flex-col justify-center"
                    >
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                        <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-blue-500/10 to-transparent" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="max-w-md">
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    <Cpu className="w-4 h-4" />
                                    <span className="text-xs font-bold tracking-wider uppercase">The Engineer</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Filmmaker-Turned-Dev</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Graduated Computer Science (Aug 2024). Now building the "Creative OS"—an AI-powered ecosystem to bridge the gap between art and logic.
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">Next.js 15</span>
                                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">AI Agents</span>
                                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">Systems Architecture</span>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <Code className="w-16 h-16 text-white/5" />
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};

export default ThePolymath;
