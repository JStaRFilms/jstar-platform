import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed AI Providers and Models
 * 
 * Run with: npx ts-node prisma/seed-ai-models.ts
 * Or: npx tsx prisma/seed-ai-models.ts
 */
async function main() {
    console.log('🌱 Seeding AI Providers and Models...\n');

    // ============================================
    // PROVIDERS
    // ============================================

    const googleProvider = await prisma.aIProvider.upsert({
        where: { name: 'google' },
        update: {},
        create: {
            name: 'google',
            displayName: 'Google Gemini',
            apiKey: null, // Uses GOOGLE_GENERATIVE_AI_API_KEY env var
            isEnabled: true,
            sortOrder: 1,
        },
    });
    console.log('✅ Google Gemini provider created/updated');

    const groqProvider = await prisma.aIProvider.upsert({
        where: { name: 'groq' },
        update: {},
        create: {
            name: 'groq',
            displayName: 'Groq',
            apiKey: null, // Uses GROQ_API_KEY env var
            isEnabled: true,
            sortOrder: 2,
        },
    });
    console.log('✅ Groq provider created/updated');

    const openaiProvider = await prisma.aIProvider.upsert({
        where: { name: 'openai' },
        update: {},
        create: {
            name: 'openai',
            displayName: 'OpenAI',
            apiKey: null, // Uses OPENAI_API_KEY env var
            isEnabled: true,
            sortOrder: 3,
        },
    });
    console.log('✅ OpenAI provider created/updated');

    const anthropicProvider = await prisma.aIProvider.upsert({
        where: { name: 'anthropic' },
        update: {},
        create: {
            name: 'anthropic',
            displayName: 'Anthropic',
            apiKey: null, // Uses ANTHROPIC_API_KEY env var
            isEnabled: false, // Disabled by default until API key is added
            sortOrder: 4,
        },
    });
    console.log('✅ Anthropic provider created/updated');

    // ============================================
    // GOOGLE GEMINI MODELS (from your screenshots)
    // ============================================

    const geminiModels = [
        {
            modelId: 'gemini-2.5-flash',
            displayName: 'Gemini 2.5 Flash',
            description: 'Fast, versatile model with 1M context. Great for most tasks.',
            contextWindow: 250000,
            hasVision: true,
            requestsPerMinute: 10,
            tokensPerMinute: 250000,
            maxOutputTokens: 250,
            isDefault: true,
            sortOrder: 1,
        },
        {
            modelId: 'gemini-2.5-flash-lite',
            displayName: 'Gemini 2.5 Flash Lite',
            description: 'Lightweight version for simple tasks. Lower cost.',
            contextWindow: 250000,
            hasVision: false,
            requestsPerMinute: 15,
            tokensPerMinute: 250000,
            maxOutputTokens: 1000,
            sortOrder: 2,
        },
        {
            modelId: 'gemini-2.5-pro',
            displayName: 'Gemini 2.5 Pro',
            description: 'Most capable Gemini model. Best for complex reasoning.',
            contextWindow: 125000,
            hasVision: true,
            requestsPerMinute: 2,
            tokensPerMinute: 125000,
            maxOutputTokens: 50,
            isPremium: true,
            minTier: 'TIER1' as const,
            sortOrder: 3,
        },
        {
            modelId: 'gemini-2.5-flash-tts',
            displayName: 'Gemini 2.5 Flash TTS',
            description: 'Multi-modal generative model for text-to-speech.',
            contextWindow: 10000,
            hasVision: false,
            requestsPerMinute: 3,
            tokensPerMinute: 10000,
            maxOutputTokens: 15,
            sortOrder: 4,
        },
        {
            modelId: 'gemini-2.0-flash',
            displayName: 'Gemini 2.0 Flash',
            description: 'Previous generation fast model with 1M context.',
            contextWindow: 1000000,
            hasVision: true,
            requestsPerMinute: 15,
            tokensPerMinute: 1000000,
            maxOutputTokens: 200,
            sortOrder: 5,
        },
        {
            modelId: 'gemini-2.0-flash-lite',
            displayName: 'Gemini 2.0 Flash Lite',
            description: 'Lightweight previous gen model for simple tasks.',
            contextWindow: 1000000,
            hasVision: false,
            requestsPerMinute: 30,
            tokensPerMinute: 1000000,
            maxOutputTokens: 200,
            sortOrder: 6,
        },
        {
            modelId: 'gemini-2.0-flash-live',
            displayName: 'Gemini 2.0 Flash Live',
            description: 'Live API model for real-time applications.',
            contextWindow: 1000000,
            hasVision: true,
            requestsPerMinute: null, // Unlimited
            tokensPerMinute: 1000000,
            maxOutputTokens: null, // Unlimited
            sortOrder: 7,
        },
        {
            modelId: 'gemini-2.5-flash-live',
            displayName: 'Gemini 2.5 Flash Live',
            description: 'Latest live API model for real-time applications.',
            contextWindow: 1000000,
            hasVision: true,
            requestsPerMinute: null, // Unlimited
            tokensPerMinute: 1000000,
            maxOutputTokens: null, // Unlimited
            sortOrder: 8,
        },
        {
            modelId: 'gemini-2.5-flash-native-audio-dialog',
            displayName: 'Gemini 2.5 Flash Native Audio',
            description: 'Native audio dialog model.',
            contextWindow: 1000000,
            hasVision: false,
            requestsPerMinute: null, // Unlimited
            tokensPerMinute: 1000000,
            maxOutputTokens: null, // Unlimited
            sortOrder: 9,
        },
        {
            modelId: 'gemini-3-pro',
            displayName: 'Gemini 3 Pro',
            description: 'Next generation flagship model. Extremely capable.',
            contextWindow: 125000,
            hasVision: true,
            requestsPerMinute: null,
            tokensPerMinute: 125000,
            maxOutputTokens: null,
            isPremium: true,
            minTier: 'TIER2' as const,
            sortOrder: 10,
        },
        {
            modelId: 'learnlm-2.0-flash-experimental',
            displayName: 'LearnLM 2.0 Flash',
            description: 'Experimental learning model.',
            contextWindow: null,
            hasVision: false,
            requestsPerMinute: 15,
            tokensPerMinute: null,
            maxOutputTokens: 1500,
            sortOrder: 11,
        },
        {
            modelId: 'gemma-3-1b',
            displayName: 'Gemma 3 1B',
            description: 'Lightweight open Gemma model.',
            contextWindow: 15000,
            hasVision: false,
            requestsPerMinute: 30,
            tokensPerMinute: 15000,
            maxOutputTokens: 14400,
            sortOrder: 12,
        },
        {
            modelId: 'gemma-3-2b',
            displayName: 'Gemma 3 2B',
            description: 'Small open Gemma model.',
            contextWindow: 15000,
            hasVision: false,
            requestsPerMinute: 30,
            tokensPerMinute: 15000,
            maxOutputTokens: 14400,
            sortOrder: 13,
        },
        {
            modelId: 'gemma-3-4b',
            displayName: 'Gemma 3 4B',
            description: 'Medium open Gemma model.',
            contextWindow: 15000,
            hasVision: false,
            requestsPerMinute: 30,
            tokensPerMinute: 15000,
            maxOutputTokens: 14400,
            sortOrder: 14,
        },
        {
            modelId: 'gemma-3-12b',
            displayName: 'Gemma 3 12B',
            description: 'Large open Gemma model.',
            contextWindow: 15000,
            hasVision: false,
            requestsPerMinute: 30,
            tokensPerMinute: 15000,
            maxOutputTokens: 14400,
            sortOrder: 15,
        },
        {
            modelId: 'gemma-3-27b',
            displayName: 'Gemma 3 27B',
            description: 'Largest open Gemma model.',
            contextWindow: 15000,
            hasVision: false,
            requestsPerMinute: 30,
            tokensPerMinute: 15000,
            maxOutputTokens: 14400,
            sortOrder: 16,
        },
        {
            modelId: 'gemini-2.0-flash-exp',
            displayName: 'Gemini 2.0 Flash Exp',
            description: 'Experimental text-out model.',
            contextWindow: null,
            hasVision: false,
            requestsPerMinute: null,
            tokensPerMinute: null,
            maxOutputTokens: 50,
            sortOrder: 17,
        },
        {
            modelId: 'gemini-robotics-er-1.5-preview',
            displayName: 'Gemini Robotics ER 1.5',
            description: 'Robotics preview model.',
            contextWindow: 250000,
            hasVision: true,
            requestsPerMinute: null,
            tokensPerMinute: 250000,
            maxOutputTokens: 14400,
            isPremium: true,
            minTier: 'TIER2' as const,
            sortOrder: 18,
        },
    ];

    for (const model of geminiModels) {
        await prisma.aIModel.upsert({
            where: {
                providerId_modelId: {
                    providerId: googleProvider.id,
                    modelId: model.modelId,
                },
            },
            update: {
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                hasVision: model.hasVision,
                requestsPerMinute: model.requestsPerMinute,
                tokensPerMinute: model.tokensPerMinute,
                maxOutputTokens: model.maxOutputTokens,
                isPremium: model.isPremium || false,
                minTier: model.minTier || 'GUEST',
                isDefault: model.isDefault || false,
                sortOrder: model.sortOrder,
            },
            create: {
                providerId: googleProvider.id,
                modelId: model.modelId,
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                hasVision: model.hasVision,
                requestsPerMinute: model.requestsPerMinute,
                tokensPerMinute: model.tokensPerMinute,
                maxOutputTokens: model.maxOutputTokens,
                isPremium: model.isPremium || false,
                minTier: model.minTier || 'GUEST',
                isDefault: model.isDefault || false,
                sortOrder: model.sortOrder,
                tags: ['google', 'gemini'],
            },
        });
    }
    console.log(`✅ ${geminiModels.length} Gemini models created/updated`);

    // ============================================
    // GROQ MODELS (from your screenshots)
    // ============================================

    const groqModels = [
        {
            modelId: 'meta-llama/llama-4-maverick-17b-128e-instruct',
            displayName: 'Llama 4 Maverick 17B',
            description: 'Latest Llama model. Fast inference on Groq.',
            contextWindow: 500000,
            requestsPerMinute: 30,
            requestsPerDay: 1000,
            tokensPerMinute: 6000,
            isFeatured: true,
            sortOrder: 1,
        },
        {
            modelId: 'meta-llama/llama-4-scout-17b-16e-instruct',
            displayName: 'Llama 4 Scout 17B',
            description: 'Efficient Llama 4 variant. 30K tokens/min.',
            contextWindow: 500000,
            requestsPerMinute: 30,
            requestsPerDay: 1000,
            tokensPerMinute: 30000,
            isFeatured: true,
            sortOrder: 2,
        },
        {
            modelId: 'llama-3.3-70b-versatile',
            displayName: 'Llama 3.3 70B Versatile',
            description: 'Powerful 70B model for complex tasks.',
            contextWindow: 100000,
            requestsPerMinute: 30,
            requestsPerDay: 1000,
            tokensPerMinute: 12000,
            isFeatured: true,
            sortOrder: 3,
        },
        {
            modelId: 'llama-3.1-8b-instant',
            displayName: 'Llama 3.1 8B Instant',
            description: 'Fast 8B model for quick responses.',
            contextWindow: 500000,
            requestsPerMinute: 30,
            requestsPerDay: 14400,
            tokensPerMinute: 6000,
            isFeatured: true,
            sortOrder: 4,
        },
        {
            modelId: 'groq/compound',
            displayName: 'Groq Compound',
            description: 'Groq compound model with 70K tokens/min.',
            contextWindow: null,
            requestsPerMinute: 30,
            requestsPerDay: 250,
            tokensPerMinute: 70000,
            isFeatured: true,
            sortOrder: 5,
        },
        {
            modelId: 'groq/compound-mini',
            displayName: 'Groq Compound Mini',
            description: 'Lightweight compound model.',
            contextWindow: null,
            requestsPerMinute: 30,
            requestsPerDay: 250,
            tokensPerMinute: 70000,
            sortOrder: 6,
        },
        {
            modelId: 'allam-2-7b',
            displayName: 'Allam 2 7B',
            description: 'Arabic language model from Groq.',
            contextWindow: 500000,
            requestsPerMinute: 30,
            requestsPerDay: 7000,
            tokensPerMinute: 6000,
            tokensPerDay: 500000,
            sortOrder: 7,
        },
        {
            modelId: 'moonshotai/kimi-k2-instruct',
            displayName: 'Kimi K2 Instruct',
            description: 'MoonshotAI model. High throughput.',
            contextWindow: 300000,
            requestsPerMinute: 60,
            requestsPerDay: 1000,
            tokensPerMinute: 10000,
            tokensPerDay: 300000,
            sortOrder: 8,
        },
        {
            modelId: 'moonshotai/kimi-k2-instruct-0905',
            displayName: 'Kimi K2 Instruct 0905',
            description: 'Updated MoonshotAI model.',
            contextWindow: 300000,
            requestsPerMinute: 60,
            requestsPerDay: 1000,
            tokensPerMinute: 10000,
            tokensPerDay: 300000,
            sortOrder: 9,
        },
        {
            modelId: 'qwen/qwen3-32b',
            displayName: 'Qwen 3 32B',
            description: 'Alibaba Qwen model.',
            contextWindow: 500000,
            requestsPerMinute: 60,
            requestsPerDay: 1000,
            tokensPerMinute: 6000,
            tokensPerDay: 500000,
            sortOrder: 10,
        },
        {
            modelId: 'openai/gpt-oss-120b',
            displayName: 'GPT OSS 120B',
            description: 'Open source GPT variant on Groq.',
            contextWindow: 200000,
            requestsPerMinute: 30,
            requestsPerDay: 1000,
            tokensPerMinute: 8000,
            tokensPerDay: 200000,
            sortOrder: 11,
        },
        {
            modelId: 'openai/gpt-oss-20b',
            displayName: 'GPT OSS 20B',
            description: 'Smaller open source GPT variant.',
            contextWindow: 200000,
            requestsPerMinute: 30,
            requestsPerDay: 1000,
            tokensPerMinute: 8000,
            tokensPerDay: 200000,
            sortOrder: 12,
        },
        {
            modelId: 'openai/gpt-oss-safeguard-20b',
            displayName: 'GPT OSS Safeguard 20B',
            description: 'Safety-focused GPT variant.',
            contextWindow: 200000,
            requestsPerMinute: 30,
            requestsPerDay: 1000,
            tokensPerMinute: 8000,
            tokensPerDay: 200000,
            sortOrder: 13,
        },
        {
            modelId: 'meta-llama/llama-guard-4-12b',
            displayName: 'Llama Guard 4 12B',
            description: 'Content safety model.',
            contextWindow: 500000,
            requestsPerMinute: 30,
            requestsPerDay: 14400,
            tokensPerMinute: 15000,
            sortOrder: 14,
        },
        {
            modelId: 'meta-llama/llama-prompt-guard-2-22m',
            displayName: 'Llama Prompt Guard 22M',
            description: 'Prompt injection detection (small).',
            contextWindow: 500000,
            requestsPerMinute: 30,
            requestsPerDay: 14400,
            tokensPerMinute: 15000,
            sortOrder: 15,
        },
        {
            modelId: 'meta-llama/llama-prompt-guard-2-86m',
            displayName: 'Llama Prompt Guard 86M',
            description: 'Prompt injection detection (large).',
            contextWindow: 500000,
            requestsPerMinute: 30,
            requestsPerDay: 14400,
            tokensPerMinute: 15000,
            sortOrder: 16,
        },
        {
            modelId: 'whisper-large-v3',
            displayName: 'Whisper Large V3',
            description: 'Speech-to-text model.',
            contextWindow: null,
            requestsPerMinute: 20,
            requestsPerDay: 2000,
            hasVision: false,
            sortOrder: 17,
            tags: ['audio', 'speech-to-text'],
        },
        {
            modelId: 'whisper-large-v3-turbo',
            displayName: 'Whisper Large V3 Turbo',
            description: 'Fast speech-to-text model.',
            contextWindow: null,
            requestsPerMinute: 20,
            requestsPerDay: 2000,
            sortOrder: 18,
            tags: ['audio', 'speech-to-text'],
        },
        {
            modelId: 'playai-tts',
            displayName: 'PlayAI TTS',
            description: 'Text-to-speech model.',
            contextWindow: null,
            requestsPerMinute: 10,
            requestsPerDay: 100,
            tokensPerMinute: 1200,
            tokensPerDay: 3600,
            sortOrder: 19,
            tags: ['audio', 'text-to-speech'],
        },
        {
            modelId: 'playai-tts-arabic',
            displayName: 'PlayAI TTS Arabic',
            description: 'Arabic text-to-speech model.',
            contextWindow: null,
            requestsPerMinute: 10,
            requestsPerDay: 100,
            tokensPerMinute: 1200,
            tokensPerDay: 3600,
            sortOrder: 20,
            tags: ['audio', 'text-to-speech'],
        },
    ];

    for (const model of groqModels) {
        await prisma.aIModel.upsert({
            where: {
                providerId_modelId: {
                    providerId: groqProvider.id,
                    modelId: model.modelId,
                },
            },
            update: {
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                requestsPerMinute: model.requestsPerMinute,
                requestsPerDay: model.requestsPerDay,
                tokensPerMinute: model.tokensPerMinute,
                sortOrder: model.sortOrder,
            },
            create: {
                providerId: groqProvider.id,
                modelId: model.modelId,
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                requestsPerMinute: model.requestsPerMinute,
                requestsPerDay: model.requestsPerDay,
                tokensPerMinute: model.tokensPerMinute,
                sortOrder: model.sortOrder,
                tags: (model as any).tags || ['groq', 'llama'],
            },
        });
    }
    console.log(`✅ ${groqModels.length} Groq models created/updated`);

    // ============================================
    // OPENAI MODELS (common ones)
    // ============================================

    const openaiModels = [
        {
            modelId: 'gpt-4o',
            displayName: 'GPT-4o',
            description: 'Most capable GPT model. Excellent for complex tasks.',
            contextWindow: 128000,
            hasVision: true,
            isPremium: true,
            minTier: 'TIER1' as const,
            sortOrder: 1,
        },
        {
            modelId: 'gpt-4o-mini',
            displayName: 'GPT-4o Mini',
            description: 'Fast, affordable GPT-4 class model.',
            contextWindow: 128000,
            hasVision: true,
            sortOrder: 2,
        },
        {
            modelId: 'gpt-4-turbo',
            displayName: 'GPT-4 Turbo',
            description: 'Previous flagship with 128K context.',
            contextWindow: 128000,
            hasVision: true,
            isPremium: true,
            minTier: 'TIER2' as const,
            sortOrder: 3,
        },
        {
            modelId: 'o1',
            displayName: 'o1 (Reasoning)',
            description: 'Advanced reasoning model. Thinks step-by-step.',
            contextWindow: 200000,
            isPremium: true,
            minTier: 'TIER2' as const,
            sortOrder: 4,
        },
        {
            modelId: 'o1-mini',
            displayName: 'o1 Mini',
            description: 'Smaller reasoning model. Good for coding.',
            contextWindow: 128000,
            isPremium: true,
            minTier: 'TIER1' as const,
            sortOrder: 5,
        },
    ];

    for (const model of openaiModels) {
        await prisma.aIModel.upsert({
            where: {
                providerId_modelId: {
                    providerId: openaiProvider.id,
                    modelId: model.modelId,
                },
            },
            update: {
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                hasVision: model.hasVision || false,
                isPremium: model.isPremium || false,
                minTier: model.minTier || 'GUEST',
                sortOrder: model.sortOrder,
            },
            create: {
                providerId: openaiProvider.id,
                modelId: model.modelId,
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                hasVision: model.hasVision || false,
                isPremium: model.isPremium || false,
                minTier: model.minTier || 'GUEST',
                sortOrder: model.sortOrder,
                tags: ['openai', 'gpt'],
            },
        });
    }
    console.log(`✅ ${openaiModels.length} OpenAI models created/updated`);

    // ============================================
    // ANTHROPIC MODELS (common ones)
    // ============================================

    const anthropicModels = [
        {
            modelId: 'claude-sonnet-4-20250514',
            displayName: 'Claude Sonnet 4',
            description: 'Latest Claude model. Excellent at coding and analysis.',
            contextWindow: 200000,
            hasVision: true,
            isPremium: true,
            minTier: 'TIER2' as const,
            sortOrder: 1,
        },
        {
            modelId: 'claude-3-5-sonnet-20241022',
            displayName: 'Claude 3.5 Sonnet',
            description: 'Previous Claude flagship. Great balance of speed and quality.',
            contextWindow: 200000,
            hasVision: true,
            isPremium: true,
            minTier: 'TIER1' as const,
            sortOrder: 2,
        },
        {
            modelId: 'claude-3-5-haiku-20241022',
            displayName: 'Claude 3.5 Haiku',
            description: 'Fast Claude model for simple tasks.',
            contextWindow: 200000,
            hasVision: true,
            sortOrder: 3,
        },
    ];

    for (const model of anthropicModels) {
        await prisma.aIModel.upsert({
            where: {
                providerId_modelId: {
                    providerId: anthropicProvider.id,
                    modelId: model.modelId,
                },
            },
            update: {
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                hasVision: model.hasVision,
                isPremium: model.isPremium || false,
                minTier: model.minTier || 'GUEST',
                sortOrder: model.sortOrder,
            },
            create: {
                providerId: anthropicProvider.id,
                modelId: model.modelId,
                displayName: model.displayName,
                description: model.description,
                contextWindow: model.contextWindow,
                hasVision: model.hasVision,
                isPremium: model.isPremium || false,
                minTier: model.minTier || 'GUEST',
                sortOrder: model.sortOrder,
                tags: ['anthropic', 'claude'],
            },
        });
    }
    console.log(`✅ ${anthropicModels.length} Anthropic models created/updated`);

    // ============================================
    // SUMMARY
    // ============================================

    const totalProviders = await prisma.aIProvider.count();
    const totalModels = await prisma.aIModel.count();

    console.log('\n========================================');
    console.log(`🎉 Seeding complete!`);
    console.log(`   Providers: ${totalProviders}`);
    console.log(`   Models: ${totalModels}`);
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
