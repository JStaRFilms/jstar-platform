
import { PromptManager } from '../lib/ai/prompt-manager';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function main() {
    console.log('🕵️‍♀️ Verifying PromptManager Output...\n');

    try {
        // Test Guest Widget Context
        console.log('--- Testing Guest Widget Context ---');
        const guestPrompt = await PromptManager.getSystemPrompt({
            role: 'Universal',
            context: 'widget',
            user: undefined // Guest
        });

        if (guestPrompt.includes('ALWAYS use the searchKnowledge tool first')) {
            console.log('✅ Guest Prompt contains new instruction.');
        } else {
            console.error('❌ Guest Prompt MISSING new instruction!');
            console.log('Snippet:', guestPrompt.slice(-500));
        }

        // Test Registered User Context
        console.log('\n--- Testing Registered User Context ---');
        const registeredPrompt = await PromptManager.getSystemPrompt({
            role: 'Universal',
            context: 'widget',
            user: { tier: 'TIER1' }
        });

        if (registeredPrompt.includes('ALWAYS use the searchKnowledge tool first')) {
            console.log('✅ Registered User Prompt contains new instruction.');
        } else {
            console.error('❌ Registered User Prompt MISSING new instruction!');
        }

        // Test Full Page Context
        console.log('\n--- Testing Full Page Context ---');
        const fullPagePrompt = await PromptManager.getSystemPrompt({
            role: 'Universal',
            context: 'full-page',
            user: { tier: 'TIER1' }
        });

        if (fullPagePrompt.includes('use the searchKnowledge tool')) {
            console.log('✅ Full Page Prompt contains new instruction.');
        } else {
            console.error('❌ Full Page Prompt MISSING new instruction!');
        }

    } catch (error) {
        console.error('❌ Error verifying prompt:', error);
    }
}

main();
