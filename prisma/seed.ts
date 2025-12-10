/**
 * Unified Seed Script - Auto-Discovery Mode
 * 
 * This script automatically finds and runs all `seed-*.ts` files in the prisma folder.
 * Each seeder must export a `seed(prisma: PrismaClient)` function.
 * 
 * Run with: npx prisma db seed
 * Or:       npm run db:seed
 * 
 * To add a new seeder:
 * 1. Create `prisma/seed-YOUR_NAME.ts`
 * 2. Export: `export async function seed(prisma: PrismaClient) { ... }`
 * 3. Run `npm run db:seed` - it will be auto-discovered!
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL,
        },
    },
});

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('🌱 Starting database seed (auto-discovery mode)...');
    console.log('========================================\n');

    const prismaDir = __dirname;
    const files = fs.readdirSync(prismaDir);

    // Find all seed-*.ts files (excluding this file)
    const seedFiles = files.filter(f =>
        f.startsWith('seed-') &&
        (f.endsWith('.ts') || f.endsWith('.js')) &&
        f !== 'seed.ts'
    );

    if (seedFiles.length === 0) {
        console.log('⚠️  No seed-*.ts files found in prisma/');
        return;
    }

    console.log(`📦 Found ${seedFiles.length} seeders: ${seedFiles.join(', ')}\n`);

    // Run each seeder
    for (const file of seedFiles) {
        const modulePath = path.join(prismaDir, file);
        try {
            // Dynamic import - use file:// URL for Windows ESM compatibility
            const moduleUrl = 'file://' + modulePath.replace(/\\/g, '/');
            const seeder = await import(moduleUrl);

            if (typeof seeder.seed === 'function') {
                await seeder.seed(prisma);
            } else {
                console.log(`⚠️  ${file} does not export a seed() function, skipping...`);
            }
        } catch (error) {
            console.error(`❌ Error running ${file}:`, error);
            throw error;
        }
    }

    // Summary
    console.log('\n========================================');
    console.log('🎉 All seeders complete!');

    // Quick stats
    const stats = await Promise.all([
        prisma.persona.count().catch(() => 0),
        prisma.aIProvider.count().catch(() => 0),
        prisma.aIModel.count().catch(() => 0),
    ]);

    console.log(`   Personas:  ${stats[0]}`);
    console.log(`   Providers: ${stats[1]}`);
    console.log(`   Models:    ${stats[2]}`);
    console.log('========================================\n');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
