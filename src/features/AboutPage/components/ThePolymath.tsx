'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { PROFILE_DATA } from '../data/portfolio';
import { Music, Box, Youtube, Code, Cpu, Trophy, ArrowUpRight, Layout, Zap, Shield, Touchpad, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const InteractionPrompt = ({ isVisible }: { isVisible: boolean }) => (
    <div className={`absolute bottom-6 right-6 z-20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-pulse">
            <MousePointer2 className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Click to Explore</span>
        </div>
    </div>
);

const ThePolymath = () => {
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });

    // Speedcubing Card State
    const [isCubeActive, setIsCubeActive] = useState(false);
    const [activeRecordIndex, setActiveRecordIndex] = useState(0);

    // Engineer Card State
    const [isEngineerActive, setIsEngineerActive] = useState(false);
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);

    // Musician Card State
    const [isMusicianActive, setIsMusicianActive] = useState(false);
    const [activeMusicianIndex, setActiveMusicianIndex] = useState(0);

    const ENGINEER_PROJECTS = [
        {
            name: "MindGuard AI",
            tech: "Electron + ONNX",
            desc: "Privacy-first desktop app for mental wellness tracking with local AI.",
            icon: Shield,
            href: "https://github.com/JStaRFilms/MindGuard-Al"
        },
        {
            name: "Blink",
            tech: "Python + Automation",
            desc: "Instant desktop AI query tool. Ditch the copy-paste vibe.",
            icon: Zap,
            href: "https://github.com/JStaRFilms/Blink"
        },
        {
            name: "Adaptive Study Game",
            tech: "TypeScript + Gemini",
            desc: "Intelligent study tool transforming notes into gamified quizzes.",
            icon: Cpu,
            href: "https://github.com/JStaRFilms/adaptive-study-game"
        }
    ];

    const MUSICIAN_IMAGES = [
        "/me/sax.jpg",
        // "/me/me.jpg",
        // "/me/me2.jpg"
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCubeActive) {
            interval = setInterval(() => {
                setActiveRecordIndex((prev) => (prev + 1) % PROFILE_DATA.speedcubing.records.length);
            }, 2000);
        } else {
            setActiveRecordIndex(0);
        }
        return () => clearInterval(interval);
    }, [isCubeActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isEngineerActive) {
            interval = setInterval(() => {
                setActiveProjectIndex((prev) => (prev + 1) % ENGINEER_PROJECTS.length);
            }, 2500);
        } else {
            setActiveProjectIndex(0);
        }
        return () => clearInterval(interval);
    }, [isEngineerActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isMusicianActive) {
            interval = setInterval(() => {
                setActiveMusicianIndex((prev) => (prev + 1) % MUSICIAN_IMAGES.length);
            }, 2000);
        } else {
            setActiveMusicianIndex(0);
        }
        return () => clearInterval(interval);
    }, [isMusicianActive]);

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
                        className={`col-span-1 md:col-span-2 row-span-2 relative group rounded-3xl overflow-hidden border bg-gray-900 transition-all duration-300 cursor-pointer ${isMusicianActive ? 'border-yellow-500/40 shadow-lg shadow-yellow-500/5' : 'border-white/10 hover:border-yellow-500/20'}`}
                        onClick={() => setIsMusicianActive(!isMusicianActive)}
                    >
                        {/* Visual Hint */}
                        <InteractionPrompt isVisible={!isMusicianActive} />
                        {/* Image Carousel */}
                        <div className="absolute inset-0 bg-gray-900">
                            {MUSICIAN_IMAGES.map((src, index) => (
                                <div
                                    key={src}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeMusicianIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                >
                                    <Image
                                        src={src}
                                        alt="Musician"
                                        fill
                                        className="object-cover transition-transform duration-[3000ms] group-hover:scale-110 opacity-60 group-hover:opacity-50"
                                        priority={index === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Playlist Link - Top Right */}
                        <a
                            href="https://youtube.com/playlist?list=PLLZaBSTTqBJ8ANM5cvrV9fGB_cQmWK1wc&si=WFDOy7b9jZxqNWXK"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-6 right-6 z-40 inline-flex items-center gap-2 text-xs font-bold text-white/90 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-red-600/20 hover:border-red-500/50 hover:text-white px-4 py-2 rounded-full transition-all duration-300 group-hover:scale-105"
                        >
                            <Youtube className="w-3 h-3 text-red-500" />
                            <span>Watch Covers</span>
                            <ArrowUpRight className="w-3 h-3 text-white/50" />
                        </a>

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-20" />

                        <div className="absolute bottom-0 left-0 p-8 w-full z-30">
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
                        className={`col-span-1 md:col-span-1 row-span-1 relative group rounded-3xl overflow-hidden border bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col transition-all duration-300 cursor-pointer ${isCubeActive ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-white/10 hover:border-blue-500/20'}`}
                        onClick={() => setIsCubeActive(!isCubeActive)}
                    >
                        {/* Visual Hint */}
                        <InteractionPrompt isVisible={!isCubeActive} />

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
                            <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${isCubeActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
                            <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${!isCubeActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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

                    {/* 4. The Engineer (Tech/AI - Interactive) */}
                    <motion.div
                        variants={itemVariants}
                        className={`col-span-1 md:col-span-2 lg:col-span-2 row-span-1 relative group rounded-3xl overflow-hidden border bg-gray-900 p-8 flex flex-col justify-center transition-all duration-300 cursor-pointer ${isEngineerActive ? 'border-purple-500/40 shadow-lg shadow-purple-500/5' : 'border-white/10 hover:border-purple-500/20'}`}
                        onClick={() => setIsEngineerActive(!isEngineerActive)}
                    >
                        {/* Visual Hint */}
                        <InteractionPrompt isVisible={!isEngineerActive} />

                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                        <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-blue-500/10 to-transparent" />

                        <div className="relative z-10 w-full h-full flex flex-col justify-center">
                            {/* Static Header */}
                            <div className="absolute top-0 left-0">
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    <Cpu className="w-4 h-4" />
                                    <span className="text-xs font-bold tracking-wider uppercase">The Engineer</span>
                                </div>
                            </div>

                            {/* Content Switching Area */}
                            <div className="relative w-full h-[100px] mt-8">
                                {/* Standard View */}
                                <div className={`absolute inset-0 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-opacity duration-300 ${isEngineerActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                    <div className="max-w-md">
                                        <h3 className="text-2xl font-bold text-white mb-2">Filmmaker-Turned-Dev</h3>
                                        <p className="text-gray-400 text-sm mb-4">
                                            Graduated Computer Science (Aug 2024). Now building the "Creative OS"—an AI-powered ecosystem to bridge the gap between art and logic.
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">Next.js 15</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">AI Agents</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <Code className="w-16 h-16 text-white/5" />
                                    </div>
                                </div>

                                {/* Hover Project View */}
                                <div className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-300 ${!isEngineerActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                    {ENGINEER_PROJECTS.map((project, index) => (
                                        <div key={project.name} className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${activeProjectIndex === index ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                                                    <project.icon className="w-5 h-5" />
                                                </div>
                                                <a
                                                    href={project.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group/link flex items-center gap-2 text-2xl font-bold text-white hover:text-purple-300 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {project.name}
                                                    <ArrowUpRight className="w-5 h-5 opacity-50 group-hover/link:opacity-100 transition-opacity -translate-y-1 translate-x-1" />
                                                </a>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3 max-w-lg">
                                                {project.desc}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded border border-purple-500/20">
                                                    {project.tech}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination Dots */}
                                    <div className="absolute -bottom-6 left-0 flex gap-1.5">
                                        {ENGINEER_PROJECTS.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1 h-1 rounded-full transition-all duration-300 ${activeProjectIndex === i ? 'bg-purple-400 w-4' : 'bg-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};

export default ThePolymath;
