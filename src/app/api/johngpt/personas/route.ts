import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// Auth can be added here if needed for personas endpoint

export const runtime = 'nodejs';

export async function GET() {
    try {
        // Optional: Check auth if you want to restrict access
        // const { user } = await withAuth();

        const personas = await prisma.persona.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });

        return NextResponse.json(personas);
    } catch (error) {
        console.error('Error fetching personas:', error);
        return NextResponse.json(
            { error: 'Failed to fetch personas' },
            { status: 500 }
        );
    }
}
