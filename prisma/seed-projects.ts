import { PrismaClient, ProjectStatus } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
    console.log('🌱 Seeding Projects...');

    // 1. Get a user to attach projects to (try to find one, or usually the 'me' user)
    // We'll just grab the first user found or a specific admin if needed.
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log('   ⚠️ No users found. Skipping project seeding.');
        return;
    }

    console.log(`   👤 Seeding projects for user: ${user.email} (${user.id})`);

    // 2. Define sample projects
    const projects = [
        {
            title: 'Neon Genesis Pitch Deck',
            description: 'A cyberpunk-themed extensive pitch for the new series.',
            status: ProjectStatus.DRAFTING,
            chapters: [
                { title: 'The World', isCompleted: true },
                { title: 'Character Profiles', isCompleted: true },
                { title: 'Episode 1 Breakdown', isCompleted: false },
                { title: 'Marketing Strategy', isCompleted: false },
            ]
        },
        {
            title: 'AI Ethics Manifesto',
            description: 'Exploring the boundaries of generative AI in creative workflows.',
            status: ProjectStatus.IDEA,
            chapters: [
                { title: 'Abstract', isCompleted: false },
                { title: 'Core Principles', isCompleted: false },
            ]
        },
        {
            title: 'J-Star Brand Guidelines',
            description: 'Official typography, color palette, and voice guidelines.',
            status: ProjectStatus.PUBLISHED,
            chapters: [
                { title: 'Logo Usage', isCompleted: true },
                { title: 'Typography', isCompleted: true },
                { title: 'Color System', isCompleted: true },
                { title: 'Tone of Voice', isCompleted: true },
                { title: 'Assets', isCompleted: true },
            ]
        },
        {
            title: 'Secret Project X',
            description: 'Confidential client work.',
            status: ProjectStatus.POLISHING,
            chapters: [
                { title: 'Initial Brief', isCompleted: true },
                { title: 'Draft v1', isCompleted: true },
                { title: 'Client Feedback', isCompleted: true },
                { title: 'Final Polish', isCompleted: false },
            ]
        }
    ];

    // 3. Upsert projects
    for (const p of projects) {
        // We assume title + userId is unique enough for seeding check, 
        // or we just creation strict.
        // Let's check if it exists first to avoid duplicates or use upsert if ID was fixed.
        // Since we don't have fixed IDs, we'll check by title.

        const existing = await prisma.project.findFirst({
            where: {
                userId: user.id,
                title: p.title
            }
        });

        if (!existing) {
            await prisma.project.create({
                data: {
                    title: p.title,
                    description: p.description,
                    status: p.status,
                    userId: user.id,
                    chapters: {
                        create: p.chapters.map((c, idx) => ({
                            title: c.title,
                            isCompleted: c.isCompleted,
                            order: idx,
                            content: [] // Empty content for now
                        }))
                    }
                }
            });
            console.log(`   ✅ Created project: ${p.title}`);
        } else {
            console.log(`   ⏭️  Project already exists: ${p.title}`);
        }
    }

    console.log('   ✨ Projects seeded successfully.');
}
