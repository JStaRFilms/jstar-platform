
import { PrismaClient, PortfolioPlatform, PortfolioCategory } from '@prisma/client';
import { manualProjects } from '../src/content/portfolio';

export async function seed(prisma: PrismaClient) {
    console.log('🌱 Seeding Portfolio Items...');

    for (const project of manualProjects) {
        console.log(`   Processing: ${project.title}`);

        // Map legacy category to enum
        let category: PortfolioCategory = PortfolioCategory.OTHER;
        if (project.category === 'video') category = PortfolioCategory.VIDEO;
        else if (project.category === 'web') category = PortfolioCategory.WEB;
        else if (project.category === 'branding') category = PortfolioCategory.BRANDING;

        // Create or update the project
        await prisma.portfolioItem.upsert({
            where: {
                platform_externalId: {
                    platform: PortfolioPlatform.MANUAL,
                    externalId: project.id,
                },
            },
            update: {
                title: project.title,
                description: project.description,
                thumbnailUrl: project.thumbnailUrl,
                mediaUrl: project.videoUrl || project.liveUrl,
                category: category,
                tags: project.tags,
                publishedAt: new Date(project.publishedAt),
                hasDetailedCaseStudy: project.hasDetailedCaseStudy || false,
                challenge: project.challenge,
                solution: project.solution,
                results: project.results,
                liveUrl: project.liveUrl,
                displayOrder: project.order || 0,
            },
            create: {
                platform: PortfolioPlatform.MANUAL,
                externalId: project.id,
                title: project.title,
                description: project.description,
                thumbnailUrl: project.thumbnailUrl,
                mediaUrl: project.videoUrl || project.liveUrl,
                category: category,
                tags: project.tags,
                publishedAt: new Date(project.publishedAt),
                hasDetailedCaseStudy: project.hasDetailedCaseStudy || false,
                challenge: project.challenge,
                solution: project.solution,
                results: project.results,
                liveUrl: project.liveUrl,
                displayOrder: project.order || 0,
                credits: {
                    create: project.credits?.map((credit) => ({
                        name: credit.name,
                        role: credit.role,
                        linkedin: credit.linkedin,
                        website: credit.website,
                    })),
                },
            },
        });
    }

    console.log('✅ Portfolio Items seeded');
}
