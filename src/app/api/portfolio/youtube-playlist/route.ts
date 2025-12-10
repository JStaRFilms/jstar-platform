import { NextRequest, NextResponse } from 'next/server';
import { PortfolioProject, youtubeOverrides } from '@/content/portfolio';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PLkFqsWpoD-J5VcXgVfyfp-uFPKtKpSMzw';

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
      maxres?: { url: string };
    };
    publishedAt: string;
    resourceId: {
      videoId: string;
    };
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount: string;
  };
}

function parseDuration(duration: string | undefined): string {
  // Handle undefined duration
  if (!duration) return '0:00';

  // Parse ISO 8601 duration (PT4M13S) to readable format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return duration;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function transformYouTubeVideo(item: YouTubeVideoItem): PortfolioProject {
  const videoId = item.snippet.resourceId.videoId;
  const thumbnailUrl = item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url;

  // Base YouTube data
  const baseProject: PortfolioProject = {
    id: videoId,
    title: item.snippet.title,
    description: item.snippet.description.length > 200
      ? item.snippet.description.substring(0, 200) + '...'
      : item.snippet.description,
    thumbnailUrl,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`, // Keep for external links
    videoId: videoId, // Clean video ID for embed use
    source: 'youtube',
    tags: ['Video Production', 'YouTube'],
    category: 'video',
    publishedAt: item.snippet.publishedAt,
    duration: parseDuration(item.contentDetails?.duration),
    views: item.statistics ? parseInt(item.statistics.viewCount) : undefined,
    showViews: true // Default to showing views
  };

  // Check for overrides and merge them
  const overrides = youtubeOverrides[videoId];
  if (overrides) {
    return {
      ...baseProject,
      ...overrides,
      // Override title and description if specified
      title: overrides.customTitle || baseProject.title,
      description: overrides.customDescription || baseProject.description,
      // Preserve YouTube metadata unless overridden
      publishedAt: overrides.publishedAt || baseProject.publishedAt,
      duration: overrides.duration || baseProject.duration,
      views: overrides.views !== undefined ? overrides.views : baseProject.views,
      thumbnailUrl: overrides.customThumbnailUrl || overrides.thumbnailUrl || baseProject.thumbnailUrl,
      videoUrl: overrides.videoUrl || baseProject.videoUrl
    };
  }

  return baseProject;
}

export async function GET(_request: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error('YOUTUBE_API_KEY not configured');
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    // Fetch playlist items
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${PLAYLIST_ID}&maxResults=10&key=${YOUTUBE_API_KEY}`,
      {
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!playlistResponse.ok) {
      throw new Error(`YouTube API error: ${playlistResponse.status}`);
    }

    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    // Get video statistics for view counts
    const videoIds = playlistData.items.map((item: YouTubeVideoItem) => item.snippet.resourceId.videoId);
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`,
      {
        next: { revalidate: 3600 }
      }
    );

    const statsData = statsResponse.ok ? await statsResponse.json() : null;

    // Combine playlist data with statistics
    const projects: PortfolioProject[] = playlistData.items.map((item: YouTubeVideoItem) => {
      // Find corresponding statistics
      const stats = statsData?.items?.find((stat: any) => stat.id === item.snippet.resourceId.videoId);
      if (stats) {
        item.statistics = stats.statistics;
      }

      return transformYouTubeVideo(item);
    });

    // Keep playlist order (as defined in YouTube)
    // Comment out the line below if you want published date sorting instead
    // projects.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json({ projects });

  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch YouTube playlist' },
      { status: 500 }
    );
  }
}
