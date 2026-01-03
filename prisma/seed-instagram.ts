import { PrismaClient, PortfolioPlatform, PortfolioCategory } from '@prisma/client';
import fs from 'fs';
import path from 'path';

export async function seed(prisma: PrismaClient) {
    console.log('🌱 Seeding Instagram Content...');

    const linksFilePath = path.join(process.cwd(), '.jstar', 'links.txt');

    if (!fs.existsSync(linksFilePath)) {
        console.warn('⚠️ .jstar/links.txt not found. Skipping Instagram seed.');
        return;
    }

    const htmlContent = fs.readFileSync(linksFilePath, 'utf-8');

    // Regex to match Instagram Reel/Post links and their inner images
    // Matches: <a ... href="/username/reel/ID/" ...><div...><img ... alt="DESC" ... src="URL"
    // Note: This regex is crafted based on the provided minified HTML structure.
    // We look for the anchor tag with the reel/post href, then find the image inside it.

    // This more robust pattern captures the essential parts even if attributes shift slightly
    const itemRegex = /<a[^>]*href="\/[^"]+\/(?:reel|p)\/([^"\/]+)\/"[^>]*>.*?<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"/g;

    let match;
    let count = 0;

    while ((match = itemRegex.exec(htmlContent)) !== null) {
        const [_, id, rawAlt, src] = match;
        const cleanId = id.trim();
        const cleanSrc = src.replace(/&amp;/g, '&'); // Fix HTML entities in URL
        const cleanAlt = rawAlt.replace(/&amp;/g, '&').replace(/&quot;/g, '"');

        // Title is first line of description or truncated description
        const title = cleanAlt.split('\n')[0].substring(0, 100).trim() || 'Instagram Post';

        console.log(`Processing: ${cleanId} - ${title.substring(0, 30)}...`);

        const result = await prisma.portfolioItem.upsert({
            where: {
                platform_externalId: {
                    platform: PortfolioPlatform.INSTAGRAM,
                    externalId: cleanId,
                },
            },
            update: {
                title: title,
                description: cleanAlt,
                thumbnailUrl: cleanSrc,
                mediaUrl: `https://www.instagram.com/p/${cleanId}/`,
                isVisible: true,
            },
            create: {
                title: title,
                description: cleanAlt,
                thumbnailUrl: cleanSrc,
                mediaUrl: `https://www.instagram.com/p/${cleanId}/`,
                platform: PortfolioPlatform.INSTAGRAM,
                category: PortfolioCategory.VIDEO, // Assuming mostly reels based on user context
                externalId: cleanId,
                isVisible: true,
                displayOrder: 0,
                tags: ['instagram', 'reels'],
            },
        });
        count++;
    }

    console.log(`✅ Synced ${count} Instagram items.`);
}

// Allow running directly
if (require.main === module) {
    const prisma = new PrismaClient();
    seed(prisma)
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
