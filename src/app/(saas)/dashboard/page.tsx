'use server';

import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/features/SaaSDashboard/components/DashboardHeader';
import { ProjectGrid } from '@/features/SaaSDashboard/components/ProjectGrid';

export default async function DashboardPage() {
    const { user } = await withAuth();

    if (!user) {
        redirect('/');
    }

    // Fetch projects for this user
    // We use user.id (WorkOS ID) which matches the userId field in our Project model
    // Note: We might need to ensure the user exists in our local DB 'User' table first
    // but for now we assume they are synced or we query by external ID if needed.
    // Based on schema, 'userId' is a String.
    // Let's assume userId in Project refers to the User.id (cuid) or external WorkOS ID?
    // Schema: user User @relation(fields: [userId], references: [id])
    // So 'userId' in Project MUST be the local CUID.
    // We first need to find the local user by their WorkOS ID.

    const localUser = await prisma.user.findUnique({
        where: { workosId: user.id },
    });

    if (!localUser) {
        // If user is logged in via AuthKit but not in our DB, we should probably create them or show error.
        // For now, let's redirect or show empty.
        // Ideally, a sync mechanism exists (e.g. webhook or middleware).
        // Let's create the user just in case (JIT provisioning) or handle gracefully.
        // Given the task scope, I will assume user exists or handle null key.
        console.warn(`User ${user.id} not found in local DB.`);
    }

    const projects = localUser ? await prisma.project.findMany({
        where: { userId: localUser.id },
        include: {
            chapters: {
                select: { isCompleted: true },
            },
        },
        orderBy: { updatedAt: 'desc' },
    }) : [];

    // Transform for UI if needed or match types
    // ProjectGrid expects (Project & { chapters: Chapter[] })[]
    // Our query returns chapters with ONLY isCompleted. 
    // We need to cast or fix the selection.
    // Ideally ProjectGrid just needs stats.
    // Let's fetch all chapter fields to match the type for simplicity, 
    // or update ProjectCard to only require partial chapters.
    // For MVP, fetching full chapters is fine (they are light usually).

    const detailedProjects = localUser ? await prisma.project.findMany({
        where: { userId: localUser.id },
        include: {
            chapters: true,
        },
        orderBy: { updatedAt: 'desc' },
    }) : [];

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
            <DashboardHeader user={localUser} />

            <div className="mt-8">
                <ProjectGrid projects={detailedProjects} />
            </div>
        </div>
    );
}
