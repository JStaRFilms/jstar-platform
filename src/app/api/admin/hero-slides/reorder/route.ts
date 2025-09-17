import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * PUT /api/admin/hero-slides/reorder
 * Reorders hero slides by updating their sortOrder
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slides } = body;

    if (!slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { status: 'error', message: 'Slides array is required' },
        { status: 400 }
      );
    }

    // Validate slide data
    for (const slide of slides) {
      if (!slide.id || typeof slide.sortOrder !== 'number') {
        return NextResponse.json(
          { status: 'error', message: 'Each slide must have id and sortOrder' },
          { status: 400 }
        );
      }
    }

    // Update sortOrder for each slide
    const updatePromises = slides.map(slide =>
      prisma.heroSlide.update({
        where: { id: slide.id },
        data: { sortOrder: slide.sortOrder },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      status: 'success',
      message: 'Slides reordered successfully',
      data: slides
    });

  } catch (error) {
    console.error('Error reordering slides:', error);

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { status: 'error', message: 'One or more slides not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { status: 'error', message: 'Failed to reorder slides' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
