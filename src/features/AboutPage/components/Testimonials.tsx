'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';
import { PROFILE_DATA } from '../data/portfolio';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation<HTMLDivElement>({ triggerOnce: true });
    const { refs: cardRefs, visibilityStates: cardVisibility } = useScrollAnimationMulti<HTMLDivElement>({
        count: PROFILE_DATA.testimonials.length,
        staggerDelay: 150,
    });

    return (
        <section className="py-24 bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div
                    ref={headerRef}
                    className={`text-center mb-16 scroll-animate-hidden ${isHeaderVisible ? 'scroll-animate-fade-in-up' : ''}`}
                >
                    <span className="block text-jstar-blue text-sm font-medium tracking-wider uppercase mb-3">Client Love</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Trusted by Creators</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {PROFILE_DATA.testimonials.map((testi, index) => (
                        <div
                            key={index}
                            ref={cardRefs[index]}
                            className={`bg-black/40 border border-white/5 p-8 rounded-3xl relative hover:border-white/10 transition-colors scroll-animate-hidden ${cardVisibility[index] ? 'scroll-animate-fade-in-up' : ''}`}
                        >
                            <Quote className="w-10 h-10 text-white/10 absolute top-8 right-8" />

                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed mb-8 relative z-10">
                                "{testi.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={testi.image}
                                    alt={testi.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                                />
                                <div>
                                    <h4 className="text-white font-bold">{testi.name}</h4>
                                    <span className="text-sm text-jstar-blue">{testi.channel}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
