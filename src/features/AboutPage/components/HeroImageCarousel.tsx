'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

interface HeroImageCarouselProps {
    mode: 'tech' | 'creator';
    images: {
        tech: string[];
        creator: string[];
    };
}

export const HeroImageCarousel = ({ mode, images }: HeroImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset index when mode changes to ensure we start fresh
    useEffect(() => {
        setCurrentIndex(0);
    }, [mode]);

    // Auto-cycle images
    useEffect(() => {
        const activeImages = images[mode];
        if (activeImages.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeImages.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [mode, images]);

    const activeImages = images[mode];
    const currentImage = activeImages[currentIndex] || activeImages[0];

    return (
        <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${mode}-${currentIndex}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    {/* We use a standard img tag here if it's dynamic user content where width/height aren't known, 
              or Next/Image with fill. Next/Image with fill is better for optimization. 
              The parent needs 'relative' and defined dimensions. */}
                    <div className="relative w-full h-full">
                        <Image
                            src={currentImage}
                            alt={`${mode} mode portrait`}
                            fill
                            className="object-cover object-top"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Gradient Overlay for Text Readability/Blending */}
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Optional: Carousel Indicators (Little dots) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {activeImages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                            ? 'bg-white w-4'
                            : 'bg-white/30 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
