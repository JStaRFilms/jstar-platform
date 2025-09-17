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

// Note: All database operations now use Prisma instead of mock data

/**
 * GET /api/admin/hero-slides/[id]
 * Get a specific hero slide by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Hero slide not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: slide,
    });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch hero slide',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/hero-slides/[id]
 * Update a specific hero slide
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    // Check if this is a default slide
    if (id.startsWith('default-')) {
      // Find the default slide data
      const defaultSlide = defaultSlides.find(slide => slide.id === id);
      if (!defaultSlide) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Default slide not found',
          },
          { status: 404 }
        );
      }

      // Check if this default slide already exists in database
      const existingSlide = await prisma.heroSlide.findUnique({
        where: { id },
      });

      if (existingSlide) {
        // Update the existing default slide in database
        const updatedSlide = await prisma.heroSlide.update({
          where: { id },
          data: {
            ...body,
            updatedAt: new Date(),
          },
        });

        return NextResponse.json({
          status: 'success',
          data: updatedSlide,
          message: 'Default slide updated successfully',
        });
      } else {
        // Create the default slide in database for the first time
        const newSlide = await prisma.heroSlide.create({
          data: {
            ...defaultSlide,
            ...body,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return NextResponse.json({
          status: 'success',
          data: newSlide,
          message: 'Default slide saved to database successfully',
        });
      }
    }

    // Update existing custom slide
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      status: 'success',
      data: slide,
      message: 'Hero slide updated successfully',
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Hero slide not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update hero slide',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/hero-slides/[id]
 * Delete a specific hero slide (soft delete by setting isActive to false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Allow deletion of any slide (including defaults) - validation happens on frontend

    // Soft delete by setting isActive to false
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Hero slide deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Hero slide not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete hero slide',
      },
      { status: 500 }
    );
  }
}
