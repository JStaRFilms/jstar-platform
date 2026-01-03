'use client';

import React from 'react';
import Image from 'next/image';
import { PortfolioItem, PortfolioPlatform } from '@prisma/client';
import { TikTokEmbed } from '@/components/embeds/TikTokEmbed';
// Note: We'll import InstagramEmbed and other specific components dynamically or here if used in detail
// For grid view, we typically want a lightweight preview (thumbnails) rather than heavy iframes
// But if the card expands or is meant to show the content directly, we can use the embeds.
// For now, let's assume the card shows a thumbnail and clicking opens a modal/detail view.

interface UniversalPortfolioCardProps {
    item: PortfolioItem;
    onClick: () => void;
    className?: string;
}

const PlatformBadge = ({ platform }: { platform: PortfolioPlatform }) => {
    const colors = {
        YOUTUBE: 'bg-red-600 text-white',
        TIKTOK: 'bg-black text-white dark:bg-gray-800',
        INSTAGRAM: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white',
        MANUAL: 'bg-blue-600 text-white',
    };

    const icons = {
        YOUTUBE: 'YouTube',
        TIKTOK: 'TikTok',
        INSTAGRAM: 'Instagram',
        MANUAL: 'Project',
    };

    return (
        <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full z-10 ${colors[platform]}`}>
            {icons[platform]}
        </span>
    );
};

export const UniversalPortfolioCard = ({ item, onClick, className }: UniversalPortfolioCardProps) => {
    // If we have an override thumbnail, use it. Otherwise use generic placeholders if missing.
    const thumbnail = item.thumbnailUrl || '/placeholder-portfolio.jpg';

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl ${className}`}
            onClick={onClick}
        >
            <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <PlatformBadge platform={item.platform} />

                {item.thumbnailUrl ? (
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {/* Fallback for no thumbnail */}
                        <span className="text-4xl text-gray-300 dark:text-gray-600">
                            {/* Could add a generic icon based on platform here */}
                            🖼️
                        </span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-white text-sm font-medium mb-1 truncate">
                        {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">
                        {item.title}
                    </h3>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col bg-white dark:bg-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {item.aiSummary || item.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {item.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
