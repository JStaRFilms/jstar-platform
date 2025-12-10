'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { PROFILE_DATA } from '../data/portfolio';
import { CheckCircle2, TrendingUp, Users } from 'lucide-react';

const SocialProof = () => {
    const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true, delay: 500 });

    return (
        <div ref={ref} className={`w-full py-6 border-y border-white/5 bg-white/5 backdrop-blur-sm scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in' : ''}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-6">
                {/* Stat 1 */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-full text-blue-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-xl font-bold text-white leading-none">{PROFILE_DATA.stats.views}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Views Generated</span>
                    </div>
                </div>

                <div className="w-px h-8 bg-white/10 hidden sm:block" />

                {/* Stat 2 */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-full text-purple-400">
                        <Video className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-xl font-bold text-white leading-none">{PROFILE_DATA.stats.videos}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Videos Edited</span>
                    </div>
                </div>

                <div className="w-px h-8 bg-white/10 hidden sm:block" />

                {/* Stat 3 */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-full text-green-400">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-xl font-bold text-white leading-none">8+</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Verified Clients</span>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-gray-300 font-medium">Recommended Talent</span>
                </div>
            </div>
        </div>
    );
};

import { Video } from 'lucide-react';
export default SocialProof;
