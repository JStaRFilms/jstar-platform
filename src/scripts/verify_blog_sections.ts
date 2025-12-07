
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBlogSections() {
    console.log('Checking for sections containing "blog"...');

    const sections = await prisma.pageSection.findMany({
        where: {
            OR: [
                { title: { contains: 'blog', mode: 'insensitive' } },
                { elementId: { contains: 'blog', mode: 'insensitive' } }
            ]
        },
        include: {
            page: true
        }
    });

    console.log('Found sections:', JSON.stringify(sections.map(s => ({
        title: s.title,
        elementId: s.elementId,
        page: s.page.url
    })), null, 2));
}

checkBlogSections()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
