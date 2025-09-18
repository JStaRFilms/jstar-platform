import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withCache, generateCacheKey, CACHE_TTL } from '@/lib/api-cache';

const prisma = new PrismaClient();

// Default configuration
const defaultConfig = {
  autoPlayEnabled: true,
  autoPlayInterval: 7000,
  showIndicators: true,
  transitionEffect: 'fade',
  transitionDuration: 700,
};

/**
 * GET /api/admin/hero-slideshow-config
 * Get the current slideshow configuration
 */
export async function GET() {
  const cacheKey = generateCacheKey('/api/admin/hero-slideshow-config');

  try {
    // Use caching with deduplication for slideshow configuration
    const result = await withCache(cacheKey, async () => {
      console.log('Fetching fresh slideshow configuration...');

      // Get the first (and only) configuration record
      const config = await prisma.heroSlideshowConfig.findFirst();

      if (!config) {
        // If no config exists, create default config
        const newConfig = await prisma.heroSlideshowConfig.create({
          data: defaultConfig,
        });
        return {
          status: 'success',
          data: newConfig,
          message: 'Default slideshow configuration created',
          cached: false
        };
      }

      return {
        status: 'success',
        data: config,
        cached: false
      };
    }, { ttl: CACHE_TTL.DIAGNOSTICS }); // 5-minute TTL for configuration data

    // Mark as cached if it came from cache
    if (result.cached !== false) {
      result.cached = true;
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching slideshow config:', error);
    return NextResponse.json(
      {
        status: 'success',
        data: defaultConfig,
        message: 'Using default configuration due to database error',
        cached: false
      },
      { status: 200 }
    );
  }
}

/**
 * PUT /api/admin/hero-slideshow-config
 * Update the slideshow configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'autoPlayEnabled',
      'autoPlayInterval',
      'showIndicators',
      'transitionEffect',
      'transitionDuration',
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined) {
        return NextResponse.json(
          {
            status: 'error',
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate transition effect
    const validEffects = ['fade', 'slide', 'zoom'];
    if (!validEffects.includes(body.transitionEffect)) {
      return NextResponse.json(
        {
          status: 'error',
          message: `Invalid transition effect. Must be one of: ${validEffects.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate timing values
    if (body.autoPlayInterval < 1000 || body.autoPlayInterval > 30000) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Auto-play interval must be between 1000ms and 30000ms',
        },
        { status: 400 }
      );
    }

    if (body.transitionDuration < 100 || body.transitionDuration > 5000) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Transition duration must be between 100ms and 5000ms',
        },
        { status: 400 }
      );
    }

    // Get existing config or create new one
    let config = await prisma.heroSlideshowConfig.findFirst();

    if (config) {
      // Update existing config
      config = await prisma.heroSlideshowConfig.update({
        where: { id: config.id },
        data: {
          ...body,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new config
      config = await prisma.heroSlideshowConfig.create({
        data: {
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      status: 'success',
      data: config,
      message: 'Slideshow configuration updated successfully',
    });
  } catch (error) {
    console.error('Error updating slideshow config:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update slideshow configuration',
      },
      { status: 500 }
    );
  }
}
