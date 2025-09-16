import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
