
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PortfolioPlatform, PortfolioCategory } from '@prisma/client';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const platformParam = searchParams.get('platform');
    const showHidden = searchParams.get('showHidden') === 'true';

    try {
        const where: any = {
            isPrimaryVersion: true, // Only return primary versions (de-duplicated)
        };

        // Filter by visibility unless requested (admin use case)
        if (!showHidden) {
            where.isVisible = true;
        }

        // Filter by category
        if (categoryParam && categoryParam !== 'all') {
            // Map frontend category strings to Enum
            // Frontend often uses lowercase: 'video', 'web', 'branding'
            const categoryMap: Record<string, PortfolioCategory> = {
                'video': PortfolioCategory.VIDEO,
                'web': PortfolioCategory.WEB,
                'branding': PortfolioCategory.BRANDING,
                'other': PortfolioCategory.OTHER
            };

            const mappedCategory = categoryMap[categoryParam.toLowerCase()];
            if (mappedCategory) {
                where.category = mappedCategory;
            }
        }

        // Filter by platform
        if (platformParam) {
            const platformMap: Record<string, PortfolioPlatform> = {
                'youtube': PortfolioPlatform.YOUTUBE,
                'tiktok': PortfolioPlatform.TIKTOK,
                'instagram': PortfolioPlatform.INSTAGRAM,
                'manual': PortfolioPlatform.MANUAL
            };
            const mappedPlatform = platformMap[platformParam.toLowerCase()];
            if (mappedPlatform) {
                where.platform = mappedPlatform;
            }
        }

        // Fetch items
        const portfolioItems = await prisma.portfolioItem.findMany({
            where,
            include: {
                credits: true,
            },
            orderBy: [
                { isPinned: 'desc' },
                { displayOrder: 'asc' }, // Manual order
                { publishedAt: 'desc' }, // Then by date
            ]
        });

        // Transform for frontend if needed, or return directly
        // The frontend currently expects `PortfolioProject` interface.
        // We should map Prisma objects to that interface to prevent breaking changes in `PortfolioGrid`.

        const mappedProjects = portfolioItems.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            thumbnailUrl: item.thumbnailUrl || '',
            videoUrl: (item.mediaUrl && item.mediaUrl !== item.liveUrl) ? item.mediaUrl : '',
            videoId: item.externalId || '', // For embeds
            liveUrl: item.liveUrl,
            source: item.platform.toLowerCase(), // 'manual', 'youtube', 'tiktok', 'instagram'
            order: item.displayOrder,
            tags: item.tags,
            category: item.category.toLowerCase(), // 'video', 'web', 'branding'
            publishedAt: item.publishedAt?.toISOString() || new Date().toISOString(),

            // Extended fields
            aiSummary: item.aiSummary,
            hasDetailedCaseStudy: item.hasDetailedCaseStudy,
            platform: item.platform, // New field for components that know about it

            // Case study details
            challenge: item.challenge,
            solution: item.solution,
            results: item.results,
            credits: item.credits,
        }));

        return NextResponse.json({ projects: mappedProjects });

    } catch (error) {
        console.error('Error fetching portfolio items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio items' },
            { status: 500 }
        );
    }
}
