
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBlogRoutes() {
    console.log('Checking for routes containing "blog"...');

    const routes = await prisma.pageNavigation.findMany({
        where: {
            url: { contains: 'blog' }
        },
        select: {
            id: true,
            url: true,
            title: true,
            isActive: true,
            requiredTier: true
        }
    });

    console.log('Found routes:', JSON.stringify(routes, null, 2));
}

checkBlogRoutes()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
