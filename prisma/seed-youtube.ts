
import { PrismaClient, PortfolioPlatform, PortfolioCategory } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
    console.log('📺 Seeding YouTube Portfolio Items...');

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const PLAYLIST_ID = 'PLkFqsWpoD-J5VcXgVfyfp-uFPKtKpSMzw'; // Hardcoded from existing code

    if (!YOUTUBE_API_KEY) {
        console.error('❌ Skipping YouTube seed: YOUTUBE_API_KEY not found in env');
        return;
    }

    try {
        // 1. Fetch Playlist Items
        console.log(`   Fetching playlist ${PLAYLIST_ID}...`);
        const playlistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${PLAYLIST_ID}&maxResults=50&key=${YOUTUBE_API_KEY}`
        );

        if (!playlistResponse.ok) {
            throw new Error(`YouTube API Error: ${playlistResponse.statusText}`);
        }

        const playlistData = await playlistResponse.json();
        const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');

        // 2. Fetch Video Statistics (for views/tags) and Content Details
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );
        const videosData = await videosResponse.json();

        console.log(`   Found ${videosData.items.length} videos. Syncing to DB...`);

        for (const video of videosData.items) {
            const { id, snippet, statistics } = video;

            // Basic fields
            const title = snippet.title;
            const description = snippet.description;
            const thumbnailUrl = snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url;
            const publishedAt = new Date(snippet.publishedAt);

            // Determine Platform & Category
            // (Assuming all checked playlist items are portfolio worthy videos)

            await prisma.portfolioItem.upsert({
                where: {
                    platform_externalId: {
                        platform: PortfolioPlatform.YOUTUBE,
                        externalId: id
                    }
                },
                update: {
                    title,
                    description,
                    thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
                    publishedAt: new Date(snippet.publishedAt),
                    mediaUrl: `https://www.youtube.com/watch?v=${id}`,
                    embedHtml: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
                    views: statistics?.viewCount ? parseInt(statistics.viewCount) : 0,
                    likes: statistics?.likeCount ? parseInt(statistics.likeCount) : 0,
                    duration: video.contentDetails?.duration || null,
                },
                create: {
                    platform: PortfolioPlatform.YOUTUBE,
                    externalId: id,
                    title: snippet.title,
                    description: snippet.description,
                    thumbnailUrl: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
                    publishedAt: new Date(snippet.publishedAt),
                    category: PortfolioCategory.VIDEO,
                    tags: snippet.tags || [],
                    mediaUrl: `https://www.youtube.com/watch?v=${id}`,
                    embedHtml: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
                    views: statistics?.viewCount ? parseInt(statistics.viewCount) : 0,
                    likes: statistics?.likeCount ? parseInt(statistics.likeCount) : 0,
                    duration: video.contentDetails?.duration || null,
                }
            });
        }

        console.log('✅ YouTube items synced to database');

    } catch (error) {
        console.error('❌ Error seeding YouTube items:', error);
    }
}
