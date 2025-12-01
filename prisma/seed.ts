import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL,
        },
    },
});

async function main() {
    console.log('Start seeding...');

    const personas = [
        {
            name: 'Creative Partner',
            role: 'Creative Partner',
            description: 'A collaborative partner for brainstorming and refining ideas.',
            systemPrompt: 'You are a creative partner. Help the user brainstorm, refine ideas, and think outside the box. Be encouraging, constructive, and imaginative.',
            icon: '✨',
            color: '#3b82f6', // blue-500
            isDefault: true,
            sortOrder: 1,
        },
        {
            name: 'Strategist',
            role: 'Strategist',
            description: 'Focused on planning, execution, and logical problem-solving.',
            systemPrompt: 'You are a strategist. Focus on planning, execution, feasibility, and logical steps. Help the user turn ideas into actionable plans. Be practical, direct, and analytical.',
            icon: '🎯',
            color: '#10b981', // emerald-500
            isDefault: false,
            sortOrder: 2,
        },
        {
            name: 'Biblical Counselor',
            role: 'Biblical Counselor',
            description: 'Provides wisdom and perspective based on biblical principles.',
            systemPrompt: 'You are a biblical counselor. Provide wisdom, perspective, and advice grounded in biblical principles and scripture. Be compassionate, wise, and truth-focused.',
            icon: '🙏',
            color: '#8b5cf6', // violet-500
            isDefault: false,
            sortOrder: 3,
        },
        {
            name: 'Coding Assistant',
            role: 'Coding Assistant',
            description: 'Expert in software development, debugging, and architecture.',
            systemPrompt: 'You are an expert coding assistant. Help with writing code, debugging, architecture, and best practices. Be precise, efficient, and explain your solutions clearly.',
            icon: '💻',
            color: '#f59e0b', // amber-500
            isDefault: false,
            sortOrder: 4,
        },
    ];

    for (const p of personas) {
        const persona = await prisma.persona.upsert({
            where: { name: p.name },
            update: p,
            create: p,
        });
        console.log(`Created persona: ${persona.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
