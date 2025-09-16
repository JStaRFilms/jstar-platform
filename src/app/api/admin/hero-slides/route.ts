import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Note: All database operations now use Prisma instead of mock data

/**
 * GET /api/admin/hero-slides
 * Get all active hero slides ordered by sort order
 */
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        titleLine1: true,
        titleLine2: true,
        tagline: true,
        description: true,
        imageUrl: true,
        gradient: true,
        buttonGradient: true,
        buttonBorder: true,
        buttonText: true,
        buttonHover: true,
        altText: true,
        projectTitle: true,
        projectDesc: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      data: slides,
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch hero slides',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/hero-slides
 * Create a new hero slide
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'titleLine1',
      'titleLine2',
      'tagline',
      'description',
      'imageUrl',
      'gradient',
      'buttonGradient',
      'buttonBorder',
      'buttonText',
      'buttonHover',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            status: 'error',
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Get the highest sort order to place new slide at the end
    const maxSortOrder = await prisma.heroSlide.findFirst({
      select: { sortOrder: true },
      orderBy: { sortOrder: 'desc' },
    });

    const newSortOrder = (maxSortOrder?.sortOrder || 0) + 1;

    const slide = await prisma.heroSlide.create({
      data: {
        ...body,
        sortOrder: newSortOrder,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        data: slide,
        message: 'Hero slide created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create hero slide',
      },
      { status: 500 }
    );
  }
}
