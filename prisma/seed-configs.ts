/**
 * Seeder: Default Configs
 * Singleton configs like diagnostics, slideshow settings, etc.
 */

import { PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
    console.log('⚙️  Seeding Default Configs...');

    // Diagnostic Config (singleton)
    await prisma.diagnosticConfig.upsert({
        where: { id: 'default-config' },
        update: {},
        create: {
            id: 'default-config',
            autoEnabled: true,
            autoInterval: 3600000, // 1 hour
            runFullSystem: true,
            runAIBenchmark: true,
            runStorageScan: true,
            runNetworkTest: false,
        },
    });

    // Hero Slideshow Config (singleton)
    await prisma.heroSlideshowConfig.upsert({
        where: { id: 'default-slideshow' },
        update: {},
        create: {
            id: 'default-slideshow',
            autoPlayEnabled: true,
            autoPlayInterval: 7000,
            showIndicators: true,
            transitionEffect: 'fade',
            transitionDuration: 700,
        },
    });

    console.log(`   ✅ Default configs seeded`);
}
