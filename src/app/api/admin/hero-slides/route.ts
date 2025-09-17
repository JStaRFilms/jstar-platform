import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default slides data
const defaultSlides = [
  {
    id: 'default-1',
    titleLine1: 'Elevate Your Story',
    titleLine2: 'With Purpose & Excellence',
    tagline: 'Creative Vision, Technical Excellence',
    description: 'Transform your ideas into compelling visual stories that resonate with audiences and reflect your values.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    gradient: 'from-blue-500 to-purple-600',
    buttonGradient: 'from-blue-500 to-purple-600',
    buttonBorder: 'border-blue-500',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-blue-600',
    isActive: true,
    sortOrder: 1,
    altText: 'Video Production',
    projectTitle: 'Latest Project',
    projectDesc: 'Brand Storytelling for Tech Startup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-2',
    titleLine1: 'Where Faith Meets',
    titleLine2: 'Creative Excellence',
    tagline: 'Faith-based filmmaking',
    description: 'Creating impactful content that inspires and connects communities through authentic storytelling.',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    gradient: 'from-purple-500 to-pink-600',
    buttonGradient: 'from-purple-500 to-pink-600',
    buttonBorder: 'border-purple-500',
    buttonText: 'text-white',
    buttonHover: 'hover:bg-purple-600',
    isActive: true,
    sortOrder: 2,
    altText: 'Faith-based Content Creation',
    projectTitle: 'Community Project',
    projectDesc: 'Documentary series for local church',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * GET /api/admin/hero-slides
 * Get all active hero slides ordered by sort order
 * Always returns custom slides + default slides for consistency
 */
export async function GET() {
  try {
    const customSlides = await prisma.heroSlide.findMany({
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

    // Always return custom slides + default slides for consistency
    // This ensures the admin UI always shows all available slides
    const allSlides = [...customSlides, ...defaultSlides];

    // Sort by sortOrder to maintain proper order
    allSlides.sort((a, b) => a.sortOrder - b.sortOrder);

    return NextResponse.json({
      status: 'success',
      data: allSlides,
      message: customSlides.length > 0
        ? `Showing ${customSlides.length} custom slides and ${defaultSlides.length} default slides.`
        : `Showing ${defaultSlides.length} default slides. Create custom slides to add more content.`,
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    // Return default slides on error
    return NextResponse.json({
      status: 'success',
      data: defaultSlides,
      message: 'Showing default slides due to database error.',
    });
  }
}

/**
 * POST /api/admin/hero-slides
 * Create a new hero slide
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a reset to defaults request
    if (body.action === 'reset-to-defaults') {
      // Delete all existing slides
      await prisma.heroSlide.deleteMany({});

      // Create default slides in database
      const createdSlides = await prisma.heroSlide.createMany({
        data: defaultSlides.map((slide, index) => ({
          ...slide,
          sortOrder: index + 1,
        })),
      });

      return NextResponse.json(
        {
          status: 'success',
          data: defaultSlides,
          message: 'Successfully reset to default slides',
        },
        { status: 200 }
      );
    }

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
